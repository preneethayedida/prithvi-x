const mongoose = require('mongoose');

const EnvironmentalObservationSchema = new mongoose.Schema(
  {
    regionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Region',
      required: true,
      index: true
    },
    regionCode: {
      type: String,
      required: true,
      index: true
    },
    timestamp: {
      type: Date,
      required: true,
      index: true
    },
    weather: {
      temperature: { type: Number, required: true },
      feelsLike: { type: Number },
      humidity: { type: Number, required: true },
      rainfall: { type: Number, default: 0 },
      windSpeed: { type: Number, default: 0 },
      windDirection: { type: Number, default: 0 },
      surfacePressure: { type: Number, default: 1013 },
      uvIndex: { type: Number, default: 0 },
      cloudCover: { type: Number, default: 0 }
    },
    airQuality: {
      aqi: { type: Number, default: 50 },
      pm2_5: { type: Number, default: 15 },
      pm10: { type: Number, default: 30 },
      no2: { type: Number, default: 10 },
      so2: { type: Number, default: 5 },
      o3: { type: Number, default: 30 },
      co: { type: Number, default: 300 }
    },
    source: {
      provider: { type: String, default: 'OPEN_METEO' },
      stationOrGrid: { type: String, default: 'Grid Model' },
      retrievedAt: { type: Date, default: Date.now },
      isEstimated: { type: Boolean, default: false }
    },
    dataQuality: {
      isValid: { type: Boolean, default: true },
      checksPassed: [{ type: String }]
    }
  },
  {
    timestamps: true
  }
);

// Compound indexes for high-throughput time-series queries
EnvironmentalObservationSchema.index({ regionId: 1, timestamp: -1 });
EnvironmentalObservationSchema.index({ regionCode: 1, timestamp: -1 });

module.exports = mongoose.models.EnvironmentalObservation || mongoose.model('EnvironmentalObservation', EnvironmentalObservationSchema);
