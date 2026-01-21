import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor opcional para incluir portal no header se existir no storage
api.interceptors.request.use((config) => {
  const portal = localStorage.getItem('portal');
  if (portal) {
    config.headers['x-portal'] = portal;
  }
  return config;
});

export default api;
