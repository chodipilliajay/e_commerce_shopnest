import axios from 'axios';

// In local dev, Vite's proxy (vite.config.js) forwards /api/v1 to the backend, so the default
// baseURL works as-is. In production, the frontend and backend are usually on different domains,
// so set VITE_API_URL (e.g. https://your-backend.onrender.com/api/v1) in your deployment platform.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  withCredentials: true,
});

export default api;
