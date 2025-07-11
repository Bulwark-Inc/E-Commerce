import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const CartSummary = ({
  cart,
  applyCoupon,
  removeCoupon,
  clearCart,
  readOnly = false, // 🔹 New prop
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!cart) return null;

  const handleClearCart = async () => {
    setLoading(true);
    try {
      await clearCart();
    } catch (error) {
      console.error('Failed to clear cart:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-2xl shadow-sm space-y-3">
      <h2 className="text-lg font-semibold">Summary</h2>

      <div className="flex justify-between">
        <span>Total Items:</span>
        <span>{cart.item_count}</span>
      </div>

      <div className="flex justify-between">
        <span>Total Price:</span>
        <span>₦{cart.total_price}</span>
      </div>

      {!readOnly && (
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter coupon"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="flex-1 p-2 border rounded-xl"
          />
          <button
            onClick={() => applyCoupon(couponCode)}
            className="px-3 py-2 bg-blue-600 text-white rounded-xl"
          >
            Apply
          </button>
        </div>
      )}

      {cart.discount > 0 && (
        <div className="text-green-600 flex justify-between">
          <span>Discount:</span>
          <span>- ₦{cart.discount}</span>
        </div>
      )}

      {cart.coupon && (
        <div className="flex justify-between items-center">
          <span>Coupon: {cart.coupon.code}</span>
          {!readOnly && (
            <button onClick={removeCoupon} className="text-sm text-red-500">
              Remove
            </button>
          )}
        </div>
      )}

      {!readOnly && (
        <>
          <button
            onClick={() => navigate('/checkout')}
            className="w-full p-2 bg-blue-600 text-white rounded-xl"
          >
            Proceed to Checkout
          </button>

          <button
            onClick={handleClearCart}
            className="w-full p-2 text-center bg-red-600 text-white rounded-xl flex justify-center items-center"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Clear Cart'}
          </button>
        </>
      )}
    </div>
  );
};

export default CartSummary;
