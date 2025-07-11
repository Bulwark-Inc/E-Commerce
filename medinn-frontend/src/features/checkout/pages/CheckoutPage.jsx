import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../users/context/UserContext';
import { useCart } from '../../cart/context/CartContext';
import { useCheckout } from '../context/CheckoutContext';
import { useOrder } from '../../order/context/OrderContext';
import ShippingForm from '../components/ShippingForm';
import BillingSelector from '../components/BillingSelector';
import DeliveryOptions from '../components/DeliveryOptions';
import CheckoutSummary from '../components/CheckoutSummary';
import NavSidebar from '../components/NavSidebar';
import OrderSummaryModal from '../components/OrderSummaryModal';

const CheckoutPage = () => {
  const { cart } = useCart();
  const { addresses, userLoading } = useUser();
  const { createNewOrder } = useCheckout();
  const orderContext = useOrder();
  const navigate = useNavigate();

  const [shippingId, setShippingId] = useState(null);
  const [billingId, setBillingId] = useState(null);
  const [shippingPrice, setShippingPrice] = useState(0);

  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  // ❗ Handle missing context
  if (!orderContext) {
    return <div>Error loading order data. Please try again later.</div>;
  }

  const { handleInitializePayment } = orderContext;

  const shippingAddresses = addresses.filter((a) => a.address_type === 'shipping');
  const billingAddresses = addresses.filter((a) => a.address_type === 'billing');

  useEffect(() => {
    if (userLoading) return;

    if (shippingAddresses.length === 0) {
      alert('You need to add a shipping address before checkout.');
      navigate('/addresses');
      return;
    }

    if (!shippingId && shippingAddresses.length > 0) {
      const defaultShipping = shippingAddresses.find((a) => a.default) || shippingAddresses[0];
      setShippingId(defaultShipping.id);
    }

    if (!billingId && billingAddresses.length > 0) {
      const defaultBilling = billingAddresses.find((a) => a.default) || billingAddresses[0];
      setBillingId(defaultBilling.id);
    }
  }, [addresses, userLoading, shippingId, billingId, navigate]);

  const handleSubmit = async () => {
    if (!shippingId || !billingId) {
      alert('Please select both shipping and billing addresses.');
      return;
    }

    const payload = {
      shipping_address_id: shippingId,
      billing_address_id: billingId,
      shipping_price: shippingPrice.toFixed(2),
    };

    try {
      const order = await createNewOrder(payload);
      setCreatedOrder(order);
      setShowSummaryModal(true);
    } catch (error) {
      alert('Failed to create order.');
      console.error(error);
    }
  };

  const handleProceedToPayment = async () => {
    if (createdOrder?.id) {
      try {
        const payment = await handleInitializePayment(createdOrder.id);
        if (payment?.payment_url) {
          window.location.href = payment.payment_url;
        } else {
          alert("Payment URL not received. Please try again.");
        }
      } catch (err) {
        console.error(err);
        alert('Failed to process payment. Please try again.');
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 bg-white dark:bg-gray-900 min-h-screen">
      <aside className="w-full md:w-1/3 space-y-4">
        <NavSidebar />
        <CheckoutSummary
          cart={cart}
          shippingPrice={shippingPrice}
          onEditCart={() => navigate('/cart')}
        />
      </aside>

      <main className="w-full md:w-2/3 space-y-6">
        <ShippingForm addresses={shippingAddresses} selectedId={shippingId} onSelect={setShippingId} />
        <BillingSelector addresses={billingAddresses} selectedId={billingId} onSelect={setBillingId} shippingId={shippingId} />
        <DeliveryOptions onChange={(option) => setShippingPrice(option.price)} />
        <div className="text-right">
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
            onClick={handleSubmit}
            disabled={!shippingId || !billingId}
          >
            Place Order
          </button>
        </div>
      </main>

      {showSummaryModal && createdOrder && (
        <OrderSummaryModal
          order={createdOrder}
          onClose={() => setShowSummaryModal(false)}
          onProceedToPayment={handleProceedToPayment}
        />
      )}
    </div>
  );
};

export default CheckoutPage;
