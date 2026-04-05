const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const db = require('../db');
const { requireAdmin } = require('../middleware/auth');
const router = express.Router();

router.get('/', requireAdmin, (req, res) => {
  const orders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
  // Attach items to orders
  for (let order of orders) {
    order.items = db.prepare(`
      SELECT oi.*, p.name, p.image_url 
      FROM order_items oi 
      JOIN products p ON oi.product_id = p.id 
      WHERE oi.order_id = ?
    `).all(order.id);
  }
  res.json(orders);
});

router.put('/:id/status', requireAdmin, (req, res) => {
  const { status } = req.body;
  db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, req.params.id);
  res.json({ success: true });
});

// Create Stripe Checkout Session
router.post('/checkout', async (req, res) => {
  try {
    const { items, customer_email } = req.body; // items = [{ product_id, quantity, size }]
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const line_items = [];
    let total_amount = 0;
    const orderItemsData = [];

    for (let item of items) {
      const product = db.prepare('SELECT * FROM products WHERE id = ?').get(item.product_id);
      if (!product) continue;

      total_amount += product.sell_price * item.quantity;
      orderItemsData.push({ ...item, sell_price: product.sell_price });

      line_items.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: product.name,
            images: [product.image_url].filter(Boolean),
            description: "Size: " + (item.size || 'N/A') + " | Condition: " + product.condition
          },
          unit_amount: Math.round(product.sell_price * 100),
        },
        quantity: item.quantity,
      });
    }

    // Add shipping if > 0 (e.g. flat rate or free)
    // Here: free shipping
    
    // Create pending order
    const insertOrder = db.prepare('INSERT INTO orders (email, total_amount, status) VALUES (?, ?, ?)');
    const orderInfo = insertOrder.run(customer_email || 'guest@example.com', total_amount, 'pending');
    const orderId = orderInfo.lastInsertRowid;

    // Insert items
    const insertItem = db.prepare('INSERT INTO order_items (order_id, product_id, quantity, size) VALUES (?, ?, ?, ?)');
    for (let data of orderItemsData) {
      insertItem.run(orderId, data.product_id, data.quantity, data.size || '');
    }

    // Stripe Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'paypal', 'klarna'],
      line_items,
      mode: 'payment',
      customer_email,
      shipping_address_collection: {
        allowed_countries: ['DE', 'AT', 'CH']
      },
      success_url: "http://localhost:5173/order-confirmation?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:5173/checkout",
      metadata: {
        order_id: orderId.toString()
      }
    });

    // Update order with session_id
    db.prepare('UPDATE orders SET stripe_session_id = ? WHERE id = ?').run(session.id, orderId);

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Webhook or success verify route
router.post('/verify-session', async (req, res) => {
  const { session_id } = req.body;
  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (session.payment_status === 'paid') {
      db.prepare('UPDATE orders SET status = ? WHERE stripe_session_id = ?').run('paid', session_id);
      
      // Save shipping details if available
      if (session.shipping_details && session.shipping_details.address) {
        const { name, address } = session.shipping_details;
        db.prepare(
          "UPDATE orders SET shipping_name = ?, shipping_address = ?, shipping_city = ?, shipping_zip = ? WHERE stripe_session_id = ?"
        ).run(name, address.line1, address.city, address.postal_code, session_id);
      }

      res.json({ success: true, order_id: session.metadata.order_id });
    } else {
      res.json({ success: false, status: session.payment_status });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
