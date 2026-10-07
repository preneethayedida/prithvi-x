const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const env = require('./config/env');
const { connectDB } = require('./config/db');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Route imports
const healthRoutes = require('./routes/healthRoutes');
const regionRoutes = require('./routes/regionRoutes');
const environmentRoutes = require('./routes/environmentRoutes');

// Services
const ingestionService = require('./services/ingestionService');
const schedulerService = require('./services/schedulerService');

const app = express();

// Security and Logging Middlewares
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

const allowedOrigins = env.CORS_ORIGIN.split(',').map(s => s.trim());

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      return callback(null, true);
    }

    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

/*
 * Vercel / Serverless MongoDB initialization
 *
 * On Vercel, wait for MongoDB before handling API requests.
 * This prevents /api/health from reading the database state
 * while the connection is still being established.
 */
app.use('/api', async (req, res, next) => {
  if (!process.env.VERCEL) {
    return next();
  }

  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('[Vercel MongoDB] Connection error:', error.message);
    next();
  }
});

// Mount APIs
app.use('/api/health', healthRoutes);
app.use('/api/regions', regionRoutes);
app.use('/api/environment', environmentRoutes);

// Root Welcome & Meta
app.get('/', (req, res) => {
  res.json({
    name: 'PRITHVI-X Environmental Digital Twin API Gateway',
    version: '1.0.0',
    status: 'ACTIVE',
    documentation: '/api/health',
    endpoints: {
      health: '/api/health',
      regions: '/api/regions',
      currentObservation: '/api/environment/current/:regionId',
      history: '/api/environment/history/:regionId',
      trends: '/api/environment/trends/:regionId',
      anomalies: '/api/environment/anomalies/:regionId',
      index: '/api/environment/index/:regionId',
      insights: '/api/environment/insights/:regionId',
      compare: '/api/environment/compare?regionIds=IN-AP-BVM,IN-AP-VJA,IN-AP-VSP',
      forecast: '/api/environment/forecast/:regionId'
    }
  });
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Local server startup lifecycle
const startServer = async () => {
  try {
    // 1. Initialize MongoDB connection
    await connectDB();

    // 2. Initialize Seed Time-series Audit
    await ingestionService.seedHistoricalDataIfEmpty();

    // 3. Start Ingestion Scheduler Worker
    schedulerService.start();

    // 4. Start local Express server
    const server = app.listen(env.PORT, () => {
      console.log(`=======================================================`);
      console.log(`🌍 PRITHVI-X Environmental Gateway online on port ${env.PORT}`);
      console.log(`📡 Health Check: http://localhost:${env.PORT}/api/health`);
      console.log(`🗺️ Monitored Regions: http://localhost:${env.PORT}/api/regions`);
      console.log(`=======================================================`);
    });

    return server;
  } catch (err) {
    console.error('Fatal initialization error:', err.message);
    process.exit(1);
  }
};

// Only start a local HTTP server.
// Vercel directly uses the exported Express app.
if (!process.env.VERCEL && process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = app;