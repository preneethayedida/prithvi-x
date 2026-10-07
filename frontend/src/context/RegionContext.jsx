import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import EnvironmentalAPI from '../services/api';

const RegionContext = createContext(null);

export const RegionProvider = ({ children }) => {
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [systemHealth, setSystemHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initial load of regions and health probe
  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [regionsRes, healthRes] = await Promise.allSettled([
        EnvironmentalAPI.getRegions(),
        EnvironmentalAPI.getHealth()
      ]);

        if (
         regionsRes.status === 'fulfilled' &&
        regionsRes.value?.data?.data?.length > 0
         ) {
       const regList = regionsRes.value.data.data;
        setRegions(regList);
        // Default to Bhimavaram if present, else first
        const bvm = regList.find(r => r.code === 'IN-AP-BVM') || regList[0];
        setSelectedRegion(bvm);
      } else {
        throw new Error('No monitored regions found.');
      }

      if (healthRes.status === 'fulfilled') {
        setSystemHealth(healthRes.value?.data);
      }
    } catch (err) {
      console.error('[RegionContext Error]', err);
      setError(err.message || 'Failed to initialize region context.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const changeRegion = (regionCode) => {
    const found = regions.find(r => r.code === regionCode || r._id === regionCode);
    if (found) {
      setSelectedRegion(found);
    }
  };

  return (
    <RegionContext.Provider
      value={{
        regions,
        selectedRegion,
        setSelectedRegion: changeRegion,
        systemHealth,
        loading,
        error,
        refresh: fetchInitialData
      }}
    >
      {children}
    </RegionContext.Provider>
  );
};

export const useRegion = () => {
  const context = useContext(RegionContext);
  if (!context) {
    throw new Error('useRegion must be used within a RegionProvider');
  }
  return context;
};
