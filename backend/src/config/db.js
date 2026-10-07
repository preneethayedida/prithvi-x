const mongoose = require('mongoose');
const env = require('./env');

let isMongoConnected = false;

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000
});
    isMongoConnected = true;
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    isMongoConnected = false;
    console.warn(`[MongoDB Warning] Could not connect to MongoDB: ${error.message}`);
    console.info(`[MongoDB Fallback] PRITHVI-X will operate in resilient memory-store mode. Data is stored in memory and benchmark seeds are available.`);
    return null;
  }
};

const getDBStatus = () => {
  return {
    isConnected: isMongoConnected && mongoose.connection.readyState === 1,
    readyState: mongoose.connection.readyState,
    readyStateText: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown',
    uri: env.MONGO_URI.replace(/\/\/.*@/, '//***:***@') // Mask credentials if present
  };
};

module.exports = {
  connectDB,
  getDBStatus
};
