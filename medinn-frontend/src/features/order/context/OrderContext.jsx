import React, { createContext, useContext, useReducer, useCallback } from 'react';
import {
  getOrderHistory,
  getOrderDetail,
  cancelOrder,
  initializePayment,
  checkoutOrder,
} from '../service/orderService';

const OrderContext = createContext();
export const useOrder = () => useContext(OrderContext);

const initialState = {
  orders: [],
  orderDetails: null,
  paymentInfo: null,
  checkoutResult: null,
  loading: false,
  error: null,
};

const orderReducer = (state, action) => {
  switch (action.type) {
    case 'ORDER_LOADING':
      return { ...state, loading: true, error: null };
    case 'ORDER_SUCCESS':
      return { ...state, orders: action.payload, loading: false };
    case 'ORDER_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'ORDER_DETAIL_SUCCESS':
      return { ...state, orderDetails: action.payload, loading: false };
    case 'ORDER_CANCEL_SUCCESS': {
      const orders = state.orders?.results || [];
      return {
        ...state,
        orders: {
          ...state.orders,
          results: orders.filter((order) => order.id !== action.payload),
        },
        loading: false,
      };
    }
    case 'INITIALIZE_PAYMENT_SUCCESS':
      return { ...state, paymentInfo: action.payload, loading: false };
    case 'CHECKOUT_SUCCESS':
      return { ...state, checkoutResult: action.payload, loading: false };
    default:
      return state;
  }
};

export const OrderProvider = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, initialState);

  const fetchOrderHistory = useCallback(async ({ page = 1 } = {}) => {
    dispatch({ type: 'ORDER_LOADING' });
    try {
      const res = await getOrderHistory(page);
      dispatch({ type: 'ORDER_SUCCESS', payload: res.data });
    } catch (err) {
      dispatch({
        type: 'ORDER_ERROR',
        payload: err.response?.data || err.message,
      });
    }
  }, []);

  const fetchOrderDetail = useCallback(async (orderId) => {
    dispatch({ type: 'ORDER_LOADING' });
    try {
      const res = await getOrderDetail(orderId);
      dispatch({ type: 'ORDER_DETAIL_SUCCESS', payload: res.data });
    } catch (err) {
      dispatch({
        type: 'ORDER_ERROR',
        payload: err.response?.data || err.message,
      });
    }
  }, []);

  const cancelUserOrder = useCallback(async (orderId) => {
    dispatch({ type: 'ORDER_LOADING' });
    try {
      await cancelOrder(orderId);
      dispatch({ type: 'ORDER_CANCEL_SUCCESS', payload: orderId });
    } catch (err) {
      dispatch({
        type: 'ORDER_ERROR',
        payload: err.response?.data || err.message,
      });
    }
  }, []);

  const handleInitializePayment = useCallback(async (orderId) => {
    dispatch({ type: 'ORDER_LOADING' });
    try {
      const res = await initializePayment(orderId);
      dispatch({ type: 'INITIALIZE_PAYMENT_SUCCESS', payload: res.data });
      return res.data;
    } catch (err) {
      dispatch({
        type: 'ORDER_ERROR',
        payload: err.response?.data || err.message,
      });
      throw err;
    }
  }, []);

  const handleCheckoutOrder = useCallback(async (data) => {
    dispatch({ type: 'ORDER_LOADING' });
    try {
      const res = await checkoutOrder(data);
      dispatch({ type: 'CHECKOUT_SUCCESS', payload: res.data });
      return res.data;
    } catch (err) {
      dispatch({
        type: 'ORDER_ERROR',
        payload: err.response?.data || err.message,
      });
      throw err;
    }
  }, []);

  return (
    <OrderContext.Provider
      value={{
        ...state,
        fetchOrderHistory,
        fetchOrderDetail,
        cancelUserOrder,
        handleInitializePayment,
        handleCheckoutOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
