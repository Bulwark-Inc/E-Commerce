import React from 'react';

const OrderDetail = ({ order }) => {
  if (!order) return <p>Loading order...</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Order #{order.id}</h2>
      <p>Status: {order.status}</p>
      <p>Total: ₦{order.total_price}</p>
      <p>Shipping: ₦{order.shipping_price}</p>

      <h3 className="font-semibold mt-4">Items:</h3>
      <ul>
        {order.items.map(item => (
          <li key={item.id}>
            {item.product.name} x {item.quantity} — ₦{item.price}
          </li>
        ))}
      </ul>

      <div className="mt-4">
        <h3 className="font-semibold">Shipping Address:</h3>
        <p>{order.shipping_address.full_address}</p>

        <h3 className="font-semibold mt-2">Billing Address:</h3>
        <p>{order.billing_address.full_address}</p>
      </div>
    </div>
  );
};

export default OrderDetail;
