const mongoose = require('mongoose');

const EnvironmentalIndexSchema = new mongoose.Schema(
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
    overallIndex: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    rating: {
      type: String,
      enum: ['OPTIMAL', 'GOOD', 'MODERATE', 'STRESSED', 'CRITICAL'],
      default: 'GOOD'
    },
    subScores: {
      temperatureComfort: { type: Number, min: 0, max: 100 },
      precipitationBalance: { type: Number, min: 0, max: 100 },
      humidityStability: { type: Number, min: 0, max: 100 },
      airQualityIndexScore: { type: Number, min: 0, max: 100 }
    },
    weights: {
      temperature: { type: Number, default: 0.25 },
      rainfall: { type: Number, default: 0.25 },
      humidity: { type: Number, default: 0.20 },
      airQuality: { type: Number, default: 0.30 }
    },
    keyLimitingFactor: {
      type: String
    },
    calculatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

EnvironmentalIndexSchema.index({ regionId: 1, timestamp: -1 });

module.exports = mongoose.models.EnvironmentalIndex || mongoose.model('EnvironmentalIndex', EnvironmentalIndexSchema);
