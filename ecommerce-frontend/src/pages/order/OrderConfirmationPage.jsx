import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useOrders } from '../../context/OrderContext';

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference');
  const navigate = useNavigate();

  const { confirmPayment } = useOrders();
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!reference) {
        setError('Payment reference missing from callback.');
        setLoading(false);
        return;
      }

      try {
        const res = await confirmPayment(reference);
        setStatusMessage(`✅ Payment Verified! Order #${res.order_id} is now processing.`);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to verify payment. Please contact support.');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
        {loading ? (
          <div className="animate-pulse text-lg font-medium text-gray-700">Verifying your payment...</div>
        ) : error ? (
          <>
            <div className="text-red-600 font-semibold mb-4">{error}</div>
            <button
              onClick={() => navigate('/order')}
              className="text-blue-600 hover:underline"
            >
              View your orders
            </button>
          </>
        ) : (
          <>
            <div className="text-green-600 text-2xl font-bold mb-4">{statusMessage}</div>
            <Link to="/order" className="text-blue-600 hover:underline">
              Go to your orders
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
