import apiClient from './api';
import { USER_ENDPOINTS } from '../config/endpoints';

// Profile
const getProfile = async () => {
  const response = await apiClient.get(USER_ENDPOINTS.profile);
  return response.data;
};

const updateProfile = async (updatedData) => {
  const response = await apiClient.put(USER_ENDPOINTS.profile, updatedData);
  return response.data;
};

// Addresses
const getAddresses = async () => {
  const response = await apiClient.get(USER_ENDPOINTS.addresses.list);
  return response.data;
};

const addAddress = async (addressData) => {
  const response = await apiClient.post(USER_ENDPOINTS.addresses.list, addressData);
  return response.data;
};

const updateAddress = async (id, updatedData) => {
  const response = await apiClient.put(USER_ENDPOINTS.addresses.detail(id), updatedData);
  return response.data;
};

const deleteAddress = async (id) => {
  const response = await apiClient.delete(USER_ENDPOINTS.addresses.detail(id));
  return response.data;
};

export default {
  getProfile,
  updateProfile,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
};
