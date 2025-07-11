import apiClient from '../../../api/api';
import { PAYMENT_ENDPOINTS } from '../../../shared/constants/endpoints';

/** Verify payment status using the reference */
export const verifyPayment = (reference) => {
  return apiClient.get(PAYMENT_ENDPOINTS.verifyPayment(reference));
};
