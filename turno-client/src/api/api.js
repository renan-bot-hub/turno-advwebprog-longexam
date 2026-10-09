import axios from 'axios';
import { getToken, clearSession } from './session.js';

const api = axios.create({
  // Set VITE_API_URL in turno-client/.env to point at a deployed API
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Auto-attach the JWT token of the current session
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Login/register failures are form errors, not an expired session
const AUTH_FORM_ENDPOINTS = ['/auth/login', '/auth/register'];

// Send the user back to sign in when their session is no longer valid
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const isAuthForm = AUTH_FORM_ENDPOINTS.some((path) => error.config?.url?.startsWith(path));
    const isDeactivated = status === 403 && /deactivated/i.test(error.response?.data?.message || '');

    if (!isAuthForm && getToken() && (status === 401 || isDeactivated)) {
      clearSession();
      localStorage.removeItem('cart');
      window.location.href = '/auth/signin';
    }
    return Promise.reject(error);
  }
);

export default api;
