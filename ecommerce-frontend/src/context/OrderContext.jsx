import React, { createContext, useContext, useReducer } from 'react';
import {
  getOrders,
  getOrderDetail,
  createOrder,
  cancelOrder,
  initializePayment,
  verifyPayment
} from '../services/orderService';

// Context
const OrderContext = createContext();
export const useOrders = () => useContext(OrderContext);

// Initial State
const initialState = {
  orders: [],
  order: null,
  loading: false,
  error: null,
};

// Reducer
const orderReducer = (state, action) => {
  switch (action.type) {
    case 'ORDER_LOADING':
      return { ...state, loading: true, error: null };
    case 'ORDERS_SUCCESS':
      return { ...state, orders: action.payload, loading: false };
    case 'ORDER_SUCCESS':
      return { ...state, order: action.payload, loading: false };
    case 'ORDER_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

// Provider
export const OrderProvider = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, initialState);

  // Actions
  const fetchOrders = async () => {
    dispatch({ type: 'ORDER_LOADING' });
    try {
      const res = await getOrders();
      dispatch({ type: 'ORDERS_SUCCESS', payload: res.data });
    } catch (err) {
      dispatch({ type: 'ORDER_ERROR', payload: err.response?.data || err.message });
    }
  };

  const fetchOrder = async (id) => {
    dispatch({ type: 'ORDER_LOADING' });
    try {
      const res = await getOrderDetail(id);
      dispatch({ type: 'ORDER_SUCCESS', payload: res.data });
    } catch (err) {
      dispatch({ type: 'ORDER_ERROR', payload: err.response?.data || err.message });
    }
  };

  const createNewOrder = async (orderData) => {
    dispatch({ type: 'ORDER_LOADING' });
    try {
      const res = await createOrder(orderData);
      dispatch({ type: 'ORDER_SUCCESS', payload: res.data });
      return res.data; // Return for further actions like payment init
    } catch (err) {
      dispatch({ type: 'ORDER_ERROR', payload: err.response?.data || err.message });
      throw err;
    }
  };

  const cancelExistingOrder = async (id) => {
    dispatch({ type: 'ORDER_LOADING' });
    try {
      await cancelOrder(id);
      await fetchOrders(); // Refresh list after cancel
    } catch (err) {
      dispatch({ type: 'ORDER_ERROR', payload: err.response?.data || err.message });
    }
  };

  const startPayment = async (id) => {
    dispatch({ type: 'ORDER_LOADING' });
    try {
      const res = await initializePayment(id);
      return res.data; // payment_url, reference
    } catch (err) {
      dispatch({ type: 'ORDER_ERROR', payload: err.response?.data || err.message });
      throw err;
    }
  };

  const confirmPayment = async (reference) => {
    dispatch({ type: 'ORDER_LOADING' });
    try {
      const res = await verifyPayment(reference);
      return res.data;
    } catch (err) {
      dispatch({ type: 'ORDER_ERROR', payload: err.response?.data || err.message });
      throw err;
    }
  };

  return (
    <OrderContext.Provider
      value={{
        ...state,
        fetchOrders,
        fetchOrder,
        createNewOrder,
        cancelExistingOrder,
        startPayment,
        confirmPayment
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
