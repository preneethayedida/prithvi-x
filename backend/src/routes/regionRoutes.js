const express = require('express');
const router = express.Router();
const { getRegions, getRegionById, createRegion } = require('../controllers/regionController');

router.get('/', getRegions);
router.get('/:id', getRegionById);
router.post('/', createRegion);

module.exports = router;
