import { useLocation, useNavigate } from 'react-router-dom';
import { useOrders } from '../../context/OrderContext';
import { useState } from 'react';

const ConfirmOrderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { createNewOrder, startPayment, loading } = useOrders();

  const {
    shippingAddressId,
    billingAddressId,
    shippingPrice,
    totalAmount,
    cartItems,
    cartTotal
  } = location.state || {};

  const [error, setError] = useState('');

  const handleConfirmOrder = async () => {
    try {
      const order = await createNewOrder({
        shipping_address_id: Number(shippingAddressId),
        billing_address_id: Number(billingAddressId),
        shipping_price: parseFloat(shippingPrice),
      });

      const payment = await startPayment(order.id);
      window.location.href = payment.payment_url;
    } catch (err) {
      console.error(err);
      setError('Failed to process order. Please try again.');
    }
  };

  if (!shippingAddressId || !billingAddressId || !cartItems) {
    return <div>Invalid order session. Please start checkout again.</div>;
  }

  return (
    <div className="container mx-auto py-8 text-gray-200">
      <h1 className="text-3xl font-bold mb-6">Confirm Order</h1>

      <div className="mb-6 p-4 bg-[#1a2530] rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        {cartItems.map((item) => (
          <div key={item.id} className="flex justify-between mb-2">
            <span>{item.product.name} x {item.quantity}</span>
            <span>${item.total_price}</span>
          </div>
        ))}
        <div className="flex justify-between mt-4">
          <span>Cart Total:</span>
          <span className="text-teal-400">${cartTotal}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping Fee:</span>
          <span className="text-teal-400">${shippingPrice}</span>
        </div>
        <div className="flex justify-between font-bold text-xl mt-2">
          <span>Total:</span>
          <span className="text-teal-500">${totalAmount.toFixed(2)}</span>
        </div>
      </div>

      <button
        onClick={handleConfirmOrder}
        disabled={loading}
        className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-lg font-semibold transition"
      >
        {loading ? 'Processing...' : 'Confirm & Pay'}
      </button>

      {error && <p className="text-red-500 mt-3">{error}</p>}
    </div>
  );
};

export default ConfirmOrderPage;
