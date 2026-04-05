const express = require('express');
const db = require('../db');
const { requireAdmin } = require('../middleware/auth');
const router = express.Router();

router.get('/dashboard', requireAdmin, (req, res) => {
  try {
    // 1. Total Stats
    const totalProducts = db.prepare('SELECT COUNT(*) as count FROM products').get().count;
    const totalOrders = db.prepare('SELECT COUNT(*) as count FROM orders').get().count;
    const totalRevenue = db.prepare("SELECT SUM(total_amount) as sum FROM orders WHERE status != 'cancelled' AND status != 'pending'").get().sum || 0;
    const pendingOrders = db.prepare("SELECT COUNT(*) as count FROM orders WHERE status = 'paid'").get().count;

    // 2. Sales by day (Last 7 days)
    const salesByDay = db.prepare(`
      SELECT date(created_at) as date, SUM(total_amount) as revenue, COUNT(*) as orders
      FROM orders 
      WHERE created_at >= date('now', '-7 days') AND status != 'cancelled' AND status != 'pending'
      GROUP BY date(created_at)
      ORDER BY date ASC
    `).all();

    // 3. Recent Orders (Last 5)
    const recentOrders = db.prepare(`
      SELECT o.*, (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
      FROM orders o
      ORDER BY created_at DESC
      LIMIT 5
    `).all();

    // 4. Low Stock Products
    const lowStock = db.prepare(`
      SELECT id, name, in_stock, image_url
      FROM products
      WHERE in_stock < 5
      ORDER BY in_stock ASC
      LIMIT 5
    `).all();

    res.json({
      summary: {
        products: totalProducts,
        orders: totalOrders,
        revenue: totalRevenue,
        pending: pendingOrders
      },
      salesByDay,
      recentOrders,
      lowStock
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
