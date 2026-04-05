const express = require('express');
const db = require('../db');
const { requireAdmin } = require('../middleware/auth');
const router = express.Router();

router.get('/', (req, res) => {
  const products = db.prepare('SELECT * FROM products ORDER BY created_at DESC').all();
  res.json(products);
});

router.get('/:id', (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!product) return res.status(404).json({ error: 'Not found' });
  res.json(product);
});

router.post('/', requireAdmin, (req, res) => {
  const { name, description, buy_price, sell_price, category, brand, sizes, condition, image_url, in_stock } = req.body;
  const stmt = db.prepare(`
    INSERT INTO products (name, description, buy_price, sell_price, category, brand, sizes, condition, image_url, in_stock) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const info = stmt.run(name, description, buy_price, sell_price, category, brand, sizes, condition, image_url, in_stock ? 1 : 0);
  res.json({ id: info.lastInsertRowid, success: true });
});

router.put('/:id', requireAdmin, (req, res) => {
  const { name, description, buy_price, sell_price, category, brand, sizes, condition, image_url, in_stock } = req.body;
  const stmt = db.prepare(`
    UPDATE products SET 
      name = ?, description = ?, buy_price = ?, sell_price = ?, category = ?, 
      brand = ?, sizes = ?, condition = ?, image_url = ?, in_stock = ?
    WHERE id = ?
  `);
  stmt.run(name, description, buy_price, sell_price, category, brand, sizes, condition, image_url, in_stock ? 1 : 0, req.params.id);
  res.json({ success: true });
});

router.delete('/:id', requireAdmin, (req, res) => {
  db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
