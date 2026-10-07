import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Layers, Thermometer, Droplets, Wind, ShieldCheck, CloudRain } from 'lucide-react';
import { useRegion } from '../context/RegionContext';

// Helper component to smoothly pan/zoom map on selectedRegion change
const MapUpdater = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, { duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
};

// Create custom glowing SVG div icon for Leaflet
const createCustomMarker = (value, unit, color) => {
  return L.divIcon({
    className: 'custom-twin-marker',
    html: `
      <div style="
        background: #111827;
        border: 2px solid ${color};
        color: #f8fafc;
        border-radius: 20px;
        padding: 4px 10px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 11px;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 4px;
        box-shadow: 0 0 14px ${color}88, 0 4px 8px rgba(0,0,0,0.6);
        white-space: nowrap;
        transform: translate(-50%, -50%);
      ">
        <span style="width: 8px; height: 8px; border-radius: 50%; background: ${color};"></span>
        ${value}${unit}
      </div>
    `,
    iconSize: [60, 24],
    iconAnchor: [30, 12]
  });
};

export const MapView = ({ onSelectRegion, activeLayer = 'pei', setActiveLayer }) => {
  const { regions, selectedRegion, setSelectedRegion } = useRegion();

  const layerOptions = [
    { id: 'pei', label: 'Environmental Index', icon: ShieldCheck, unit: '/100' },
    { id: 'temperature', label: 'Temperature', icon: Thermometer, unit: '°C' },
    { id: 'rainfall', label: 'Rainfall', icon: CloudRain, unit: ' mm' },
    { id: 'humidity', label: 'Humidity', icon: Droplets, unit: '%' },
    { id: 'aqi', label: 'Air Quality', icon: Wind, unit: ' AQI' }
  ];

  const currentCenter = selectedRegion?.coordinates
    ? [selectedRegion.coordinates.latitude, selectedRegion.coordinates.longitude]
    : [16.5449, 81.5212]; // Default: Bhimavaram

  const getMetricDisplay = (region, layer) => {
    // For demo/map visualization, provide benchmark attributes
    if (layer === 'temperature') return { val: region.code === 'IN-AP-BVM' ? 31.4 : 32.5, unit: '°C', color: '#10b981' };
    if (layer === 'rainfall') return { val: region.code === 'IN-AP-BVM' ? 2.4 : 1.2, unit: 'mm', color: '#06b6d4' };
    if (layer === 'humidity') return { val: region.code === 'IN-AP-BVM' ? 74 : 68, unit: '%', color: '#38bdf8' };
    if (layer === 'aqi') return { val: region.code === 'IN-AP-BVM' ? 68 : 85, unit: '', color: '#f59e0b' };
    return { val: region.code === 'IN-AP-BVM' ? 78 : 74, unit: '', color: '#10b981' };
  };

  return (
    <div className="map-container">
      {/* Layer Toggle Floating Bar */}
      <div style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        zIndex: 1000,
        background: 'rgba(17, 24, 39, 0.92)',
        backdropFilter: 'blur(8px)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-sm)',
        padding: '6px',
        display: 'flex',
        gap: '6px',
        boxShadow: 'var(--shadow-md)'
      }}>
        {layerOptions.map((opt) => {
          const Icon = opt.icon;
          const isActive = activeLayer === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setActiveLayer && setActiveLayer(opt.id)}
              className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.75rem', gap: '5px' }}
            >
              <Icon size={14} />
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>

      <MapContainer
        center={currentCenter}
        zoom={9}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%' }}
      >
        <MapUpdater center={currentCenter} zoom={selectedRegion ? 10 : 7} />

        {/* CartoDB Dark Matter Basemap for sleek scientific look */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          maxZoom={19}
        />

        {regions.map((region) => {
          const lat = region.coordinates?.latitude;
          const lon = region.coordinates?.longitude;
          if (!lat || !lon) return null;

          const metric = getMetricDisplay(region, activeLayer);
          const isSelected = selectedRegion?.code === region.code;

          return (
            <React.Fragment key={region.code}>
              {/* Highlight Circle for Bounding Influence */}
              <Circle
                center={[lat, lon]}
                radius={isSelected ? 14000 : 8000}
                pathOptions={{
                  color: isSelected ? '#10b981' : '#38bdf8',
                  fillColor: isSelected ? '#10b981' : '#38bdf8',
                  fillOpacity: isSelected ? 0.2 : 0.08,
                  weight: isSelected ? 2 : 1
                }}
              />

              <Marker
                position={[lat, lon]}
                icon={createCustomMarker(metric.val, metric.unit, isSelected ? '#10b981' : metric.color)}
                eventHandlers={{
                  click: () => {
                    setSelectedRegion(region.code);
                    if (onSelectRegion) onSelectRegion(region);
                  }
                }}
              >
                <Popup className="twin-popup">
                  <div style={{ color: '#0b0f19', padding: '4px' }}>
                    <h4 style={{ margin: 0, fontWeight: 700 }}>{region.name}</h4>
                    <p style={{ margin: '2px 0 6px 0', fontSize: '11px', color: '#4b5563' }}>
                      {region.district}, {region.state}
                    </p>
                    <div style={{ fontSize: '12px', fontWeight: 600 }}>
                      Active Metric: {metric.val} {metric.unit}
                    </div>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapView;
