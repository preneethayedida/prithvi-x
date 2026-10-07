const mongoose = require('mongoose');

const RegionSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    district: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    country: {
      type: String,
      required: true,
      default: 'India',
      trim: true
    },
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      elevation: { type: Number, default: 0 }
    },
    boundingBox: {
      north: { type: Number },
      south: { type: Number },
      east: { type: Number },
      west: { type: Number }
    },
    climateZone: {
      type: String,
      default: 'Tropical wet and dry (Aw)'
    },
    areaKm2: {
      type: Number,
      default: 0
    },
    population: {
      type: Number,
      default: 0
    },
    tags: [{ type: String }],
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

RegionSchema.index({ 'coordinates.latitude': 1, 'coordinates.longitude': 1 });

module.exports = mongoose.models.Region || mongoose.model('Region', RegionSchema);
