import apiClient from '../../../api/api';
import { ORDER_ENDPOINTS } from '../../../shared/constants/endpoints';

/** Get a list of all orders */
export const getOrderHistory = () => {
  return apiClient.get(ORDER_ENDPOINTS.orders);
};

/** Get detailed information about a specific order */
export const getOrderDetail = (orderId) => {
  return apiClient.get(ORDER_ENDPOINTS.orderDetail(orderId));
};

/** Cancel a specific order */
export const cancelOrder = (orderId) => {
  return apiClient.post(ORDER_ENDPOINTS.cancelOrder(orderId));
};

/** Initialize payment for an order */
export const initializePayment = (orderId) => {
  return apiClient.post(ORDER_ENDPOINTS.initializePayment(orderId));
};

/** Checkout (create order from cart) */
export const checkoutOrder = (data) => {
  return apiClient.post(ORDER_ENDPOINTS.checkout, data);
};
