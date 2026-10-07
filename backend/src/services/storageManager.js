const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Region = require('../models/Region');
const EnvironmentalObservation = require('../models/EnvironmentalObservation');
const Anomaly = require('../models/Anomaly');
const EnvironmentalIndex = require('../models/EnvironmentalIndex');
const initialRegions = require('../seeds/initialRegions');

// Local file mirror path for offline resilience
const cacheDir = path.resolve(__dirname, '../../data');
const cacheFile = path.join(cacheDir, 'local_store.json');

// In-Memory store
const memoryStore = {
  regions: [],
  observations: [],
  anomalies: [],
  indexes: []
};

// Initialize memory store with seeds
const initMemoryStore = () => {
  if (memoryStore.regions.length === 0) {
    memoryStore.regions = initialRegions.map((r, idx) => ({
      ...r,
      _id: `66000000000000000000000${idx + 1}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
  }

  // Load from disk if exists
  try {
    if (fs.existsSync(cacheFile)) {
      const data = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
      if (data.observations?.length) memoryStore.observations = data.observations;
      if (data.anomalies?.length) memoryStore.anomalies = data.anomalies;
      if (data.indexes?.length) memoryStore.indexes = data.indexes;
    }
  } catch (err) {
    console.warn('[StorageManager] Could not load local disk mirror:', err.message);
  }
};

initMemoryStore();

const saveMemoryMirror = () => {
  try {
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }
    fs.writeFileSync(cacheFile, JSON.stringify({
      observations: memoryStore.observations.slice(-500),
      anomalies: memoryStore.anomalies.slice(-200),
      indexes: memoryStore.indexes.slice(-200)
    }, null, 2));
  } catch (err) {
    // Non-blocking
  }
};

class StorageManager {
  isMongoActive() {
    return mongoose.connection.readyState === 1;
  }

  // Region Queries
  async getAllRegions() {
    if (this.isMongoActive()) {
      try {
        const found = await Region.find({ isActive: true }).lean();
        if (found && found.length > 0) return found;
      } catch (err) {
        console.warn('[StorageManager] MongoDB find regions error, falling back to memory:', err.message);
      }
    }
    return memoryStore.regions;
  }

  async getRegionByCodeOrId(identifier) {
    if (this.isMongoActive()) {
      try {
        if (mongoose.Types.ObjectId.isValid(identifier)) {
          const reg = await Region.findById(identifier).lean();
          if (reg) return reg;
        }
        const reg = await Region.findOne({ code: identifier.toUpperCase() }).lean();
        if (reg) return reg;
      } catch (err) {
        // Fall back
      }
    }
    return memoryStore.regions.find(
      r => r.code === identifier.toUpperCase() || r._id.toString() === identifier.toString()
    ) || null;
  }

  async upsertRegion(regionData) {
    if (this.isMongoActive()) {
      try {
        return await Region.findOneAndUpdate(
          { code: regionData.code },
          { $set: regionData },
          { upsert: true, new: true }
        ).lean();
      } catch (err) {
        console.warn('[StorageManager] Upsert region failed in MongoDB:', err.message);
      }
    }
    const idx = memoryStore.regions.findIndex(r => r.code === regionData.code);
    if (idx >= 0) {
      memoryStore.regions[idx] = { ...memoryStore.regions[idx], ...regionData, updatedAt: new Date() };
      return memoryStore.regions[idx];
    }
    const newReg = { ...regionData, _id: `66000000000000000000000${memoryStore.regions.length + 1}`, createdAt: new Date() };
    memoryStore.regions.push(newReg);
    return newReg;
  }

  // Observations
  async saveObservation(obsData) {
    if (this.isMongoActive()) {
      try {
        return await EnvironmentalObservation.create(obsData);
      } catch (err) {
        console.warn('[StorageManager] Save observation to Mongo failed:', err.message);
      }
    }
    const record = { ...obsData, _id: `obs_${Date.now()}_${Math.random().toString(36).substring(7)}`, createdAt: new Date() };
    memoryStore.observations.push(record);
    saveMemoryMirror();
    return record;
  }

  async getLatestObservation(regionCode) {
    if (this.isMongoActive()) {
      try {
        const obs = await EnvironmentalObservation.findOne({ regionCode })
          .sort({ timestamp: -1 })
          .lean();
        if (obs) return obs;
      } catch (err) {
        // Fall back
      }
    }
    const matches = memoryStore.observations
      .filter(o => o.regionCode === regionCode)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return matches[0] || null;
  }

  async getHistoricalObservations(regionCode, limit = 168) {
    if (this.isMongoActive()) {
      try {
        const list = await EnvironmentalObservation.find({ regionCode })
          .sort({ timestamp: -1 })
          .limit(limit)
          .lean();
        if (list && list.length > 0) return list.reverse();
      } catch (err) {
        // Fall back
      }
    }
    const matches = memoryStore.observations
      .filter(o => o.regionCode === regionCode)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    return matches.slice(-limit);
  }

  // Anomalies
  async saveAnomaly(anomalyData) {
    if (this.isMongoActive()) {
      try {
        return await Anomaly.create(anomalyData);
      } catch (err) {}
    }
    const record = { ...anomalyData, _id: `anom_${Date.now()}_${Math.random().toString(36).substring(7)}`, detectedAt: new Date() };
    memoryStore.anomalies.push(record);
    saveMemoryMirror();
    return record;
  }

  async getAnomalies(regionCode, limit = 20) {
    if (this.isMongoActive()) {
      try {
        const list = await Anomaly.find({ regionCode })
          .sort({ timestamp: -1 })
          .limit(limit)
          .lean();
        if (list && list.length > 0) return list;
      } catch (err) {}
    }
    return memoryStore.anomalies
      .filter(a => a.regionCode === regionCode)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  }

  // Environmental Index
  async saveIndex(indexData) {
    if (this.isMongoActive()) {
      try {
        return await EnvironmentalIndex.create(indexData);
      } catch (err) {}
    }
    const record = { ...indexData, _id: `idx_${Date.now()}_${Math.random().toString(36).substring(7)}`, calculatedAt: new Date() };
    memoryStore.indexes.push(record);
    saveMemoryMirror();
    return record;
  }

  async getLatestIndex(regionCode) {
    if (this.isMongoActive()) {
      try {
        const idx = await EnvironmentalIndex.findOne({ regionCode })
          .sort({ timestamp: -1 })
          .lean();
        if (idx) return idx;
      } catch (err) {}
    }
    const matches = memoryStore.indexes
      .filter(i => i.regionCode === regionCode)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return matches[0] || null;
  }
}

module.exports = new StorageManager();
