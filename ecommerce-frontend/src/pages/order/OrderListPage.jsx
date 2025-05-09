import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useOrders } from '../../context/OrderContext';

const OrdersPage = () => {
  const { orders, fetchOrders, loading, error } = useOrders();

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>

      {loading ? (
        <div>Loading orders...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : orders.length === 0 ? (
        <div>No orders found.</div>
      ) : (
        <div className="space-y-4">
          {orders.results.map(order => (
            <Link
              key={order.id}
              to={`/order/${order.id}`}
              className="block border rounded p-4 hover:shadow"
            >
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">Order #{order.id}</p>
                  <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₦{order.total}</p>
                  <p className={`text-sm ${order.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {order.status}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
