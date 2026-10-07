const dotenv = require('dotenv');
const path = require('path');

// Load .env from root or local backend
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config(); // fallback to local .env

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 5000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/prithvix',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  ANALYTICS_SERVICE_URL: process.env.ANALYTICS_SERVICE_URL || 'http://localhost:8000',
  ENABLE_AUTO_INGESTION: process.env.ENABLE_AUTO_INGESTION === 'true' || true,
  INGESTION_INTERVAL_CRON: process.env.INGESTION_INTERVAL_CRON || '0 */3 * * *',
  USE_FALLBACK_IF_API_FAILS: process.env.USE_FALLBACK_IF_API_FAILS !== 'false',
  OPEN_METEO_API_URL: process.env.OPEN_METEO_API_URL || 'https://api.open-meteo.com/v1/forecast',
  OPEN_METEO_ARCHIVE_URL: process.env.OPEN_METEO_ARCHIVE_URL || 'https://archive-api.open-meteo.com/v1/archive',
  OPEN_METEO_AQI_URL: process.env.OPEN_METEO_AQI_URL || 'https://air-quality-api.open-meteo.com/v1/air-quality'
};

module.exports = env;
