import apiClient from './api';
import { CART_ENDPOINTS } from '../config/endpoints';

/** Get the current user's cart */
export const getCart = () => {
  return apiClient.get(CART_ENDPOINTS.cart);
};

/** Clear the entire cart */
export const clearCart = () => {
  return apiClient.post(CART_ENDPOINTS.clear);
};

/** Apply a coupon to the cart */
export const applyCoupon = (couponCode) => {
  return apiClient.post(CART_ENDPOINTS.applyCoupon, { coupon_code: couponCode });
};

/** Remove applied coupon from the cart */
export const removeCoupon = () => {
  return apiClient.delete(CART_ENDPOINTS.removeCoupon);
};

/** Add an item to the cart */
export const addItemToCart = ({ product_id, quantity }) => {
  return apiClient.post(CART_ENDPOINTS.items, { product_id, quantity });
};

/** Update quantity of a cart item */
export const updateCartItem = (itemId, quantity) => {
  return apiClient.patch(CART_ENDPOINTS.cartItemDetail(itemId), { quantity });
};

/** Remove an item from the cart */
export const removeCartItem = (itemId) => {
  return apiClient.delete(CART_ENDPOINTS.cartItemDetail(itemId));
};

/** Get list of all cart items (if you want separately) */
export const getCartItems = () => {
  return apiClient.get(CART_ENDPOINTS.items);
};
