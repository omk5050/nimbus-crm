import axios from 'axios';

/**
 * Enterprise API Client with smart base URL fallback for single-link Render deployment.
 * Defaults to `/api/v1` when `VITE_API_BASE_URL` is not explicitly set.
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT access token if available in localStorage
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('nimbus_access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Centralized handling for unauthorized responses (401 token expiration)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('nimbus_access_token');
    }
    return Promise.reject(error);
  },
);
