import apiClient from '../../../api/api';
import { PAYMENT_ENDPOINTS } from '../../../shared/constants/endpoints';

/** Initialize Payment for Order */
export const initializePayment = (orderId) => {
  return apiClient.post(PAYMENT_ENDPOINTS.initializePayment(orderId));
};

/** Verify Payment Status */
export const verifyPayment = (reference) => {
  return apiClient.get(PAYMENT_ENDPOINTS.verifyPayment(reference));
};
