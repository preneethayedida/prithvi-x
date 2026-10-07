import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RegionProvider } from './context/RegionContext';
import MainLayout from './layouts/MainLayout';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import DigitalTwinPage from './pages/DigitalTwinPage';
import RegionExplorerPage from './pages/RegionExplorerPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ComparePage from './pages/ComparePage';
import ForecastingPage from './pages/ForecastingPage';

export const App = () => {
  return (
    <RegionProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="digital-twin" element={<DigitalTwinPage />} />
            <Route path="regions" element={<RegionExplorerPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="compare" element={<ComparePage />} />
            <Route path="forecasting" element={<ForecastingPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </RegionProvider>
  );
};

export default App;
