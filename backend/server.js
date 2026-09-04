const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { initSchema, query } = require('./database/db');
const { seedDatabase } = require('./seed/seedData');
const apiRoutes = require('./routes/api');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Mount API routes
app.use('/api', apiRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'KisanSetu-Node-Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Root welcome
app.get('/', (req, res) => {
  res.send({
    message: 'Welcome to KisanSetu AI Farm-to-Market Platform API',
    endpoints: {
      health: '/health',
      api: '/api',
      auth: '/api/auth/demo-users',
      marketplace: '/api/marketplace',
      forecast: '/api/demand/forecast?crop=Tomato',
      matching: '/api/matches/1'
    }
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Something went wrong on the server. Please try again.'
  });
});

// Startup & Auto-seed
async function startServer() {
  try {
    await initSchema();
    const existingUsers = await query('SELECT COUNT(*) as count FROM users');
    if (!existingUsers || existingUsers[0].count === 0) {
      console.log('Seeding fresh database with demo data...');
      await seedDatabase();
    } else {
      console.log('Database already populated with KisanSetu records.');
    }

    app.listen(PORT, () => {
      console.log(`🚀 KisanSetu Backend API running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Fatal error starting server:', error);
    process.exit(1);
  }
}

startServer();
