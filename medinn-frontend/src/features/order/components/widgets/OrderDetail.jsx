import React, { useEffect } from 'react';
import { useOrder } from '../../context/OrderContext';

const OrderDetail = ({ orderId }) => {
  const { orderDetails, loading, fetchOrderDetail } = useOrder();

  useEffect(() => {
    fetchOrderDetail(orderId);
  }, [fetchOrderDetail, orderId]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Order #{orderDetails.id}</h1>
      <p>Status: {orderDetails.status}</p>
      <h3>Items:</h3>
      <ul>
        {orderDetails.items.map((item) => (
          <li key={item.id}>
            {item.name} x{item.quantity} - ₦{item.price}
          </li>
        ))}
      </ul>
      <p>Total Price: ₦{orderDetails.total_price}</p>
    </div>
  );
};

export default OrderDetail;
