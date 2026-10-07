import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Globe2, 
  Layers, 
  ShieldCheck, 
  Activity, 
  Cpu, 
  LineChart, 
  ArrowRight,
  Database,
  Compass,
  CheckCircle2
} from 'lucide-react';

export const LandingPage = () => {
  const capabilities = [
    {
      icon: Layers,
      title: 'Geospatial Digital Twin',
      desc: 'Interactive coordinate-level spatial representation of regions with multi-layer overlays for temperature, precipitation, and air quality.'
    },
    {
      icon: ShieldCheck,
      title: 'PRITHVI-X Environmental Index',
      desc: 'A transparent, multi-factor 0–100 composite index combining thermal comfort, rainfall balance, humidity stability, and atmospheric purity.'
    },
    {
      icon: Activity,
      title: 'Explainable Anomaly Detection',
      desc: 'Mathematically rigorous Z-score, IQR, and baseline deviation algorithms that flag environmental shifts with non-alarmist explanations.'
    },
    {
      icon: Cpu,
      title: 'Chronological ML Forecasting',
      desc: 'Autoregressive machine-learning models trained with strict temporal splits to eliminate data leakage and project future trajectories.'
    },
    {
      icon: LineChart,
      title: 'Deep Historical Analytics',
      desc: 'High-resolution time-series exploration across hourly, daily, and seasonal horizons with statistical moment calculation.'
    },
    {
      icon: Database,
      title: 'Resilient Dual-Data Architecture',
      desc: 'Seamlessly fetches live WMO Open-Meteo telemetry with robust climatological benchmark fallback for guaranteed reliability.'
    }
  ];

  return (
    <div style={{ paddingBottom: '60px' }}>
      {/* Hero Section */}
      <section style={{
        textAlign: 'center',
        padding: '60px 20px 50px 20px',
        maxWidth: '960px',
        margin: '0 auto'
      }}>
        <div className="badge badge-emerald" style={{ marginBottom: '18px', padding: '6px 14px' }}>
          <Compass size={14} />
          <span>Regional Environmental Digital Twin Platform</span>
        </div>

        <h1 style={{ 
          fontSize: '3.2rem', 
          lineHeight: '1.15', 
          fontWeight: 800, 
          letterSpacing: '-0.03em',
          marginBottom: '20px'
        }}>
          Environmental Intelligence.<br />
          <span style={{ 
            background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Digitally Reconstructed.
          </span>
        </h1>

        <p style={{ 
          fontSize: '1.15rem', 
          color: 'var(--text-secondary)', 
          lineHeight: '1.6', 
          marginBottom: '32px',
          maxWidth: '780px',
          margin: '0 auto 32px auto'
        }}>
          PRITHVI-X integrates physical atmospheric telemetry, historical baselines, geospatial mapping, and machine learning to build high-fidelity digital representations of monitored geographical regions.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <Link to="/digital-twin" className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '0.95rem' }}>
            <Layers size={18} />
            <span>Launch Digital Twin</span>
            <ArrowRight size={16} />
          </Link>
          <Link to="/dashboard" className="btn btn-secondary" style={{ padding: '12px 24px', fontSize: '0.95rem' }}>
            <span>Explore Dashboard</span>
          </Link>
        </div>
      </section>

      {/* Signature Region Highlights */}
      <section style={{ marginBottom: '60px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--text-secondary)' }}>
            Active Monitored Regions in Digital Twin
          </h2>
        </div>

        <div className="grid-3">
          <div className="card" style={{ borderTop: '3px solid var(--emerald-500)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span className="badge badge-emerald">Delta Twin</span>
              <span className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>16.54°N, 81.52°E</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>Bhimavaram</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>West Godavari, Andhra Pradesh</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '0.85rem' }}>
              <div>Temp: <strong className="mono">~31.4°C</strong></div>
              <div>Humidity: <strong className="mono">74%</strong></div>
              <div>Rainfall: <strong className="mono">2.4 mm</strong></div>
              <div>Index: <strong className="mono" style={{ color: 'var(--emerald-400)' }}>78/100</strong></div>
            </div>
          </div>

          <div className="card" style={{ borderTop: '3px solid var(--cyan-500)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span className="badge badge-cyan">Basin Twin</span>
              <span className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>16.51°N, 80.65°E</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>Vijayawada</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>NTR District, Andhra Pradesh</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '0.85rem' }}>
              <div>Temp: <strong className="mono">~33.5°C</strong></div>
              <div>Humidity: <strong className="mono">66%</strong></div>
              <div>Rainfall: <strong className="mono">1.1 mm</strong></div>
              <div>Index: <strong className="mono" style={{ color: 'var(--cyan-400)' }}>74/100</strong></div>
            </div>
          </div>

          <div className="card" style={{ borderTop: '3px solid #818cf8' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span className="badge badge-neutral">Coastal Twin</span>
              <span className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>17.69°N, 83.22°E</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>Visakhapatnam</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Visakhapatnam, Andhra Pradesh</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '0.85rem' }}>
              <div>Temp: <strong className="mono">~29.8°C</strong></div>
              <div>Humidity: <strong className="mono">78%</strong></div>
              <div>Rainfall: <strong className="mono">3.2 mm</strong></div>
              <div>Index: <strong className="mono" style={{ color: '#818cf8' }}>82/100</strong></div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Capabilities */}
      <section style={{ marginBottom: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Platform Architecture & Core Capabilities</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Engineered for scientific defensibility, transparent analytics, and production deployment.
          </p>
        </div>

        <div className="grid-3">
          {capabilities.map((cap, idx) => {
            const Icon = cap.icon;
            return (
              <div key={idx} className="card">
                <div style={{ 
                  width: '38px', 
                  height: '38px', 
                  borderRadius: '8px', 
                  background: 'rgba(16, 185, 129, 0.1)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginBottom: '14px',
                  color: 'var(--emerald-400)'
                }}>
                  <Icon size={20} />
                </div>
                <h3 style={{ fontSize: '1.05rem', marginBottom: '8px' }}>{cap.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  {cap.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
