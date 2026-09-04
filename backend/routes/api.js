const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const produceController = require('../controllers/produceController');
const buyerController = require('../controllers/buyerController');
const aggregationController = require('../controllers/aggregationController');
const routeController = require('../controllers/routeController');
const orderController = require('../controllers/orderController');
const priceController = require('../controllers/priceController');
const demandController = require('../controllers/demandController');
const { seedDatabase } = require('../seed/seedData');

// Auth routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/me', authController.getMe);
router.get('/auth/demo-users', authController.getDemoUsers);

// Produce & Farmer routes
router.get('/produce', produceController.getFarmerProduce);
router.post('/produce', produceController.addProduce);
router.get('/farmer/metrics', produceController.getFarmerDashboardMetrics);

// Marketplace route
router.get('/marketplace', produceController.getMarketplace);

// Bulk Buyer Requirements & Matching Engine
router.get('/buyer/requirements', buyerController.getRequirements);
router.post('/buyer/requirements', buyerController.createRequirement);
router.get('/matches/:id', buyerController.getMatchesForRequirement);

// Supply Aggregation
router.post('/aggregation/create', aggregationController.createAggregatedOrder);
router.get('/aggregations', aggregationController.getAggregations);
router.get('/aggregations/:id', aggregationController.getAggregationById);

// Logistics & Route Optimization
router.post('/routes/optimize', routeController.optimizeRoute);
router.get('/routes/latest', routeController.getLatestRoute);

// Orders Lifecycle
router.get('/orders', orderController.getOrders);
router.post('/orders/consumer', orderController.createConsumerOrder);
router.get('/orders/:id', orderController.getOrderById);
router.patch('/orders/:id/status', orderController.updateOrderStatus);
router.post('/orders/:id/cancel', orderController.cancelOrder);

// Transparent Price Breakdown
router.get('/price-breakdown', priceController.getPriceBreakdown);
router.get('/price-breakdown/:crop', priceController.getPriceBreakdown);

// AI Demand Forecasting & Actionable Insights
router.get('/demand/forecast', demandController.getForecast);
router.post('/demand/forecast', demandController.getForecast);
router.get('/demand/insights', demandController.getInsights);

// Reset Demo Data
router.post('/demo/reset', async (req, res) => {
  try {
    await seedDatabase();
    return res.json({ success: true, message: 'Database reset to initial demo state successfully!' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to reset demo data' });
  }
});

module.exports = router;
