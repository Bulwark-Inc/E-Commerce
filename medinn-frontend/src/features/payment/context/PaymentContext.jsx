import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { initializePayment, verifyPayment } from '../service/paymentService';

// Create the context
const PaymentContext = createContext();

// Hook to access the payment context
export const usePayment = () => useContext(PaymentContext);

// Initial state for the reducer
const initialState = {
  loading: false,
  paymentSuccess: false,
  paymentReference: null,
  error: null,
};

// Reducer to manage payment state
const paymentReducer = (state, action) => {
  switch (action.type) {
    case 'PAYMENT_LOADING':
      return { ...state, loading: true, error: null };
    case 'PAYMENT_SUCCESS':
      return { ...state, loading: false, paymentSuccess: true };
    case 'PAYMENT_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'SET_PAYMENT_REFERENCE':
      return { ...state, paymentReference: action.payload };
    default:
      return state;
  }
};

// Provider component
export const PaymentProvider = ({ children }) => {
  const [state, dispatch] = useReducer(paymentReducer, initialState);

  // Start payment and redirect user to payment gateway
  const startPayment = async (orderId) => {
    dispatch({ type: 'PAYMENT_LOADING' });

    try {
      const res = await initializePayment(orderId);
      const reference = res.data.reference;

      dispatch({ type: 'SET_PAYMENT_REFERENCE', payload: reference });

      // Redirect user to payment gateway
      window.location.href = res.data.payment_url;
    } catch (err) {
      dispatch({
        type: 'PAYMENT_ERROR',
        payload: err.response?.data || err.message,
      });
    }
  };

  // Memoized: Manually set the payment reference (e.g., from URL params)
  const setReference = useCallback((ref) => {
    dispatch({ type: 'SET_PAYMENT_REFERENCE', payload: ref });
  }, []);

  // Memoized: Verify payment using the reference stored in state
  const verifyPaymentStatus = useCallback(async () => {
    if (!state.paymentReference) {
      dispatch({
        type: 'PAYMENT_ERROR',
        payload: 'No payment reference found',
      });
      return;
    }

    dispatch({ type: 'PAYMENT_LOADING' });

    try {
      const res = await verifyPayment(state.paymentReference);

      if (res.data.status === 'Payment verified') {
        dispatch({ type: 'PAYMENT_SUCCESS' });
      } else {
        dispatch({
          type: 'PAYMENT_ERROR',
          payload: 'Payment verification failed',
        });
      }
    } catch (err) {
      dispatch({
        type: 'PAYMENT_ERROR',
        payload: err.response?.data || err.message,
      });
    }
  }, [state.paymentReference]);

  return (
    <PaymentContext.Provider
      value={{
        ...state,
        startPayment,
        verifyPaymentStatus,
        setReference,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};
