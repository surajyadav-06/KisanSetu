const bcrypt = require('bcryptjs');
const { execute, query, initSchema } = require('../database/db');

const seedDatabase = async () => {
  // Clear existing tables to ensure latest schema & constraints
  await execute('DROP TABLE IF EXISTS notifications;');
  await execute('DROP TABLE IF EXISTS route_stops;');
  await execute('DROP TABLE IF EXISTS routes;');
  await execute('DROP TABLE IF EXISTS orders;');
  await execute('DROP TABLE IF EXISTS aggregation_items;');
  await execute('DROP TABLE IF EXISTS aggregations;');
  await execute('DROP TABLE IF EXISTS buyer_requirements;');
  await execute('DROP TABLE IF EXISTS produce;');
  await execute('DROP TABLE IF EXISTS fpos;');
  await execute('DROP TABLE IF EXISTS farms;');
  await execute('DROP TABLE IF EXISTS price_breakdowns;');
  await execute('DROP TABLE IF EXISTS users;');

  await initSchema();

  const defaultPasswordHash = await bcrypt.hash('password123', 8);

  // 1. Seed Users (Farmers, FPOs, Bulk Buyers, Consumers)
  const users = [
    {
      id: 1,
      full_name: 'Ramesh Patil (Demo Farmer)',
      email: 'farmer@kisansetu.in',
      mobile: '+91 98220 11442',
      role: 'Farmer',
      location: 'Nashik, Maharashtra',
      avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 2,
      full_name: 'Suresh Shinde (Farmer B)',
      email: 'suresh.shinde@kisansetu.in',
      mobile: '+91 98221 55663',
      role: 'Farmer',
      location: 'Nashik, Maharashtra',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 3,
      full_name: 'Vikas Gaikwad (Farmer C)',
      email: 'vikas.gaikwad@kisansetu.in',
      mobile: '+91 94223 88990',
      role: 'Farmer',
      location: 'Pune, Maharashtra',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 4,
      full_name: 'Anand Jadhav',
      email: 'anand.jadhav@kisansetu.in',
      mobile: '+91 98902 44331',
      role: 'Farmer',
      location: 'Ahmednagar, Maharashtra',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 5,
      full_name: 'Balasaheb Kadam',
      email: 'balasaheb.kadam@kisansetu.in',
      mobile: '+91 97654 32109',
      role: 'Farmer',
      location: 'Satara, Maharashtra',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 6,
      full_name: 'Sahyadri Farmers Producer Co. (Demo FPO)',
      email: 'fpo@kisansetu.in',
      mobile: '+91 98230 99887',
      role: 'FPO',
      location: 'Nashik Rural Hub',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 7,
      full_name: 'Taj Hotels & Fresh Mart Mumbai (Demo Bulk Buyer)',
      email: 'buyer@kisansetu.in',
      mobile: '+91 98200 44556',
      role: 'Bulk Buyer',
      location: 'Nariman Point, Mumbai',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 8,
      full_name: 'Priya Sharma (Demo Consumer)',
      email: 'consumer@kisansetu.in',
      mobile: '+91 98191 22334',
      role: 'Consumer',
      location: 'Bandra West, Mumbai',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    }
  ];

  for (const u of users) {
    await execute(
      `INSERT INTO users (id, full_name, email, password_hash, mobile, role, location, avatar)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [u.id, u.full_name, u.email, defaultPasswordHash, u.mobile, u.role, u.location, u.avatar]
    );
  }

  // 2. Seed Farms & FPOs
  await execute(`INSERT INTO farms (user_id, farm_name, acreage, location, soil_type, certified) VALUES 
    (1, 'Patil Organic Agri Farms', 6.2, 'Nashik, Maharashtra', 'Rich Black Alluvial', 1),
    (2, 'Shinde Fresh Produce Estate', 4.8, 'Nashik, Maharashtra', 'Volcanic Black Soil', 1),
    (3, 'Gaikwad Precision Orchards', 8.5, 'Pune, Maharashtra', 'Red Loam Soil', 1),
    (4, 'Jadhav Agrofields', 5.0, 'Ahmednagar, Maharashtra', 'Black Cotton Soil', 1),
    (5, 'Kadam Valley Farms', 7.2, 'Satara, Maharashtra', 'Alluvial Loam', 1);
  `);

  await execute(`INSERT INTO fpos (user_id, name, registration_number, member_count, location, storage_capacity_mt) VALUES
    (6, 'Sahyadri Farmers Producer Co.', 'MH/NSK/FPO-2021/8892', 184, 'Nashik Agro-Cluster Hub', 350.0);
  `);

  // 3. Seed Produce Supply Inventory
  const produceItems = [
    {
      user_id: 1,
      farmer_name: 'Ramesh Patil (Demo Farmer)',
      crop_name: 'Tomato',
      category: 'Vegetables',
      quantity_available: 500,
      unit: 'kg',
      grade: 'Grade A',
      perishability: 'High',
      harvest_date: '2026-09-08',
      available_from: '2026-09-10',
      expected_price: 28.0,
      location: 'Nashik, Maharashtra',
      latitude: 20.0059,
      longitude: 73.7898,
      description: 'Firm, sun-ripened Grade-A table tomatoes with high shelf life and vibrant red pigmentation.',
      image_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
      status: 'Available'
    },
    {
      user_id: 2,
      farmer_name: 'Suresh Shinde (Farmer B)',
      crop_name: 'Tomato',
      category: 'Vegetables',
      quantity_available: 300,
      unit: 'kg',
      grade: 'Grade A',
      perishability: 'High',
      harvest_date: '2026-09-07',
      available_from: '2026-09-10',
      expected_price: 27.0,
      location: 'Nashik, Maharashtra',
      latitude: 19.9975,
      longitude: 73.7910,
      description: 'Greenhouse grown premium Grade-A tomatoes, pesticide residue tested.',
      image_url: 'https://images.unsplash.com/photo-1582284540020-8acbe03f4924?auto=format&fit=crop&w=600&q=80',
      status: 'Available'
    },
    {
      user_id: 3,
      farmer_name: 'Vikas Gaikwad (Farmer C)',
      crop_name: 'Tomato',
      category: 'Vegetables',
      quantity_available: 200,
      unit: 'kg',
      grade: 'Grade A',
      perishability: 'High',
      harvest_date: '2026-09-08',
      available_from: '2026-09-10',
      expected_price: 29.0,
      location: 'Pune, Maharashtra',
      latitude: 18.5204,
      longitude: 73.8567,
      description: 'Hydroponic and drip irrigated hybrid tomatoes, uniform size and blemish-free.',
      image_url: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=600&q=80',
      status: 'Available'
    },
    {
      user_id: 1,
      farmer_name: 'Ramesh Patil (Demo Farmer)',
      crop_name: 'Onion',
      category: 'Vegetables',
      quantity_available: 750,
      unit: 'kg',
      grade: 'Grade A',
      perishability: 'Low',
      harvest_date: '2026-09-02',
      available_from: '2026-09-05',
      expected_price: 22.0,
      location: 'Nashik, Maharashtra',
      latitude: 20.0059,
      longitude: 73.7898,
      description: 'Medium to large cured red onions from Lasalgaon belt with low moisture content.',
      image_url: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80',
      status: 'Available'
    },
    {
      user_id: 4,
      farmer_name: 'Anand Jadhav',
      crop_name: 'Potato',
      category: 'Vegetables',
      quantity_available: 1200,
      unit: 'kg',
      grade: 'Grade A',
      perishability: 'Low',
      harvest_date: '2026-09-01',
      available_from: '2026-09-04',
      expected_price: 24.0,
      location: 'Ahmednagar, Maharashtra',
      latitude: 19.0952,
      longitude: 74.7496,
      description: 'Firm, dry-washed Jyoti variety potatoes suitable for culinary chips and retail consumption.',
      image_url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80',
      status: 'Available'
    },
    {
      user_id: 2,
      farmer_name: 'Suresh Shinde (Farmer B)',
      crop_name: 'Grapes',
      category: 'Fruits',
      quantity_available: 600,
      unit: 'kg',
      grade: 'Export Quality',
      perishability: 'High',
      harvest_date: '2026-09-06',
      available_from: '2026-09-09',
      expected_price: 65.0,
      location: 'Nashik, Maharashtra',
      latitude: 20.0012,
      longitude: 73.7845,
      description: 'Thomson Seedless sweet green grapes with 18+ Brix sweetness index.',
      image_url: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=600&q=80',
      status: 'Available'
    },
    {
      user_id: 5,
      farmer_name: 'Balasaheb Kadam',
      crop_name: 'Banana',
      category: 'Fruits',
      quantity_available: 1500,
      unit: 'kg',
      grade: 'Grade A',
      perishability: 'Medium',
      harvest_date: '2026-09-04',
      available_from: '2026-09-07',
      expected_price: 35.0,
      location: 'Satara, Maharashtra',
      latitude: 17.6805,
      longitude: 74.0183,
      description: 'Grand Naine robust bananas, naturally ethylene ripened without chemical carbide.',
      image_url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80',
      status: 'Available'
    }
  ];

  for (const p of produceItems) {
    await execute(
      `INSERT INTO produce (user_id, farmer_name, crop_name, category, quantity_available, unit, grade, perishability, harvest_date, available_from, expected_price, location, latitude, longitude, description, image_url, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        p.user_id,
        p.farmer_name,
        p.crop_name,
        p.category,
        p.quantity_available,
        p.unit,
        p.grade,
        p.perishability || 'High',
        p.harvest_date,
        p.available_from,
        p.expected_price,
        p.location,
        p.latitude,
        p.longitude,
        p.description,
        p.image_url,
        p.status
      ]
    );
  }

  // 4. Seed Buyer Requirements (Bulk Buyer: 1000 kg Grade-A Tomato for Mumbai)
  await execute(`
    INSERT INTO buyer_requirements (buyer_id, buyer_name, buyer_org, crop_name, required_quantity, unit, required_grade, max_price, delivery_location, required_date, urgency, status)
    VALUES (7, 'Taj Hospitality Group', 'Taj Luxury Hotels & Mumbai Fresh Mart', 'Tomato', 1000.0, 'kg', 'Grade A', 30.0, 'Mumbai Central Logistics Hub', '2026-09-10', 'High', 'Open');
  `);

  // 5. Seed Price Breakdown Benchmark Data
  const priceData = [
    {
      crop_name: 'Tomato',
      buyer_price: 32.0,
      farmer_payout: 27.0,
      aggregation_fee: 1.0,
      logistics_fee: 2.0,
      platform_fee: 1.0,
      handling_fee: 1.0,
      notes: 'Direct farm aggregation saving 24% over traditional APMC intermediary chains.'
    },
    {
      crop_name: 'Onion',
      buyer_price: 26.0,
      farmer_payout: 22.0,
      aggregation_fee: 0.8,
      logistics_fee: 1.6,
      platform_fee: 0.8,
      handling_fee: 0.8,
      notes: 'Bulk ventilated dispatch from Lasalgaon cluster.'
    },
    {
      crop_name: 'Potato',
      buyer_price: 28.0,
      farmer_payout: 24.0,
      aggregation_fee: 0.8,
      logistics_fee: 1.6,
      platform_fee: 0.8,
      handling_fee: 0.8,
      notes: 'Clean dry-bagged transit directly to institutional kitchens.'
    },
    {
      crop_name: 'Grapes',
      buyer_price: 78.0,
      farmer_payout: 65.0,
      aggregation_fee: 2.5,
      logistics_fee: 5.5,
      platform_fee: 2.5,
      handling_fee: 2.5,
      notes: 'Active Reefer Cold Chain maintained at 2°C - 4°C.'
    },
    {
      crop_name: 'Banana',
      buyer_price: 42.0,
      farmer_payout: 35.0,
      aggregation_fee: 1.5,
      logistics_fee: 2.5,
      platform_fee: 1.5,
      handling_fee: 1.5,
      notes: 'Cushioned crate packing minimizing bruising in transit.'
    }
  ];

  for (const pd of priceData) {
    await execute(
      `INSERT INTO price_breakdowns (crop_name, buyer_price, farmer_payout, aggregation_fee, logistics_fee, platform_fee, handling_fee, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [pd.crop_name, pd.buyer_price, pd.farmer_payout, pd.aggregation_fee, pd.logistics_fee, pd.platform_fee, pd.handling_fee, pd.notes]
    );
  }

  // 6. Seed Notifications
  await execute(`
    INSERT INTO notifications (user_id, title, message, type) VALUES
    (1, 'AI Demand Alert', 'Tomato demand predicted to rise +21% next week. Prepare Grade-A listings.', 'success'),
    (1, 'New Bulk Buyer Matching', 'Taj Hospitality posted a requirement for 1,000 kg Grade-A Tomato.', 'info'),
    (7, 'Supply Matched', '3 verified farmers in Nashik and Pune can fulfill your 1,000 kg Tomato requirement.', 'info');
  `);

  console.log('✅ KisanSetu Database successfully seeded with authentic Maharashtra agro-network demo data!');
};

module.exports = { seedDatabase };
