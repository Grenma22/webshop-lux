const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'shop.db');
const db = new Database(dbPath);

// Initialize DB schema
db.exec(`
  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    buy_price REAL NOT NULL,
    sell_price REAL NOT NULL,
    category TEXT NOT NULL,
    brand TEXT,
    sizes TEXT,
    condition TEXT,
    image_url TEXT,
    in_stock INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    total_amount REAL NOT NULL,
    stripe_session_id TEXT UNIQUE,
    status TEXT DEFAULT 'pending',
    shipping_name TEXT,
    shipping_address TEXT,
    shipping_city TEXT,
    shipping_zip TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    size TEXT,
    FOREIGN KEY(order_id) REFERENCES orders(id),
    FOREIGN KEY(product_id) REFERENCES products(id)
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );
`);

// Seed default settings if empty
const settingsCount = db.prepare('SELECT COUNT(*) as count FROM settings').get().count;
if (settingsCount === 0) {
  const insertSetting = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)');
  insertSetting.run('shop_name', 'LUX. Shop');
  insertSetting.run('vat_rate', '19');
  insertSetting.run('free_shipping_threshold', '100');
  insertSetting.run('contact_email', 'atellier@lux-shop.de');
  console.log('Created default shop settings');
}

// Seed default admins if empty
const adminCount = db.prepare('SELECT COUNT(*) as count FROM admins').get().count;
if (adminCount === 0) {
  const insertAdmin = db.prepare('INSERT INTO admins (username, password) VALUES (?, ?)');
  const defaultPass = bcrypt.hashSync('admin123', 10);
  insertAdmin.run('admin1', defaultPass);
  insertAdmin.run('admin2', defaultPass);
  console.log('Created default admins: admin1 / admin123, admin2 / admin123');
}

// Seed dummy products if empty
const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get().count;
if (productCount === 0) {
  const insertStmt = db.prepare(`
    INSERT INTO products 
    (name, description, buy_price, sell_price, category, brand, sizes, condition, image_url, in_stock) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  insertStmt.run(
    'Vintage Oversized Hoodie', 
    'Autentischer 90s Vintage Hoodie in grau. Sehr guter Zustand, frisch gewaschen.', 
    15.00, 49.99, 'Streetwear', 'Nike', 'L,XL', 'Gut', 
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800', 1
  );
  
  insertStmt.run(
    'Designer Sneaker Retro', 
    'Limitierte Sneaker aus aktueller Kollektion. Ungetragen mit Box.', 
    120.00, 249.99, 'Schuhe', 'Balenciaga', '42,43', 'Neu', 
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=800', 1
  );
  
  insertStmt.run(
    'Lederjacke Biker Style', 
    'Schweres Leder, vintage patina. Ein echtes Unikat.', 
    45.00, 159.00, 'Vintage', 'Schott', 'M', 'Wie Neu', 
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800', 1
  );
  console.log('Created demo products');
}

module.exports = db;
