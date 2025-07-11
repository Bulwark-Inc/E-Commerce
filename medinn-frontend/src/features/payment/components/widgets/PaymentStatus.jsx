import React from 'react';
import { usePayment } from '../../context/PaymentContext';

const PaymentStatus = () => {
  const { loading, paymentSuccess, error } = usePayment();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {paymentSuccess ? (
        <div className="text-green-600">Payment was successful!</div>
      ) : (
        error && <div className="text-red-600">Payment failed: {error}</div>
      )}
    </div>
  );
};

export default PaymentStatus;
