import apiClient from './api';
import { AUTH_ENDPOINTS } from '../config/endpoints';
import {
  setAccessToken,
  setRefreshToken,
  setUser,
  clearTokens,
} from '../utils/token';

const login = async (credentials) => {
  const response = await apiClient.post(AUTH_ENDPOINTS.login, {
    email: credentials.email?.trim(),
    password: credentials.password
  });
  const { access, refresh, user} = response.data;

  setAccessToken(access);
  setRefreshToken(refresh);
  setUser(user);

  return { access, refresh, user };
};

const register = async (userData) => {
  const response = await apiClient.post(AUTH_ENDPOINTS.register, userData);
  return response.data;
};

const requestPasswordReset = async (email) => {
  const response = await apiClient.post(AUTH_ENDPOINTS.passwordReset, { email });
  return response.data;
};

const refreshAccessToken = async (refreshToken) => {
  const response = await apiClient.post(AUTH_ENDPOINTS.refresh, {
    refresh: refreshToken,
  });
  return response.data;
};

const logout = () => {
  clearTokens();
  // Optional: redirect handled in context or router guard
};

export default {
  login,
  register,
  requestPasswordReset,
  refreshAccessToken,
  logout,
};