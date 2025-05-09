import { createContext, useContext, useState, useEffect } from 'react';
import userService from '../services/userService';
import { useAuth } from './AuthContext';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const [profile, setProfile] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState(null);

  // Fetch profile + addresses after login
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserProfile();
      fetchUserAddresses();
    }
  }, [isAuthenticated]);

  const fetchUserProfile = async () => {
    setUserLoading(true);
    try {
      const data = await userService.getProfile();
      setProfile(data);
      setUserError(null);
    } catch (err) {
      setUserError(err.response?.data || 'Failed to load profile');
    } finally {
      setUserLoading(false);
    }
  };

  const updateUserProfile = async (updatedData) => {
    try {
      const data = await userService.updateProfile(updatedData);
      setProfile(data);
      return data;
    } catch (err) {
      throw err;
    }
  };

  const fetchUserAddresses = async () => {
    try {
      const data = await userService.getAddresses();
      setAddresses(Array.isArray(data) ? data : (Array.isArray(data.results) ? data.results : []));
    } catch (err) {
      setUserError(err.response?.data || 'Failed to load addresses');
    }
  };

  const addAddress = async (newData) => {
    try {
      const newAddress = await userService.addAddress(newData);
      setAddresses((prev) => [...prev, newAddress]);
    } catch (err) {
      throw err;
    }
  };

  const updateAddress = async (id, updatedData) => {
    try {
      const updated = await userService.updateAddress(id, updatedData);
      setAddresses((prev) =>
        prev.map((addr) => (addr.id === id ? updated : addr))
      );
    } catch (err) {
      throw err;
    }
  };

  const deleteAddress = async (id) => {
    try {
      await userService.deleteAddress(id);
      setAddresses((prev) => prev.filter((addr) => addr.id !== id));
    } catch (err) {
      throw err;
    }
  };

  const value = {
    profile,
    addresses,
    userLoading,
    userError,
    fetchUserProfile,
    updateUserProfile,
    fetchUserAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};
