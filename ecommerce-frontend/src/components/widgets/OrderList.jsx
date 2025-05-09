import React from 'react';
import { Link } from 'react-router-dom';

const OrderList = ({ orders }) => {
  if (!orders.length)
    return (
      <div className="text-center text-gray-600">
        <p className="mb-2">No orders found.</p>
        <Link to="/" className="text-blue-600 hover:underline">
          Start Shopping
        </Link>
      </div>
    );

  return (
    <div className="grid gap-4">
      {orders.map(order => (
        <div key={order.id} className="border p-4 rounded-xl shadow">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Order #{order.id}</h3>
            <span className="text-sm text-gray-500">{order.status}</span>
          </div>
          <p>Total: ₦{order.total_price}</p>
          <p>Placed: {new Date(order.created_at).toLocaleDateString()}</p>
          <Link
            to={`/orders/${order.id}`}
            className="mt-2 inline-block text-blue-600 hover:underline text-sm"
          >
            View Details
          </Link>
        </div>
      ))}
    </div>
  );
};

export default OrderList;
