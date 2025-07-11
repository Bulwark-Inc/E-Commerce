import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, AUTH_USER } from '../constants/constants';
import { jwtDecode } from 'jwt-decode';

/** Get Access Token from localStorage */
export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);

/** Get Refresh Token from localStorage */
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

/** Get Refresh Token from localStorage */
export const getUser = () => {
  const userString = localStorage.getItem(AUTH_USER)
  const currentUser = userString ? JSON.parse(userString) : null;
  return { currentUser };
};

/** Save Access Token to localStorage */
export const setAccessToken = (token) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

/** Save Refresh Token to localStorage */
export const setRefreshToken = (token) => {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
};

/** Save Refresh Token to localStorage */
export const setUser = (user) => {
  localStorage.setItem(AUTH_USER, JSON.stringify(user));
};

/** Clear both tokens from localStorage */
export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER);
};

/** Check if a token is valid (not expired) */
export const isTokenValid = (token) => {
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000; // convert to seconds
    return decoded.exp > now;
  } catch (err) {
    console.error('Invalid token:', err);
    return false;
  }
};
