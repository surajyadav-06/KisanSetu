const { query, getOne, execute } = require('../database/db');

// Default crop images mapping
const CROP_IMAGES = {
  'Tomato': 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
  'Onion': 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80',
  'Potato': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80',
  'Grapes': 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=600&q=80',
  'Banana': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80',
  'Cauliflower': 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=600&q=80',
  'Capsicum': 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=600&q=80'
};

const LOCATION_COORDINATES = {
  'Nashik': { lat: 20.0059, lng: 73.7898 },
  'Pune': { lat: 18.5204, lng: 73.8567 },
  'Ahmednagar': { lat: 19.0952, lng: 74.7496 },
  'Satara': { lat: 17.6805, lng: 74.0183 },
  'Mumbai': { lat: 19.0760, lng: 72.8777 }
};

exports.getMarketplace = async (req, res) => {
  try {
    const { category, location, grade, search, maxPrice } = req.query;
    let sql = 'SELECT * FROM produce WHERE status != "Sold Out"';
    const params = [];

    if (category && category !== 'All') {
      sql += ' AND category = ?';
      params.push(category);
    }
    if (location && location !== 'All') {
      sql += ' AND location LIKE ?';
      params.push(`%${location}%`);
    }
    if (grade && grade !== 'All') {
      sql += ' AND grade = ?';
      params.push(grade);
    }
    if (maxPrice) {
      sql += ' AND expected_price <= ?';
      params.push(parseFloat(maxPrice));
    }
    if (search) {
      sql += ' AND (crop_name LIKE ? OR farmer_name LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    sql += ' ORDER BY id DESC';
    const items = await query(sql, params);
    return res.json({ success: true, count: items.length, data: items });
  } catch (err) {
    console.error('getMarketplace error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch produce marketplace' });
  }
};

exports.getFarmerProduce = async (req, res) => {
  try {
    const userId = req.query.userId || 1; // Default to Demo Farmer
    const items = await query('SELECT * FROM produce WHERE user_id = ? ORDER BY id DESC', [userId]);
    return res.json({ success: true, count: items.length, data: items });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch farmer produce' });
  }
};

exports.addProduce = async (req, res) => {
  try {
    const {
      user_id = 1,
      farmer_name = 'Ramesh Patil (Demo Farmer)',
      crop_name,
      category = 'Vegetables',
      quantity,
      unit = 'kg',
      grade = 'Grade A',
      perishability = 'High',
      harvest_date,
      available_from,
      expected_price,
      location = 'Nashik, Maharashtra',
      description,
      image_url
    } = req.body;

    if (!crop_name || !quantity || !expected_price || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide crop name, quantity, expected price, and location.'
      });
    }

    const defaultImg = CROP_IMAGES[crop_name] || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80';
    const finalImg = image_url || defaultImg;

    // Coordinate approximation
    let lat = 20.0059;
    let lng = 73.7898;
    for (const [city, coords] of Object.entries(LOCATION_COORDINATES)) {
      if (location.toLowerCase().includes(city.toLowerCase())) {
        lat = coords.lat;
        lng = coords.lng;
        break;
      }
    }

    const validPerishability = ['Low', 'Medium', 'High'].includes(perishability) ? perishability : 'High';

    const result = await execute(
      `INSERT INTO produce (user_id, farmer_name, crop_name, category, quantity_available, unit, grade, perishability, harvest_date, available_from, expected_price, location, latitude, longitude, description, image_url, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Available')`,
      [
        user_id,
        farmer_name,
        crop_name,
        category,
        parseFloat(quantity),
        unit,
        grade,
        validPerishability,
        harvest_date || new Date().toISOString().split('T')[0],
        available_from || new Date().toISOString().split('T')[0],
        parseFloat(expected_price),
        location,
        lat,
        lng,
        description || `Fresh high quality ${grade} ${crop_name} from verified regional harvest.`,
        finalImg
      ]
    );

    const newProduce = await getOne('SELECT * FROM produce WHERE id = ?', [result.lastID]);

    // Create automated notification for farmer
    await execute(
      `INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)`,
      [user_id, 'Produce Listed Successfully', `Your ${quantity} ${unit} ${grade} ${crop_name} is now live and actively indexing for buyer matching.`, 'success']
    );

    return res.status(201).json({
      success: true,
      message: `Successfully listed ${quantity} ${unit} of ${crop_name}!`,
      data: newProduce
    });
  } catch (err) {
    console.error('addProduce error:', err);
    return res.status(500).json({ success: false, message: 'Failed to list produce. Please try again.' });
  }
};

exports.getFarmerDashboardMetrics = async (req, res) => {
  try {
    const userId = req.query.userId || 1;
    const produceList = await query('SELECT * FROM produce WHERE user_id = ?', [userId]);
    
    let totalProduceListedKg = 0;
    produceList.forEach(p => {
      totalProduceListedKg += parseFloat(p.quantity_available || 0);
    });

    const activeOrdersCount = 8;
    const totalRevenue = 48500;
    const matchedBuyersCount = 12;

    return res.json({
      success: true,
      metrics: {
        totalProduceListedKg: totalProduceListedKg || 1250,
        activeOrders: activeOrdersCount,
        revenue: totalRevenue,
        matchedBuyers: matchedBuyersCount,
        aiInsight: 'Tomato demand is expected to increase over the next 7 days (+21%). Action: Increase Grade-A supply.'
      },
      inventory: produceList
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to calculate farmer metrics' });
  }
};
