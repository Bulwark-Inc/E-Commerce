import apiClient from '../../../api/api'; 
import { CART_ENDPOINTS } from '../../../shared/constants/endpoints';  // Your endpoint constants

/** Get the current user's cart */
export const getCart = () => {
  return apiClient.get(CART_ENDPOINTS.cart);  // Get cart details
};

/** Clear the entire cart */
export const clearCart = () => {
  return apiClient.post(CART_ENDPOINTS.clear);  // Post request to clear the cart
};

/** Apply a coupon to the cart */
export const applyCoupon = async (couponCode) => {
  try {
    const response = await apiClient.post(CART_ENDPOINTS.applyCoupon, {
      coupon_code: couponCode,
    });
    console.log('[✅ applyCoupon success]', response.data);
    return response;
  } catch (error) {
    console.error('[❌ applyCoupon error]', error.response?.data || error.message);
    throw error;
  }
};

/** Remove applied coupon from the cart */
export const removeCoupon = async () => {
  try {
    const response = await apiClient.delete(CART_ENDPOINTS.removeCoupon);
    console.log('[✅ removeCoupon success]', response.data);
    return response;
  } catch (error) {
    console.error('[❌ removeCoupon error]', error.response?.data || error.message);
    throw error;
  }
};

/** Add an item to the cart */
export const addItemToCart = ({ product_id, quantity }) => {
  return apiClient.post(CART_ENDPOINTS.items, { product_id, quantity });  // Post request to add item to the cart
};

/** Update the quantity of a cart item */
export const updateCartItem = (itemId, quantity) => {
  return apiClient.patch(CART_ENDPOINTS.cartItemDetail(itemId), { quantity });  // Update the quantity of the item
};

/** Remove an item from the cart */
export const removeCartItem = (itemId) => {
  return apiClient.delete(CART_ENDPOINTS.cartItemDetail(itemId));  // Remove the item from the cart
};

/** Get list of all cart items (if you want separately) */
export const getCartItems = () => {
  return apiClient.get(CART_ENDPOINTS.items);  // Get all cart items
};

/** Proceed to checkout */
export const checkout = () => {
  return apiClient.post(CART_ENDPOINTS.checkout);  // Post request to proceed to checkout
};
