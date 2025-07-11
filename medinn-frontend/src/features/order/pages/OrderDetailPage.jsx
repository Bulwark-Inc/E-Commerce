import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOrder } from '../../order/context/OrderContext';

const OrderDetailPage = () => {
  const params = useParams();
  const orderId = params.orderId || params.id; // adapt to your route

  const {
    orderDetails,
    loading,
    error,
    fetchOrderDetail,
    handleInitializePayment,
  } = useOrder();

  useEffect(() => {
    if (orderId) {
      fetchOrderDetail(orderId);
    }
  }, [orderId, fetchOrderDetail]);

  const handlePay = async () => {
    if (orderDetails?.status !== 'pending') return;

    try {
      const paymentInfo = await handleInitializePayment(orderId);
      if (paymentInfo?.payment_url) {
        window.location.href = paymentInfo.payment_url;
      } else {
        console.error('No payment URL received');
      }
    } catch (err) {
      console.error('Payment init failed', err);
    }
  };

  return (
    <div className="p-6">
      <Link to="/orders" className="text-blue-600 underline">
        ← Back to History
      </Link>
      <h1 className="text-2xl font-bold mb-4">Order #{orderId}</h1>

      {loading && <p>Loading order details...</p>}

      {error && (
        <p className="text-red-600">
          Error:{' '}
          {typeof error === 'string'
            ? error
            : error.detail || JSON.stringify(error)}
        </p>
      )}

      {!loading && orderDetails && (
        <div className="bg-gray-50 p-4 rounded shadow">
          <p>
            <strong>Status:</strong> {orderDetails.status_display}
          </p>
          <p>
            <strong>Total:</strong> ₦{orderDetails.total_price}
          </p>

          <h2 className="mt-4 font-semibold">Items:</h2>
          {Array.isArray(orderDetails.items) && orderDetails.items.length > 0 ? (
            <ul className="list-disc pl-5">
              {orderDetails.items.map((item) => (
                <li key={item.id}>
                  {item.product_name} × {item.quantity} — ₦{item.price}
                </li>
              ))}
            </ul>
          ) : (
            <p>No items found in this order.</p>
          )}

          {orderDetails.payment?.status === 'pending' && (
            <button
              onClick={handlePay}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
            >
              Pay Now
            </button>
          )}

          {orderDetails.shipping_address && (
            <div className="mt-4">
              <h3 className="font-semibold">Shipping to:</h3>
              <p>{orderDetails.shipping_address.full_name}</p>
              <p>{orderDetails.shipping_address.address_line1}</p>
              {orderDetails.shipping_address.address_line2 && (
                <p>{orderDetails.shipping_address.address_line2}</p>
              )}
              <p>
                {orderDetails.shipping_address.city},{' '}
                {orderDetails.shipping_address.state}
              </p>
              <p>
                {orderDetails.shipping_address.postal_code},{' '}
                {orderDetails.shipping_address.country}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderDetailPage;
