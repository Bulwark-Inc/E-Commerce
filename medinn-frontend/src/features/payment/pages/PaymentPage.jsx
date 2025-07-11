import React, { useEffect } from 'react';
import { usePayment } from '../../context/PaymentContext';
import PaymentForm from '../components/forms/PaymentForm';
import PaymentStatus from '../components/widgets/PaymentStatus';

const PaymentPage = ({ orderId }) => {
  const { paymentSuccess, verifyPaymentStatus } = usePayment();

  useEffect(() => {
    if (paymentSuccess) {
      verifyPaymentStatus(); // Verify payment after it's initiated
    }
  }, [paymentSuccess, verifyPaymentStatus]);

  return (
    <div>
      <h1>Complete Payment</h1>
      {paymentSuccess ? (
        <PaymentStatus />
      ) : (
        <PaymentForm orderId={orderId} />
      )}
    </div>
  );
};

export default PaymentPage;
