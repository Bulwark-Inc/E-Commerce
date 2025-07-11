import apiClient from '../../../api/api';
import { ORDER_ENDPOINTS } from '../../../shared/constants/endpoints';

/**
 * Creates an order from the cart (initiating the checkout process)
 * @param {Object} payload - { shipping_address_id, billing_address_id, shipping_price }
 * @returns {Promise} - Resolves with the order creation response
 */
export const createOrder = (payload) => {
  return apiClient.post(ORDER_ENDPOINTS.checkout, payload);
};
