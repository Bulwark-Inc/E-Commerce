import axios from 'axios';
import { API_BASE_URL } from '../config/constants';
import { AUTH_ENDPOINTS } from '../config/endpoints';
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  clearTokens,
  isTokenValid
} from '../utils/token';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach token to every request
apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle token refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Prevent infinite loop
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = getRefreshToken();

      if (!refreshToken || !isTokenValid(refreshToken)) {
        clearTokens();
        window.location.href = '/login'; // or use navigation
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${API_BASE_URL}${AUTH_ENDPOINTS.refresh}`, {
          refresh: refreshToken,
        });

        const newAccessToken = response.data.access;
        setAccessToken(newAccessToken);

        // Retry the original request with new token
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
