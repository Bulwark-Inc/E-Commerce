import React, { createContext, useContext, useReducer } from 'react';
import { createOrder } from '../service/checkoutService';

const CheckoutContext = createContext();
export const useCheckout = () => useContext(CheckoutContext);

const initialState = {
  loading: false,
  error: null,
  order: null,
};

const checkoutReducer = (state, action) => {
  switch (action.type) {
    case 'LOADING':
      return { ...state, loading: true, error: null };
    case 'CREATE_ORDER_SUCCESS':
      return { ...state, loading: false, order: action.payload };
    case 'ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export const CheckoutProvider = ({ children }) => {
  const [state, dispatch] = useReducer(checkoutReducer, initialState);

  const createNewOrder = async (payload) => {
    dispatch({ type: 'LOADING' });
    try {
      const res = await createOrder(payload);
      dispatch({ type: 'CREATE_ORDER_SUCCESS', payload: res.data });
      return res.data; // ✅ return created order
    } catch (err) {
      dispatch({
        type: 'ERROR',
        payload: err.response?.data || err.message,
      });
      throw err; // ✅ re-throw for component-level handling
    }
  };

  return (
    <CheckoutContext.Provider
      value={{
        ...state,
        createNewOrder,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};
