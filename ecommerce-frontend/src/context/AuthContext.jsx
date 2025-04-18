import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import {
  getAccessToken,
  getRefreshToken,
  isTokenValid,
  clearTokens,
} from '../utils/token';
import { generateUsername } from '../utils/username';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const navigate = useNavigate();

  // On app load → check token validity
  useEffect(() => {
    const access = getAccessToken();
    const refresh = getRefreshToken();

    if (isTokenValid(access)) {
      setIsAuthenticated(true);
    } else if (isTokenValid(refresh)) {
      authService
        .refreshAccessToken(refresh)
        .then((data) => {
          setIsAuthenticated(true);
        })
        .catch(() => {
          handleLogout();
        });
    } else {
      handleLogout();
    }

    setAuthLoading(false);
  }, []);

  // Register user 
  const handleRegister = async ({ email, password, password2, firstName, lastName }) => {
    const username = generateUsername(firstName, lastName);

    const payload = {
      username,
      email,
      password,
      password2,
      first_name: firstName,
      last_name: lastName,
    };

    return authService.register(payload); // Let component handle next steps
  };

  // Login user and store tokens
  const handleLogin = async (credentials) => {
    setAuthError(null);
    try {
      await authService.login(credentials);
      setIsAuthenticated(true);
      navigate('/'); // or your dashboard
    } catch (error) {
      setAuthError(error.response?.data || 'Login failed');
      throw error;
    }
  };

  // Logout user
  const handleLogout = () => {
    clearTokens();
    setIsAuthenticated(false);
    navigate('/login');
  };

  const value = {
    isAuthenticated,
    authLoading,
    authError,
    register: handleRegister,
    login: handleLogin,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
