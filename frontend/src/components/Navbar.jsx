import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  Globe2, 
  LayoutDashboard, 
  Layers, 
  MapPin, 
  LineChart, 
  GitCompare, 
  Cpu, 
  Activity,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useRegion } from '../context/RegionContext';

export const Navbar = () => {
  const { regions, selectedRegion, setSelectedRegion, systemHealth } = useRegion();

  const isHealthy = systemHealth?.status === 'HEALTHY';

  return (
    <header className="navbar">
      <div className="nav-brand">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="nav-brand-logo">
            <Globe2 size={20} />
          </div>
          <div>
            <div className="nav-brand-text">PRITHVI-X</div>
            <div className="nav-brand-subtitle">Regional Digital Twin</div>
          </div>
        </Link>
      </div>

      <nav className="nav-links">
        <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={16} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/digital-twin" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Layers size={16} />
          <span>Digital Twin</span>
        </NavLink>

        <NavLink to="/regions" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <MapPin size={16} />
          <span>Regions</span>
        </NavLink>

        <NavLink to="/analytics" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <LineChart size={16} />
          <span>Analytics</span>
        </NavLink>

        <NavLink to="/compare" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <GitCompare size={16} />
          <span>Comparison</span>
        </NavLink>

        <NavLink to="/forecasting" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Cpu size={16} />
          <span>ML Forecast</span>
        </NavLink>
      </nav>

      <div className="nav-actions">
        {/* Global Region Switcher */}
        {regions.length > 0 && selectedRegion && (
          <select
            className="select"
            value={selectedRegion.code}
            onChange={(e) => setSelectedRegion(e.target.value)}
            style={{ fontWeight: 600, minWidth: '150px' }}
          >
            {regions.map((r) => (
              <option key={r.code} value={r.code}>
                📍 {r.name} ({r.district})
              </option>
            ))}
          </select>
        )}

        {/* System Health Indicator */}
        <div 
          className={`badge ${isHealthy ? 'badge-emerald' : 'badge-amber'}`}
          title={isHealthy ? 'System operating nominally' : 'System running in fallback mode'}
        >
          {isHealthy ? <CheckCircle2 size={13} /> : <AlertTriangle size={13} />}
          <span>{isHealthy ? 'LIVE TWIN' : 'STANDBY'}</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
