import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useUser } from '../../context/UserContext';
import countries from '../../constants/countries';

const CheckoutPage = () => {
  const { cart, loading: cartLoading } = useCart();
  const { addresses, fetchUserAddresses } = useUser();
  const navigate = useNavigate();

  const [shippingAddressId, setShippingAddressId] = useState('');
  const [billingAddressId, setBillingAddressId] = useState('');
  const [shippingPrice, setShippingPrice] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isShippingDropdownVisible, setIsShippingDropdownVisible] = useState(false);
  const [isBillingDropdownVisible, setIsBillingDropdownVisible] = useState(false);

  useEffect(() => {
    fetchUserAddresses();
  }, []);

  const defaultShippingAddress = addresses.find((addr) => addr.default && addr.address_type === 'shipping');
  const defaultBillingAddress = addresses.find((addr) => addr.default && addr.address_type === 'billing');

  useEffect(() => {
    if (defaultShippingAddress) {
      setShippingAddressId(defaultShippingAddress.id);
      calculateShippingFee(defaultShippingAddress.id);
    }
    if (defaultBillingAddress) {
      setBillingAddressId(defaultBillingAddress.id);
    }
  }, [addresses]);

  useEffect(() => {
    if (cart) {
      setTotalAmount(parseFloat(cart.total_price) + parseFloat(shippingPrice));
    }
  }, [cart, shippingPrice]);

  const calculateShippingFee = (addressId) => {
    const selectedAddress = addresses.find(addr => addr.id === Number(addressId));
    if (!selectedAddress) return;
    const countryEntry = countries.find(c => c.name === selectedAddress.country);
    const fee = countryEntry ? countryEntry.shipping_fee : 50;
    setShippingPrice(fee);
  };

  const handleProceedToConfirm = () => {
    if (!shippingAddressId || !billingAddressId) {
      alert('Please select both shipping and billing addresses.');
      return;
    }

    navigate('/confirm-order', {
      state: {
        shippingAddressId,
        billingAddressId,
        shippingPrice,
        totalAmount,
        cartItems: cart.items,
        cartTotal: cart.total_price
      }
    });
  };

  if (cartLoading) return <div>Loading cart...</div>;
  if (!cart) return <div>Your cart is empty.</div>;

  return (
    <div className="container mx-auto py-8 text-gray-200">
      <h1 className="text-3xl font-bold mb-6 text-white">Checkout</h1>

      <div className="mb-6 p-4 bg-[#1a2530] rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        {cart.items.map((item) => (
          <div key={item.id} className="flex justify-between mb-2">
            <span>{item.product.name} x {item.quantity}</span>
            <span>${item.total_price}</span>
          </div>
        ))}
        <div className="flex justify-between mt-4 border-t border-gray-600 pt-2">
          <span className="font-semibold">Cart Total:</span>
          <span className="text-teal-400 font-bold">${cart.total_price}</span>
        </div>
      </div>

      <div className="mb-6 p-4 bg-[#1a2530] rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Shipping & Billing</h2>

        {/* Shipping Address */}
        {defaultShippingAddress ? (
          <div className="mb-4">
            <p className="font-semibold">Shipping Address:</p>
            <p>{defaultShippingAddress.city}, {defaultShippingAddress.state}</p>
            <button
              onClick={() => setIsShippingDropdownVisible(!isShippingDropdownVisible)}
              className="text-teal-500 mt-2"
            >
              Select another address
            </button>
            {isShippingDropdownVisible && (
              <select
                value={shippingAddressId}
                onChange={(e) => {
                  setShippingAddressId(e.target.value);
                  calculateShippingFee(e.target.value);
                }}
                className="w-full mb-4 p-2 rounded bg-[#0e1621] border border-gray-600 text-gray-300"
              >
                <option value="">Select shipping address</option>
                {addresses.map((addr) => (
                  <option key={addr.id} value={addr.id}>{addr.city}, {addr.state}</option>
                ))}
              </select>
            )}
          </div>
        ) : (
          <div className="mb-4">
            <p>Please add a shipping address. <button onClick={() => navigate('/addresses')} className="text-teal-500">Go to Address Page</button></p>
          </div>
        )}

        {/* Billing Address */}
        {defaultBillingAddress ? (
          <div className="mb-4">
            <p className="font-semibold">Billing Address:</p>
            <p>{defaultBillingAddress.city}, {defaultBillingAddress.state}</p>
            <button
              onClick={() => setIsBillingDropdownVisible(!isBillingDropdownVisible)}
              className="text-teal-500 mt-2"
            >
              Select another address
            </button>
            {isBillingDropdownVisible && (
              <select
                value={billingAddressId}
                onChange={(e) => setBillingAddressId(e.target.value)}
                className="w-full mb-4 p-2 rounded bg-[#0e1621] border border-gray-600 text-gray-300"
              >
                <option value="">Select billing address</option>
                {addresses.map((addr) => (
                  <option key={addr.id} value={addr.id}>{addr.city}, {addr.state}</option>
                ))}
              </select>
            )}
          </div>
        ) : (
          <div className="mb-4">
            <p>Please add a billing address. <button onClick={() => navigate('/addresses')} className="text-teal-500">Go to Address Page</button></p>
          </div>
        )}

        {/* Shipping Fee */}
        <div className="flex justify-between mb-2">
          <span className="font-semibold">Shipping Fee:</span>
          <span className="text-teal-400">${shippingPrice}</span>
        </div>

        {/* Total Amount */}
        <div className="flex justify-between mb-4">
          <span className="font-semibold">Total:</span>
          <span className="text-teal-400 font-bold">${totalAmount.toFixed(2)}</span>
        </div>

        {/* Confirm to checkout Button */}
        <button
          onClick={handleProceedToConfirm}
          className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-lg font-semibold transition"
        >
          Proceed to Confirm
        </button>

      </div>
    </div>
  );
};

export default CheckoutPage;
