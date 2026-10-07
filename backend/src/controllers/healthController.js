const axios = require('axios');
const { getDBStatus } = require('../config/db');
const env = require('../config/env');

const checkHealth = async (req, res) => {
  const dbStatus = getDBStatus();

  // Test Python Analytics
  let analyticsStatus = { isReachable: false, latencyMs: null };
  const startTime = Date.now();
  try {
    const pyRes = await axios.get(`${env.ANALYTICS_SERVICE_URL}/health`, { timeout: 1500 });
    analyticsStatus = {
      isReachable: pyRes.status === 200,
      latencyMs: Date.now() - startTime,
      info: pyRes.data
    };
  } catch (err) {
    analyticsStatus = {
      isReachable: false,
      latencyMs: null,
      message: 'FastAPI service offline, running in internal fallback engine mode.'
    };
  }

  res.json({
    success: true,
    data: {
      status: 'HEALTHY',
      service: 'PRITHVI-X Backend API Gateway',
      version: '1.0.0',
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      database: dbStatus,
      analyticsMicroservice: analyticsStatus,
      configuration: {
        autoIngestion: env.ENABLE_AUTO_INGESTION,
        cronPattern: env.INGESTION_INTERVAL_CRON,
        fallbackEnabled: env.USE_FALLBACK_IF_API_FAILS
      }
    },
    message: 'PRITHVI-X system health diagnostic completed.'
  });
};

module.exports = {
  checkHealth
};
