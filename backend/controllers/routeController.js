const { query, getOne, execute } = require('../database/db');

exports.optimizeRoute = async (req, res) => {
  try {
    const { orderId, stops = [] } = req.body;

    // Standardized high-fidelity route coordinate points in Western Maharashtra
    const defaultStops = [
      {
        stopOrder: 1,
        stopType: 'PICKUP',
        locationName: 'Farmer A (Ramesh Patil) - Nashik Agro Estate',
        farmerName: 'Ramesh Patil',
        cropName: 'Tomato',
        quantityKg: 500,
        lat: 20.0059,
        lng: 73.7898,
        arrivalWindow: '08:00 AM - 08:30 AM',
        action: 'Load 500 kg Grade-A Crates',
        status: 'Scheduled'
      },
      {
        stopOrder: 2,
        stopType: 'PICKUP',
        locationName: 'Farmer B (Suresh Shinde) - Nashik Greenhouses',
        farmerName: 'Suresh Shinde',
        cropName: 'Tomato',
        quantityKg: 300,
        lat: 19.9975,
        lng: 73.7910,
        arrivalWindow: '08:45 AM - 09:15 AM',
        action: 'Load 300 kg Grade-A Crates',
        status: 'Scheduled'
      },
      {
        stopOrder: 3,
        stopType: 'PICKUP',
        locationName: 'Farmer C (Vikas Gaikwad) - Pune Orchards Hub',
        farmerName: 'Vikas Gaikwad',
        cropName: 'Tomato',
        quantityKg: 200,
        lat: 18.5204,
        lng: 73.8567,
        arrivalWindow: '10:30 AM - 11:00 AM',
        action: 'Load 200 kg Grade-A Crates',
        status: 'Scheduled'
      },
      {
        stopOrder: 4,
        stopType: 'HUB',
        locationName: 'KisanSetu Regional Quality Inspection & Aggregation Hub',
        farmerName: 'Logistics QA Team',
        cropName: 'Tomato',
        quantityKg: 1000,
        lat: 19.2183,
        lng: 73.0867,
        arrivalWindow: '12:15 PM - 12:45 PM',
        action: 'Batch Weighing, Digital QA Certification & Reefer Seal',
        status: 'Scheduled'
      },
      {
        stopOrder: 5,
        stopType: 'DELIVERY',
        locationName: 'Mumbai Central Logistics Hub (Taj Hospitality Kitchens)',
        farmerName: 'Institutional Receiver',
        cropName: 'Tomato',
        quantityKg: 1000,
        lat: 19.0760,
        lng: 72.8777,
        arrivalWindow: '02:00 PM - 02:30 PM',
        action: 'Unload 1,000 kg & Digital Goods Receipt Acknowledgment',
        status: 'Scheduled'
      }
    ];

    const finalStops = stops.length > 0 ? stops : defaultStops;
    const totalQuantity = finalStops
      .filter(s => s.stopType === 'PICKUP')
      .reduce((sum, s) => sum + (s.quantityKg || 0), 0) || 1000;

    const transporterOptions = [
      {
        id: '3PL-01',
        transporterName: 'Sahyadri Agro-Express (LCV)',
        vehicleType: 'Mahindra Bolero Maxi Truck (Ambient)',
        capacityKg: 500,
        fare: 1500,
        unitFare: '₹3.00/kg',
        eta: '5 hrs 30 min',
        pickupCluster: 'Nashik Agro Belt',
        destination: 'Mumbai Logistics Terminal',
        coolingType: 'Standard Ventilated',
        isRecommended: false,
        recommendationReason: 'Suitable for small loads (<500 kg), but lacks active cold-chain required for high-perishability tomatoes.'
      },
      {
        id: '3PL-02',
        transporterName: 'Maharashtra ColdLogistics (Reefer 1.5T)',
        vehicleType: 'Tata 407 Reefer (Active 10–12°C Controlled)',
        capacityKg: 1500,
        fare: 2850,
        unitFare: '₹2.85/kg',
        eta: '4 hrs 15 min',
        pickupCluster: 'Nashik & Pune Clustered Pickups',
        destination: 'Mumbai Central Logistics Hub (Taj Hotels)',
        coolingType: 'Active Cold-Chain Reefer (12°C)',
        isRecommended: true,
        recommendationReason: 'KisanSetu Recommended: Perfect 1,500 kg capacity fit for 1,000 kg consignment (67% utilization), fastest direct ETA (4h 15m), and active temperature control protects High-Perishability Grade-A produce.'
      },
      {
        id: '3PL-03',
        transporterName: 'Deccan Freight Carriers (Heavy LCV 3.0T)',
        vehicleType: 'Eicher Pro 2049 (High Capacity Heavy Van)',
        capacityKg: 3000,
        fare: 4200,
        unitFare: '₹1.40/kg',
        eta: '6 hrs 00 min',
        pickupCluster: 'Western Maharashtra Regional Hub',
        destination: 'Mumbai APMC & Institutional Kitchens',
        coolingType: 'Ventilated Heavy Duty',
        isRecommended: false,
        recommendationReason: 'Oversized for 1,000 kg batch with higher trip base fare (₹4,200), though optimal for high-volume non-perishables.'
      }
    ];

    const routeOptimizationResult = {
      routeId: `RT-${Date.now().toString().slice(-5)}`,
      orderId: orderId || 'KS-ORD-10482',
      vehicle: {
        model: 'Tata 407 High-Efficiency Refrigerated Truck',
        registration: 'MH-15-EG-4421',
        driverName: 'Santosh Chavan (+91 98334 55678)',
        capacityKg: 1500,
        loadedKg: totalQuantity,
        utilizationPercentage: Math.round((totalQuantity / 1500) * 100),
        temperatureSetting: '12°C Controlled'
      },
      metrics: {
        estimatedDistanceKm: 42.0,
        totalCorridorDistanceKm: 185.0,
        estimatedDurationText: '1 hr 35 min',
        estimatedLogisticsCost: 2850.0,
        unitLogisticsCost: 2.85,
        co2SavedKg: 18.5,
        fuelEfficiencyScore: '94% Optimal'
      },
      transporterOptions,
      recommendedTransporter: transporterOptions.find(t => t.isRecommended) || transporterOptions[1],
      summary: 'Optimal multi-pickup clustered sequence minimizes empty-haul miles by 36%.',
      stops: finalStops,
      polylineCoordinates: [
        [20.0059, 73.7898], // Nashik Stop 1
        [19.9975, 73.7910], // Nashik Stop 2
        [19.6966, 73.7250], // Igatpuri pass
        [19.2183, 73.0867], // Kalyan / QA Hub
        [19.0760, 72.8777]  // Mumbai Destination
      ]
    };

    return res.json({
      success: true,
      data: routeOptimizationResult
    });
  } catch (err) {
    console.error('optimizeRoute error:', err);
    return res.status(500).json({ success: false, message: 'Failed to optimize route' });
  }
};

exports.getLatestRoute = async (req, res) => {
  try {
    const route = await getOne('SELECT * FROM routes ORDER BY id DESC LIMIT 1');
    if (!route) {
      return exports.optimizeRoute(req, res);
    }
    const stops = await query('SELECT * FROM route_stops WHERE route_id = ? ORDER BY stop_order ASC', [route.id]);
    return res.json({
      success: true,
      data: {
        ...route,
        stops
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch latest route' });
  }
};
