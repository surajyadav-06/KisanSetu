const { query, getOne, execute } = require('../database/db');

exports.getRequirements = async (req, res) => {
  try {
    const buyerId = req.query.buyerId;
    let sql = 'SELECT * FROM buyer_requirements';
    const params = [];
    if (buyerId) {
      sql += ' WHERE buyer_id = ?';
      params.push(buyerId);
    }
    sql += ' ORDER BY id DESC';
    const items = await query(sql, params);
    return res.json({ success: true, count: items.length, data: items });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch requirements' });
  }
};

exports.createRequirement = async (req, res) => {
  try {
    const {
      buyer_id = 7,
      buyer_name = 'Taj Hospitality Group',
      buyer_org = 'Taj Luxury Hotels & Mumbai Fresh Mart',
      crop_name = 'Tomato',
      required_quantity = 1000,
      unit = 'kg',
      required_grade = 'Grade A',
      max_price = 30.0,
      delivery_location = 'Mumbai Central Logistics Hub',
      required_date = '2026-09-10',
      urgency = 'High'
    } = req.body;

    if (!crop_name || !required_quantity || !max_price || !delivery_location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide crop name, quantity, max budget price, and delivery location.'
      });
    }

    const result = await execute(
      `INSERT INTO buyer_requirements (buyer_id, buyer_name, buyer_org, crop_name, required_quantity, unit, required_grade, max_price, delivery_location, required_date, urgency, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Open')`,
      [
        buyer_id,
        buyer_name,
        buyer_org,
        crop_name,
        parseFloat(required_quantity),
        unit,
        required_grade,
        parseFloat(max_price),
        delivery_location,
        required_date,
        urgency
      ]
    );

    const newReq = await getOne('SELECT * FROM buyer_requirements WHERE id = ?', [result.lastID]);

    return res.status(201).json({
      success: true,
      message: `Requirement for ${required_quantity} ${unit} of ${required_grade} ${crop_name} posted!`,
      data: newReq
    });
  } catch (err) {
    console.error('createRequirement error:', err);
    return res.status(500).json({ success: false, message: 'Failed to post requirement' });
  }
};

/**
 * Intelligent Multi-Parameter Farmer-Buyer Matching Engine
 */
exports.getMatchesForRequirement = async (req, res) => {
  try {
    const requirementId = req.params.id;
    const requirement = await getOne('SELECT * FROM buyer_requirements WHERE id = ?', [requirementId]);

    if (!requirement) {
      return res.status(404).json({ success: false, message: 'Requirement not found' });
    }

    // Search for compatible supply
    const availableSupply = await query(
      `SELECT * FROM produce 
       WHERE crop_name = ? AND status != 'Sold Out'
       ORDER BY expected_price ASC, quantity_available DESC`,
      [requirement.crop_name]
    );

    let cumulativeQuantity = 0;
    const matches = [];

    for (const item of availableSupply) {
      // Calculate matching dimensions
      const isProductMatch = item.crop_name.toLowerCase() === requirement.crop_name.toLowerCase();
      const isGradeMatch = item.grade === requirement.required_grade;
      const isPriceViable = item.expected_price <= requirement.max_price;

      // Price score (0-100)
      const priceDelta = requirement.max_price - item.expected_price;
      const priceScore = Math.min(100, Math.max(70, Math.round(85 + (priceDelta * 4))));

      // Location proximity score
      let proximityScore = 88;
      if (item.location.toLowerCase().includes('nashik')) proximityScore = 94;
      if (item.location.toLowerCase().includes('pune')) proximityScore = 89;
      if (item.location.toLowerCase().includes('mumbai')) proximityScore = 98;

      // Composite match score
      let compositeScore = 80;
      if (isProductMatch && isGradeMatch && isPriceViable) {
        compositeScore = Math.round((proximityScore * 0.5) + (priceScore * 0.4) + (isGradeMatch ? 10 : 0));
        compositeScore = Math.min(96, Math.max(80, compositeScore));
      } else if (!isGradeMatch) {
        compositeScore = 65;
      }

      const allocatedQty = Math.min(
        item.quantity_available,
        requirement.required_quantity - cumulativeQuantity
      );

      matches.push({
        produceId: item.id,
        farmerId: item.user_id,
        farmerName: item.farmer_name || `Farmer ${item.user_id}`,
        location: item.location,
        crop: item.crop_name,
        availableQuantity: item.quantity_available,
        allocatedQuantity: allocatedQty > 0 ? allocatedQty : item.quantity_available,
        unit: item.unit,
        grade: item.grade,
        expectedPrice: item.expected_price,
        matchScore: compositeScore,
        compatibility: {
          productCompatibility: '100% Match',
          gradeMatch: isGradeMatch ? 'Exact Grade A' : item.grade,
          priceViability: isPriceViable ? `₹${item.expected_price}/kg (Under ₹${requirement.max_price} budget)` : `Above budget`,
          locationProximity: `${item.location} (Express Agro-Corridor)`
        }
      });

      if (allocatedQty > 0) {
        cumulativeQuantity += allocatedQty;
      }
    }

    const totalMatchedQuantity = matches.reduce((acc, m) => acc + m.allocatedQuantity, 0);
    const fulfillmentPercentage = Math.min(100, Math.round((totalMatchedQuantity / requirement.required_quantity) * 100));

    return res.json({
      success: true,
      requirement,
      totalMatchedQuantity,
      requiredQuantity: requirement.required_quantity,
      fulfillmentPercentage,
      isFullyFulfillable: totalMatchedQuantity >= requirement.required_quantity,
      matches
    });
  } catch (err) {
    console.error('getMatches error:', err);
    return res.status(500).json({ success: false, message: 'Failed to compute matches' });
  }
};
