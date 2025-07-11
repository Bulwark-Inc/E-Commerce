import React, { useEffect, useState } from 'react';
import { useOrder } from '../../order/context/OrderContext';
import { Link } from 'react-router-dom';

const OrderHistoryPage = () => {
  const {
    orders = {},
    loading,
    error,
    fetchOrderHistory,
    cancelUserOrder,
    handleInitializePayment,
  } = useOrder();

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchOrderHistory({ page: currentPage });
  }, [currentPage, fetchOrderHistory]);

  const handleCancel = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      await cancelUserOrder(orderId);
      fetchOrderHistory({ page: currentPage });
    }
  };

  const handlePay = async (orderId) => {
    try {
      const paymentInfo = await handleInitializePayment(orderId);
      if (paymentInfo?.payment_url) {
        window.location.href = paymentInfo.payment_url;
      } else {
        console.error('No payment URL received');
      }
    } catch (err) {
      console.error('Payment initialization failed', err);
    }
  };

  const orderResults = orders?.results || [];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Order History</h1>

      {loading && <p>Loading orders...</p>}
      {error && <p className="text-red-600">Error: {error.error || error}</p>}
      {!loading && orderResults.length === 0 && <p>No orders found.</p>}

      {orderResults.map((order) => (
        <div key={order.id} className="border p-4 rounded mb-4">
          <p><strong>Order #{order.id}</strong> — {order.status_display}</p>
          <p>Total: ₦{order.total_price}</p>
          <Link to={`/order/${order.id}`} className="text-blue-600 underline">View Details</Link>

          {order.can_cancel && (
            <button
              onClick={() => handleCancel(order.id)}
              className="ml-2 text-red-600"
            >
              Cancel
            </button>
          )}

          {order.payment?.status === 'pending' && (
            <button
              onClick={() => handlePay(order.id)}
              className="ml-2 text-green-600"
            >
              Pay Now
            </button>
          )}
        </div>
      ))}

      <div className="mt-4">
        {orders?.previous && currentPage > 1 && (
          <button
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-4 py-2 bg-gray-200 mr-2"
          >
            Previous Page
          </button>
        )}
        {orders?.next && (
          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-4 py-2 bg-gray-200"
          >
            Next Page
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
