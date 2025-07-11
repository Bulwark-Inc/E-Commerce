import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useOrder } from '../../order/context/OrderContext';
import { usePayment } from '../../payment/context/PaymentContext';

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference');

  const { fetchOrderDetail, orderDetails } = useOrder();
  const {
    paymentSuccess,
    error,
    loading,
    verifyPaymentStatus,
    paymentReference,
    setReference,
  } = usePayment();

  const [status, setStatus] = useState('Verifying payment...');
  const [hasVerified, setHasVerified] = useState(false); // 🔒 Prevent re-triggering

  useEffect(() => {
    if (!reference || hasVerified) return;

    const verify = async () => {
      // Set reference if not already in context
      if (!paymentReference) {
        setReference(reference);
      }

      // Verify payment and fetch order
      await verifyPaymentStatus();
      await fetchOrderDetail(orderId);

      // Prevent re-verification
      setHasVerified(true);
    };

    verify();
  }, [reference, hasVerified, paymentReference, orderId, setReference, verifyPaymentStatus, fetchOrderDetail]);

  useEffect(() => {
    if (loading) {
      setStatus('🔄 Verifying payment...');
    } else if (paymentSuccess) {
      setStatus('✅ Payment verified successfully!');
    } else if (error) {
      setStatus(`❌ ${error?.error || 'Payment verification failed.'}`);
    }
  }, [loading, paymentSuccess, error]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Order Confirmation</h1>
      <p className="mb-4">{status}</p>

      {orderDetails && (
        <div className="bg-gray-100 p-4 rounded shadow">
          <p><strong>Order ID:</strong> {orderDetails.id}</p>
          <p><strong>Status:</strong> {orderDetails.status}</p>
          <p><strong>Total:</strong> ₦{orderDetails.total_amount}</p>
        </div>
      )}

      <button
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => window.location.href = '/'}
      >
        Back to Home
      </button>
    </div>
  );
};

export default OrderConfirmationPage;
