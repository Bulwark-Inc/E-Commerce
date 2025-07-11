import React from 'react';
import { useNavigate } from 'react-router-dom';

const OrderCard = ({ order }) => {
  const navigate = useNavigate();

  return (
    <div className="p-4 border rounded-md shadow-sm">
      <h3 className="text-lg font-semibold">Order #{order.id}</h3>
      <p>Status: {order.status}</p>
      <p>Total: ₦{order.total_price}</p>
      <button
        onClick={() => navigate(`/order/${order.id}`)}
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
      >
        View Details
      </button>
    </div>
  );
};

export default OrderCard;
