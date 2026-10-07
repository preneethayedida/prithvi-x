import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

export const MainLayout = () => {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <footer className="footer">
        <div>
          <strong>PRITHVI-X</strong> — Regional Environmental Digital Twin & Intelligence Platform
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <span>Version 1.0.0</span>
          <span>•</span>
          <span>Open-Meteo & Climatological Integration</span>
          <span>•</span>
          <span>FastAPI & Scikit-Learn Engine</span>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
