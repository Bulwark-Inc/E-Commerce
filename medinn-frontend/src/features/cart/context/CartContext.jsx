import React, { createContext, useContext, useReducer, useEffect } from 'react';
import {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  applyCoupon,
  removeCoupon,
} from '../service/cartService';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

const initialState = {
  cart: {
    items: [],
    total_price: 0,
    total_items: 0,
    coupon: null,
    discount: 0,
  },
  loading: false,
  error: null,
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'CART_LOADING':
      return { ...state, loading: true, error: null };

    case 'CART_SUCCESS':
      return { ...state, cart: action.payload, loading: false };

    case 'CART_ERROR':
      return { ...state, error: action.payload, loading: false };

    case 'CART_CLEAR':
      return {
        ...state,
        cart: { items: [], total_price: 0, total_items: 0, coupon: null, discount: 0 },
        loading: false,
      };

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    dispatch({ type: 'CART_LOADING' });
    try {
      const res = await getCart();
      const cartData = res.data?.items ? res.data : initialState.cart;
      dispatch({ type: 'CART_SUCCESS', payload: cartData });
    } catch (err) {
      dispatch({
        type: 'CART_ERROR',
        payload: err.response?.data?.detail || 'Failed to fetch cart',
      });
    }
  };

  const addItem = async (product_id, quantity = 1) => {
    dispatch({ type: 'CART_LOADING' });
    try {
      await addItemToCart({ product_id, quantity });
      fetchCart();
    } catch (err) {
      dispatch({
        type: 'CART_ERROR',
        payload: err.response?.data?.detail || 'Failed to add item',
      });
    }
  };

  const updateItem = async (itemId, quantity) => {
    dispatch({ type: 'CART_LOADING' });
    try {
      await updateCartItem(itemId, quantity);
      fetchCart();
    } catch (err) {
      dispatch({
        type: 'CART_ERROR',
        payload: err.response?.data?.detail || 'Failed to update item',
      });
    }
  };

  const removeItem = async (itemId) => {
    dispatch({ type: 'CART_LOADING' });
    try {
      await removeCartItem(itemId);
      fetchCart();
    } catch (err) {
      dispatch({
        type: 'CART_ERROR',
        payload: err.response?.data?.detail || 'Failed to remove item',
      });
    }
  };

  const clear = async () => {
    dispatch({ type: 'CART_LOADING' });
    try {
      await clearCart();
      dispatch({ type: 'CART_CLEAR' });
    } catch (err) {
      dispatch({
        type: 'CART_ERROR',
        payload: err.response?.data?.detail || 'Failed to clear cart',
      });
    }
  };

  const applyCartCoupon = async (couponCode) => {
    dispatch({ type: 'CART_LOADING' });
    try {
      const res = await applyCoupon(couponCode);
      dispatch({ type: 'CART_SUCCESS', payload: res.data });
    } catch (err) {
      dispatch({
        type: 'CART_ERROR',
        payload: err.response?.data?.detail || 'Invalid coupon',
      });
    }
  };

  const removeCartCoupon = async () => {
    dispatch({ type: 'CART_LOADING' });
    try {
      const res = await removeCoupon();
      dispatch({ type: 'CART_SUCCESS', payload: res.data });
    } catch (err) {
      dispatch({
        type: 'CART_ERROR',
        payload: err.response?.data?.detail || 'Failed to remove coupon',
      });
    }
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        fetchCart,
        addItem,
        updateItem,
        removeItem,
        clear,
        applyCartCoupon,
        removeCartCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
