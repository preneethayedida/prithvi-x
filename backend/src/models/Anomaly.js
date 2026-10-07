const mongoose = require('mongoose');

const AnomalySchema = new mongoose.Schema(
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
      required: true
    },
    metric: {
      type: String,
      required: true,
      enum: ['temperature', 'rainfall', 'humidity', 'windSpeed', 'airQuality', 'compound']
    },
    observedValue: {
      type: Number,
      required: true
    },
    baseline: {
      mean: { type: Number },
      expectedMin: { type: Number },
      expectedMax: { type: Number }
    },
    deviation: {
      type: Number,
      required: true
    },
    zScore: {
      type: Number
    },
    severity: {
      type: String,
      required: true,
      enum: ['LOW', 'MODERATE', 'HIGH', 'SEVERE'],
      default: 'MODERATE'
    },
    method: {
      type: String,
      default: 'Z_SCORE_AND_IQR'
    },
    explanation: {
      type: String,
      required: true
    },
    detectedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

AnomalySchema.index({ regionId: 1, timestamp: -1 });
AnomalySchema.index({ severity: 1 });

module.exports = mongoose.models.Anomaly || mongoose.model('Anomaly', AnomalySchema);
