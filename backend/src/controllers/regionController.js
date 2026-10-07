const storageManager = require('../services/storageManager');

const getRegions = async (req, res, next) => {
  try {
    const regions = await storageManager.getAllRegions();
    res.json({
      success: true,
      data: regions,
      message: `Retrieved ${regions.length} monitored geographical regions.`
    });
  } catch (err) {
    next(err);
  }
};

const getRegionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const region = await storageManager.getRegionByCodeOrId(id);
    if (!region) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'REGION_NOT_FOUND',
          message: `Region identified by '${id}' was not found.`
        }
      });
    }

    res.json({
      success: true,
      data: region,
      message: `Regional profile for ${region.name} retrieved successfully.`
    });
  } catch (err) {
    next(err);
  }
};

const createRegion = async (req, res, next) => {
  try {
    const { code, name, district, state, country, coordinates, boundingBox, climateZone, areaKm2, population, tags } = req.body;

    if (!code || !name || !coordinates?.latitude || !coordinates?.longitude) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_PARAMETERS',
          message: 'Code, name, latitude, and longitude are required to register a region.'
        }
      });
    }

    const created = await storageManager.upsertRegion({
      code: code.toUpperCase(),
      name,
      district: district || 'Unknown',
      state: state || 'Unknown',
      country: country || 'India',
      coordinates,
      boundingBox: boundingBox || {},
      climateZone: climateZone || 'Tropical wet and dry (Aw)',
      areaKm2: areaKm2 || 0,
      population: population || 0,
      tags: tags || [],
      isActive: true
    });

    res.status(201).json({
      success: true,
      data: created,
      message: `Region ${name} (${code}) registered successfully.`
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getRegions,
  getRegionById,
  createRegion
};
