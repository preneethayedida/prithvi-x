import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorPayload = error.response?.data?.error || {
      code: 'NETWORK_ERROR',
      message: error.message || 'Unable to communicate with the PRITHVI-X backend server.'
    };
    return Promise.reject(errorPayload);
  }
);

export const EnvironmentalAPI = {
  getHealth: () => api.get('/health'),
  getRegions: () => api.get('/regions'),
  getRegionById: (id) => api.get(`/regions/${id}`),
  getCurrentObservation: (regionId) => api.get(`/environment/current/${regionId}`),
  getHistory: (regionId, limit = 168) => api.get(`/environment/history/${regionId}?limit=${limit}`),
  getTrends: (regionId) => api.get(`/environment/trends/${regionId}`),
  getAnomalies: (regionId) => api.get(`/environment/anomalies/${regionId}`),
  getIndex: (regionId) => api.get(`/environment/index/${regionId}`),
  getInsights: (regionId) => api.get(`/environment/insights/${regionId}`),
  compareRegions: (regionIds = []) => {
    const query = regionIds.length > 0 ? `?regionIds=${regionIds.join(',')}` : '';
    return api.get(`/environment/compare${query}`);
  },
  getForecast: (regionId, metric = 'temperature', horizon = 24) => 
    api.get(`/environment/forecast/${regionId}?metric=${metric}&horizon=${horizon}`),
  triggerIngest: (regionId) => api.post(`/environment/ingest/${regionId}`)
};

export default EnvironmentalAPI;
