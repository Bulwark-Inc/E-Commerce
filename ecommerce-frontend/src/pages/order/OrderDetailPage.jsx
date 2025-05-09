import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOrders } from '../../context/OrderContext';

const OrderDetailPage = () => {
  const { id } = useParams();
  const { order, fetchOrder, loading, error } = useOrders();

  useEffect(() => {
    fetchOrder(id);
  }, [id]);

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6">Order Details</h2>

      {loading ? (
        <div>Loading order...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : !order ? (
        <div>Order not found.</div>
      ) : (
        <div className="space-y-6">
          <div className="border p-4 rounded">
            <h3 className="font-semibold mb-2">Order Info</h3>
            <p>Order ID: #{order.id}</p>
            <p>Placed: {new Date(order.created_at).toLocaleString()}</p>
            <p>Status: {order.status}</p>
            <p>Total: ₦{order.total}</p>
          </div>

          <div className="border p-4 rounded">
            <h3 className="font-semibold mb-2">Shipping Address</h3>
            <p>{order.shipping_address.full_name}</p>
            <p>{order.shipping_address.street}</p>
            <p>{order.shipping_address.city}</p>
          </div>

          <div className="border p-4 rounded">
            <h3 className="font-semibold mb-2">Items</h3>
            {order.items.map(item => (
              <div key={item.id} className="flex justify-between py-2 border-b">
                <span>{item.product_name} x {item.quantity}</span>
                <span>₦{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <Link to="/orders" className="text-blue-600 hover:underline">
            ← Back to orders
          </Link>
        </div>
      )}
    </div>
  );
};

export default OrderDetailPage;
