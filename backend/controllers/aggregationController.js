const { query, getOne, execute } = require('../database/db');

exports.createAggregatedOrder = async (req, res) => {
  try {
    const {
      requirement_id,
      buyer_id = 7,
      buyer_name = 'Taj Hospitality Group',
      selected_matches = []
    } = req.body;

    if (!selected_matches || selected_matches.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No farmer supply selected for aggregation.'
      });
    }

    let totalQuantity = 0;
    let totalCost = 0;
    const cropName = selected_matches[0].crop || 'Tomato';
    const destination = 'Mumbai Central Logistics Hub';

    for (const item of selected_matches) {
      const qty = parseFloat(item.allocatedQuantity || item.availableQuantity || 0);
      const price = parseFloat(item.expectedPrice || 28);
      totalQuantity += qty;
      totalCost += qty * price;
    }

    const averagePrice = Number((totalCost / totalQuantity).toFixed(2));
    const farmerCount = selected_matches.length;

    // 1. Create Aggregation Record
    const aggResult = await execute(
      `INSERT INTO aggregations (requirement_id, buyer_id, crop_name, total_quantity, average_price, farmer_count, hub_location, delivery_destination, status)
       VALUES (?, ?, ?, ?, ?, ?, 'KisanSetu Nashik Cluster Hub', ?, 'Confirmed')`,
      [requirement_id || null, buyer_id, cropName, totalQuantity, averagePrice, farmerCount, destination]
    );

    const aggregationId = aggResult.lastID;

    // 2. Insert Aggregation Items and deduct real inventory from produce table
    for (const item of selected_matches) {
      const prodId = item.produceId || 1;
      const allocQty = parseFloat(item.allocatedQuantity || 0);

      await execute(
        `INSERT INTO aggregation_items (aggregation_id, produce_id, farmer_id, farmer_name, location, allocated_quantity, unit_price, grade, match_score)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          aggregationId,
          prodId,
          item.farmerId || 1,
          item.farmerName,
          item.location,
          allocQty,
          parseFloat(item.expectedPrice),
          item.grade || 'Grade A',
          item.matchScore || 90
        ]
      );

      // Safe atomic deduction
      const produceRecord = await getOne('SELECT * FROM produce WHERE id = ?', [prodId]);
      if (produceRecord) {
        const remainingQty = Math.max(0, produceRecord.quantity_available - allocQty);
        const newStatus = remainingQty === 0 ? 'Sold Out' : 'Partially Allocated';
        await execute(
          'UPDATE produce SET quantity_available = ?, status = ? WHERE id = ?',
          [remainingQty, newStatus, prodId]
        );
      }
    }

    // 3. Generate Order Record
    const orderNumber = `KS-ORD-${Date.now().toString().slice(-6)}`;
    const logisticsFee = Number((totalQuantity * 2.0).toFixed(2)); // ₹2/kg
    const platformFee = Number((totalQuantity * 1.0).toFixed(2));  // ₹1/kg
    const handlingFee = Number((totalQuantity * 1.0).toFixed(2));  // ₹1/kg
    const totalOrderAmount = totalCost + logisticsFee + platformFee + handlingFee;

    const orderResult = await execute(
      `INSERT INTO orders (order_number, buyer_id, buyer_name, aggregation_id, crop_name, grade, total_quantity, unit_price, logistics_fee, platform_fee, handling_fee, total_amount, delivery_location, status, estimated_delivery)
       VALUES (?, ?, ?, ?, ?, 'Grade A', ?, ?, ?, ?, ?, ?, ?, 'Aggregated', '2026-09-10 14:00')`,
      [
        orderNumber,
        buyer_id,
        buyer_name,
        aggregationId,
        cropName,
        totalQuantity,
        averagePrice,
        logisticsFee,
        platformFee,
        handlingFee,
        totalOrderAmount,
        destination
      ]
    );

    const orderId = orderResult.lastID;

    // 4. Create Route and Route Stops for Logistics Optimization
    const routeResult = await execute(
      `INSERT INTO routes (order_id, aggregation_id, vehicle_type, vehicle_capacity_kg, total_load_kg, estimated_distance_km, estimated_duration_text, estimated_cost, status)
       VALUES (?, ?, 'Tata 407 Reefer 1.5T Van', 1500, ?, 42.0, '1 hr 35 min', 2850.0, 'Optimized')`,
      [orderId, aggregationId, totalQuantity]
    );

    const routeId = routeResult.lastID;

    // Insert Route Stops (Pickups + Destination)
    let stopOrder = 1;
    for (const item of selected_matches) {
      let lat = 20.0059;
      let lng = 73.7898;
      if (item.location.toLowerCase().includes('pune')) {
        lat = 18.5204;
        lng = 73.8567;
      } else if (item.location.toLowerCase().includes('ahmednagar')) {
        lat = 19.0952;
        lng = 74.7496;
      }
      await execute(
        `INSERT INTO route_stops (route_id, stop_order, stop_type, location_name, farmer_name, crop_name, quantity_kg, lat, lng, arrival_time, status)
         VALUES (?, ?, 'PICKUP', ?, ?, ?, ?, ?, ?, '08:30 AM', 'Scheduled')`,
        [routeId, stopOrder++, item.location, item.farmerName, cropName, item.allocatedQuantity, lat, lng]
      );
    }

    // Hub consolidation stop
    await execute(
      `INSERT INTO route_stops (route_id, stop_order, stop_type, location_name, farmer_name, crop_name, quantity_kg, lat, lng, arrival_time, status)
       VALUES (?, ?, 'HUB', 'KisanSetu Nashik Cluster Hub', 'Agro-Logistics Team', ?, ?, 19.9975, 73.7910, '10:15 AM', 'Scheduled')`,
      [routeId, stopOrder++, cropName, totalQuantity]
    );

    // Final Delivery Stop (Mumbai)
    await execute(
      `INSERT INTO route_stops (route_id, stop_order, stop_type, location_name, farmer_name, crop_name, quantity_kg, lat, lng, arrival_time, status)
       VALUES (?, ?, 'DELIVERY', 'Mumbai Central Logistics Hub (Taj Group)', 'Recipient Warehouse', ?, ?, 19.0760, 72.8777, '02:00 PM', 'Scheduled')`,
      [routeId, stopOrder++, cropName, totalQuantity]
    );

    // 5. Update buyer requirement status if provided
    if (requirement_id) {
      await execute("UPDATE buyer_requirements SET status = 'Fulfilled' WHERE id = ?", [requirement_id]);
    }

    return res.status(201).json({
      success: true,
      message: `Multi-farmer supply aggregation confirmed! 1,000 kg ${cropName} fulfilled.`,
      aggregationId,
      orderId,
      routeId,
      orderNumber,
      totalQuantity,
      averagePrice,
      farmerCount,
      totalOrderAmount
    });
  } catch (err) {
    console.error('createAggregatedOrder error:', err);
    return res.status(500).json({ success: false, message: 'Failed to create aggregated order' });
  }
};

exports.getAggregations = async (req, res) => {
  try {
    const aggregations = await query('SELECT * FROM aggregations ORDER BY id DESC');
    const enriched = [];

    for (const agg of aggregations) {
      const items = await query('SELECT * FROM aggregation_items WHERE aggregation_id = ?', [agg.id]);
      enriched.push({ ...agg, items });
    }

    return res.json({ success: true, count: enriched.length, data: enriched });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch aggregations' });
  }
};

exports.getAggregationById = async (req, res) => {
  try {
    const { id } = req.params;
    const agg = await getOne('SELECT * FROM aggregations WHERE id = ?', [id]);
    if (!agg) return res.status(404).json({ success: false, message: 'Aggregation not found' });
    const items = await query('SELECT * FROM aggregation_items WHERE aggregation_id = ?', [id]);
    return res.json({ success: true, data: { ...agg, items } });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch aggregation details' });
  }
};
