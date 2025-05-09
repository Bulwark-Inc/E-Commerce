import React, { createContext, useContext, useReducer, useEffect } from 'react';
import {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  applyCoupon,
  removeCoupon,
} from '../services/cartService';

// Context
const CartContext = createContext();

export const useCart = () => useContext(CartContext);

// Initial State (safe default cart shape)
const initialState = {
  cart: {
    items: [],
    total_price: 0,
  },
  loading: false,
  error: null,
};

// Reducer
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
        cart: { items: [], total_price: 0 }, // <-- safe fallback on clear
        loading: false,
      };
    default:
      return state;
  }
};

// Provider
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    dispatch({ type: 'CART_LOADING' });
    try {
      const res = await getCart();
      const cartData = res.data?.items ? res.data : { items: [], total_price: 0 };
      dispatch({ type: 'CART_SUCCESS', payload: cartData });
    } catch (err) {
      dispatch({ type: 'CART_ERROR', payload: err.response?.data || err.message });
    }
  };

  const addItem = async (product_id, quantity = 1) => {
    dispatch({ type: 'CART_LOADING' });
    try {
      await addItemToCart({ product_id, quantity });
      await fetchCart();
    } catch (err) {
      dispatch({ type: 'CART_ERROR', payload: err.response?.data || err.message });
    }
  };

  const updateItem = async (itemId, quantity) => {
    dispatch({ type: 'CART_LOADING' });
    try {
      await updateCartItem(itemId, quantity);
      await fetchCart();
    } catch (err) {
      dispatch({ type: 'CART_ERROR', payload: err.response?.data || err.message });
    }
  };

  const removeItem = async (itemId) => {
    dispatch({ type: 'CART_LOADING' });
    try {
      await removeCartItem(itemId);
      await fetchCart();
    } catch (err) {
      dispatch({ type: 'CART_ERROR', payload: err.response?.data || err.message });
    }
  };

  const clear = async () => {
    dispatch({ type: 'CART_LOADING' });
    try {
      await clearCart();
      dispatch({ type: 'CART_CLEAR' });
    } catch (err) {
      dispatch({ type: 'CART_ERROR', payload: err.response?.data || err.message });
    }
  };

  const applyCartCoupon = async (couponCode) => {
    dispatch({ type: 'CART_LOADING' });
    try {
      await applyCoupon(couponCode);
      await fetchCart();
    } catch (err) {
      dispatch({ type: 'CART_ERROR', payload: err.response?.data || err.message });
    }
  };

  const removeCartCoupon = async () => {
    dispatch({ type: 'CART_LOADING' });
    try {
      await removeCoupon();
      await fetchCart();
    } catch (err) {
      dispatch({ type: 'CART_ERROR', payload: err.response?.data || err.message });
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
