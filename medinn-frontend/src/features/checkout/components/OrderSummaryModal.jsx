import React from 'react';
import { useNavigate } from 'react-router-dom';

const OrderSummaryModal = ({ order, onClose, onProceedToPayment }) => {
  const navigate = useNavigate();

  // Ensure total and shipping are numbers, defaulting to 0
  const total = Number(order?.total_price) || 0;
  const shipping = Number(order?.shipping_price) || 0;
  const grandTotal = (total + shipping).toFixed(2);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

        <div className="mb-4">
          <h3 className="font-medium">Shipping Address</h3>
          <p>{order.shipping_address?.street}</p>
          <p>{order.shipping_address?.city}, {order.shipping_address?.state}, {order.shipping_address?.country}</p>
        </div>

        <div className="mb-4">
          <h3 className="font-medium">Billing Address</h3>
          <p>{order.billing_address?.street}</p>
          <p>{order.billing_address?.city}, {order.billing_address?.state}, {order.billing_address?.country}</p>
        </div>

        <div className="mb-4">
          <h3 className="font-medium">Order Items</h3>
          <ul>
            {order.items.map(item => (
              <li key={item.id} className="flex justify-between">
                <span>{item.product_name} (x{item.quantity})</span>
                <span>${Number(item.total_price).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-4">
          <h3 className="font-medium">Total Price</h3>
          <p>${grandTotal}</p>
        </div>

        <div className="flex justify-between items-center">
          <button
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
            onClick={onProceedToPayment}
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryModal;
