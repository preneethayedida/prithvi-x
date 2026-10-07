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
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

const allowedOrigins = env.CORS_ORIGIN.split(',').map(s => s.trim());
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, server-to-server)
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      return callback(null, true);
    }
    return callback(null, true); // Dev-friendly permissive for local testing
  },
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

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

// Server startup lifecycle
const startServer = async () => {
  try {
    // 1. Initialize MongoDB connection (with automatic fallback if offline)
    await connectDB();

    // 2. Initialize Seed Time-series Audit
    await ingestionService.seedHistoricalDataIfEmpty();

    // 3. Start Ingestion Scheduler Worker
    schedulerService.start();

    // 4. Listen on configured port
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

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = app;
