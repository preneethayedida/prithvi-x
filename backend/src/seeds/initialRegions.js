const initialRegions = [
  {
    code: 'IN-AP-BVM',
    name: 'Bhimavaram',
    district: 'West Godavari',
    state: 'Andhra Pradesh',
    country: 'India',
    coordinates: {
      latitude: 16.5449,
      longitude: 81.5212,
      elevation: 7
    },
    boundingBox: {
      north: 16.5800,
      south: 16.5100,
      east: 81.5600,
      west: 81.4800
    },
    climateZone: 'Tropical wet and dry (Aw)',
    areaKm2: 26.14,
    population: 146000,
    tags: ['Aqua Hub', 'Delta Region', 'Godavari Belt'],
    isActive: true
  },
  {
    code: 'IN-AP-VJA',
    name: 'Vijayawada',
    district: 'NTR',
    state: 'Andhra Pradesh',
    country: 'India',
    coordinates: {
      latitude: 16.5062,
      longitude: 80.6480,
      elevation: 11
    },
    boundingBox: {
      north: 16.5500,
      south: 16.4500,
      east: 80.7000,
      west: 80.5900
    },
    climateZone: 'Tropical wet and dry (Aw)',
    areaKm2: 61.88,
    population: 1048000,
    tags: ['Commercial Hub', 'Krishna River Basin', 'Urban Corridor'],
    isActive: true
  },
  {
    code: 'IN-AP-VSP',
    name: 'Visakhapatnam',
    district: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    country: 'India',
    coordinates: {
      latitude: 17.6868,
      longitude: 83.2185,
      elevation: 45
    },
    boundingBox: {
      north: 17.7500,
      south: 17.6200,
      east: 83.3300,
      west: 83.1500
    },
    climateZone: 'Tropical wet and dry (Aw)',
    areaKm2: 681.96,
    population: 2358000,
    tags: ['Coastal Twin', 'Industrial Port', 'Eastern Ghats'],
    isActive: true
  },
  {
    code: 'IN-TG-HYD',
    name: 'Hyderabad',
    district: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    coordinates: {
      latitude: 17.3850,
      longitude: 78.4867,
      elevation: 542
    },
    boundingBox: {
      north: 17.4800,
      south: 17.3000,
      east: 78.6000,
      west: 78.3500
    },
    climateZone: 'Semi-arid (BSh)',
    areaKm2: 650.00,
    population: 6809000,
    tags: ['Deccan Plateau', 'Metropolitan Hub', 'Tech Corridor'],
    isActive: true
  },
  {
    code: 'IN-KA-BLR',
    name: 'Bengaluru',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    country: 'India',
    coordinates: {
      latitude: 12.9716,
      longitude: 77.5946,
      elevation: 920
    },
    boundingBox: {
      north: 13.0800,
      south: 12.8500,
      east: 77.7500,
      west: 77.4500
    },
    climateZone: 'Tropical savanna (Aw)',
    areaKm2: 741.00,
    population: 8443000,
    tags: ['Highland Plateau', 'Innovation Capital', 'Urban Lake Basin'],
    isActive: true
  },
  {
    code: 'IN-DL-DEL',
    name: 'New Delhi',
    district: 'Central Delhi',
    state: 'Delhi',
    country: 'India',
    coordinates: {
      latitude: 28.6139,
      longitude: 77.2090,
      elevation: 216
    },
    boundingBox: {
      north: 28.7500,
      south: 28.5000,
      east: 77.3500,
      west: 77.0500
    },
    climateZone: 'Monsoon-influenced humid subtropical (Cwa)',
    areaKm2: 1484.00,
    population: 16787941,
    tags: ['National Capital Region', 'Indo-Gangetic Plain', 'High AQI Sensitivity'],
    isActive: true
  }
];

module.exports = initialRegions;
