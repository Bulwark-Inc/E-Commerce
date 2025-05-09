import apiClient from './api';
import { ORDER_ENDPOINTS, PAYMENT_ENDPOINTS } from '../config/endpoints';

// Orders

export const getOrders = () => {
  return apiClient.get(ORDER_ENDPOINTS.orders);
};

export const getOrderDetail = (id) => {
  return apiClient.get(ORDER_ENDPOINTS.orderDetail(id));
};

export const createOrder = (orderData) => {
  return apiClient.post(ORDER_ENDPOINTS.orders, orderData);
};

export const cancelOrder = (id) => {
  return apiClient.post(ORDER_ENDPOINTS.cancelOrder(id));
};

// Payments

export const initializePayment = (id) => {
  return apiClient.post(ORDER_ENDPOINTS.initializePayment(id));
};

export const verifyPayment = (reference) => {
  return apiClient.get(PAYMENT_ENDPOINTS.verifyPayment(reference));
};
