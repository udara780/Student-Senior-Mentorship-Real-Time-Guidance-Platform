import axios from 'axios';

// The baseURL is proxied by Vite in local development
// NOTE: Do NOT set a global Content-Type header here.
// Axios will automatically use 'application/json' for plain objects
// and 'multipart/form-data' (with proper boundary) for FormData.
const api = axios.create({
  baseURL: '/api',
});

// Interceptor to inject JWT transparently
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
