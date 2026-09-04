const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, 'kisansetu.sqlite');
const db = new sqlite3.Database(dbPath);

// Enable foreign keys and WAL mode for reliability
db.run("PRAGMA foreign_keys = ON;");
db.run("PRAGMA journal_mode = WAL;");

const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

const getOne = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
};

const execute = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

const initSchema = async () => {
  await execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      mobile TEXT,
      role TEXT CHECK(role IN ('Farmer', 'FPO', 'Consumer', 'Bulk Buyer')) NOT NULL,
      location TEXT NOT NULL,
      avatar TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await execute(`
    CREATE TABLE IF NOT EXISTS farms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      farm_name TEXT NOT NULL,
      acreage REAL DEFAULT 4.5,
      location TEXT NOT NULL,
      soil_type TEXT DEFAULT 'Black Cotton / Alluvial',
      certified BOOLEAN DEFAULT 1,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  await execute(`
    CREATE TABLE IF NOT EXISTS fpos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      registration_number TEXT,
      member_count INTEGER DEFAULT 145,
      location TEXT NOT NULL,
      storage_capacity_mt REAL DEFAULT 250.0,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  await execute(`
    CREATE TABLE IF NOT EXISTS produce (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      farmer_name TEXT,
      crop_name TEXT NOT NULL,
      category TEXT DEFAULT 'Vegetables',
      quantity_available REAL NOT NULL,
      unit TEXT DEFAULT 'kg',
      grade TEXT CHECK(grade IN ('Grade A', 'Grade B', 'Standard', 'Export Quality')) NOT NULL,
      perishability TEXT CHECK(perishability IN ('Low', 'Medium', 'High')) DEFAULT 'High',
      harvest_date TEXT,
      available_from TEXT,
      expected_price REAL NOT NULL,
      location TEXT NOT NULL,
      latitude REAL,
      longitude REAL,
      description TEXT,
      image_url TEXT,
      status TEXT CHECK(status IN ('Available', 'Partially Allocated', 'Allocated', 'Sold Out')) DEFAULT 'Available',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  await execute(`
    CREATE TABLE IF NOT EXISTS buyer_requirements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      buyer_id INTEGER NOT NULL,
      buyer_name TEXT,
      buyer_org TEXT,
      crop_name TEXT NOT NULL,
      required_quantity REAL NOT NULL,
      unit TEXT DEFAULT 'kg',
      required_grade TEXT NOT NULL,
      max_price REAL NOT NULL,
      delivery_location TEXT NOT NULL,
      required_date TEXT NOT NULL,
      urgency TEXT DEFAULT 'Standard',
      status TEXT CHECK(status IN ('Open', 'Matching', 'Fulfilled', 'Closed')) DEFAULT 'Open',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  await execute(`
    CREATE TABLE IF NOT EXISTS aggregations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      requirement_id INTEGER,
      buyer_id INTEGER NOT NULL,
      crop_name TEXT NOT NULL,
      total_quantity REAL NOT NULL,
      average_price REAL NOT NULL,
      farmer_count INTEGER NOT NULL,
      hub_location TEXT DEFAULT 'KisanSetu Nashik Cluster Hub',
      delivery_destination TEXT NOT NULL,
      status TEXT CHECK(status IN ('Draft', 'Confirmed', 'Route Planned', 'Dispatched', 'Completed')) DEFAULT 'Confirmed',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (buyer_id) REFERENCES users(id)
    );
  `);

  await execute(`
    CREATE TABLE IF NOT EXISTS aggregation_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      aggregation_id INTEGER NOT NULL,
      produce_id INTEGER NOT NULL,
      farmer_id INTEGER NOT NULL,
      farmer_name TEXT NOT NULL,
      location TEXT NOT NULL,
      allocated_quantity REAL NOT NULL,
      unit_price REAL NOT NULL,
      grade TEXT NOT NULL,
      match_score INTEGER DEFAULT 90,
      FOREIGN KEY (aggregation_id) REFERENCES aggregations(id) ON DELETE CASCADE
    );
  `);

  await execute(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_number TEXT UNIQUE NOT NULL,
      buyer_id INTEGER NOT NULL,
      buyer_name TEXT NOT NULL,
      produce_id INTEGER,
      aggregation_id INTEGER,
      crop_name TEXT NOT NULL,
      grade TEXT NOT NULL,
      total_quantity REAL NOT NULL,
      unit_price REAL NOT NULL,
      logistics_fee REAL NOT NULL,
      platform_fee REAL NOT NULL,
      handling_fee REAL NOT NULL,
      total_amount REAL NOT NULL,
      delivery_location TEXT NOT NULL,
      status TEXT CHECK(status IN ('Placed', 'Matched', 'Aggregated', 'Route Planned', 'Picked Up', 'In Transit', 'Delivered', 'Cancelled')) DEFAULT 'Placed',
      estimated_delivery TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Safe non-destructive column migrations for existing databases
  try {
    await execute("ALTER TABLE produce ADD COLUMN perishability TEXT DEFAULT 'High'");
  } catch (e) {
    // Column already exists or table freshly created
  }
  try {
    await execute("ALTER TABLE orders ADD COLUMN produce_id INTEGER");
  } catch (e) {
    // Column already exists or table freshly created
  }

  await execute(`
    CREATE TABLE IF NOT EXISTS routes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      aggregation_id INTEGER,
      vehicle_type TEXT DEFAULT 'Eicher Pro 1.2T Refrigerated Van',
      vehicle_capacity_kg REAL DEFAULT 1500,
      total_load_kg REAL NOT NULL,
      estimated_distance_km REAL NOT NULL,
      estimated_duration_text TEXT NOT NULL,
      estimated_cost REAL NOT NULL,
      co2_saved_kg REAL DEFAULT 18.5,
      status TEXT DEFAULT 'Optimized',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    );
  `);

  await execute(`
    CREATE TABLE IF NOT EXISTS route_stops (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      route_id INTEGER NOT NULL,
      stop_order INTEGER NOT NULL,
      stop_type TEXT CHECK(stop_type IN ('PICKUP', 'HUB', 'DELIVERY')) NOT NULL,
      location_name TEXT NOT NULL,
      farmer_name TEXT,
      crop_name TEXT,
      quantity_kg REAL,
      lat REAL NOT NULL,
      lng REAL NOT NULL,
      arrival_time TEXT,
      status TEXT DEFAULT 'Pending',
      FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE
    );
  `);

  await execute(`
    CREATE TABLE IF NOT EXISTS price_breakdowns (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      crop_name TEXT UNIQUE NOT NULL,
      buyer_price REAL NOT NULL,
      farmer_payout REAL NOT NULL,
      aggregation_fee REAL NOT NULL,
      logistics_fee REAL NOT NULL,
      platform_fee REAL NOT NULL,
      handling_fee REAL NOT NULL,
      notes TEXT
    );
  `);

  await execute(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT DEFAULT 'info',
      is_read BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

module.exports = {
  db,
  query,
  getOne,
  execute,
  initSchema
};
