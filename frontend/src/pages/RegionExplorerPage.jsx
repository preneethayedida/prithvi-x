import React, { useState } from 'react';
import { 
  MapPin, 
  Search, 
  Compass, 
  ArrowRight, 
  Layers, 
  ShieldCheck, 
  Plus, 
  Building2,
  Users
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useRegion } from '../context/RegionContext';

export const RegionExplorerPage = () => {
  const { regions, selectedRegion, setSelectedRegion } = useRegion();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('ALL');
  const navigate = useNavigate();

  const states = ['ALL', ...new Set(regions.map(r => r.state))];

  const filtered = regions.filter(r => {
    const matchesState = selectedState === 'ALL' || r.state === selectedState;
    const matchesSearch = 
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesState && matchesSearch;
  });

  const handleSelectAndNavigate = (code) => {
    setSelectedRegion(code);
    navigate('/dashboard');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '6px' }}>Regional Digital Twin Directory</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Hierarchical exploration: Country → State → District → Regional Digital Twin
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ 
        display: 'flex', 
        gap: '12px', 
        flexWrap: 'wrap',
        background: 'var(--bg-card)',
        padding: '16px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border)'
      }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search by city, district, or code..."
            className="input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', paddingLeft: '36px' }}
          />
        </div>

        <select 
          className="select" 
          value={selectedState} 
          onChange={(e) => setSelectedState(e.target.value)}
          style={{ minWidth: '180px' }}
        >
          {states.map(s => (
            <option key={s} value={s}>State: {s}</option>
          ))}
        </select>
      </div>

      {/* Regions Grid */}
      <div className="grid-3">
        {filtered.map(region => {
          const isSelected = selectedRegion?.code === region.code;
          return (
            <div 
              key={region.code} 
              className="card"
              style={{
                border: isSelected ? '2px solid var(--emerald-500)' : '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'var(--transition)'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <span className="badge badge-neutral mono">{region.code}</span>
                  <span className="badge badge-emerald">Active Twin</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <MapPin size={18} style={{ color: 'var(--emerald-400)' }} />
                  <h3 style={{ fontSize: '1.3rem' }}>{region.name}</h3>
                </div>

                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  {region.district} District • {region.state}, {region.country}
                </p>

                <div style={{ 
                  background: 'rgba(255, 255, 255, 0.02)', 
                  padding: '12px', 
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  marginBottom: '16px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Coordinates:</span>
                    <span className="mono">{region.coordinates?.latitude}°N, {region.coordinates?.longitude}°E</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Climate Classification:</span>
                    <span>{region.climateZone}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Area:</span>
                    <span className="mono">{region.areaKm2 ? `${region.areaKm2} km²` : 'N/A'}</span>
                  </div>
                </div>

                {region.tags && region.tags.length > 0 && (
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                    {region.tags.map(t => (
                      <span key={t} className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--border)', paddingTop: '14px' }}>
                <button
                  className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handleSelectAndNavigate(region.code)}
                  style={{ flex: 1, fontSize: '0.82rem' }}
                >
                  {isSelected ? 'Viewing in Dashboard' : 'Select Region'}
                  <ArrowRight size={14} />
                </button>
                <Link
                  to="/digital-twin"
                  onClick={() => setSelectedRegion(region.code)}
                  className="btn btn-secondary"
                  title="View on Map"
                  style={{ padding: '8px 12px' }}
                >
                  <Layers size={15} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RegionExplorerPage;
