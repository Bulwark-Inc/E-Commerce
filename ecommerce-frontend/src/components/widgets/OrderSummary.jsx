import React from 'react';

const OrderSummary = ({ orderData, onPlaceOrder }) => {
  return (
    <div className="border p-4 rounded-xl shadow space-y-2">
      <h3 className="font-bold text-lg">Order Summary</h3>
      <p>Shipping Address: {orderData.shipping_address}</p>
      <p>Billing Address: {orderData.billing_address}</p>
      <p>Shipping Fee: ₦{orderData.shipping_price}</p>
      <p className="font-semibold">Total: ₦{orderData.total_price}</p>

      <button
        onClick={onPlaceOrder}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full mt-2"
      >
        Place Order
      </button>
    </div>
  );
};

export default OrderSummary;
