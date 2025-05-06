import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { Loader2 } from 'lucide-react';

const CartSummary = () => {
  const { cart, loading, applyCartCoupon, removeCartCoupon, clear } = useCart();
  const [couponCode, setCouponCode] = useState('');

  if (!cart) return null;

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

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter coupon"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          className="flex-1 p-2 border rounded-xl"
        />
        <button
          onClick={() => applyCartCoupon(couponCode)}
          className="px-3 py-2 bg-blue-600 text-white rounded-xl"
        >
          Apply
        </button>
      </div>

      {cart.discount && (
        <div className="text-green-600 flex justify-between">
          <span>Discount:</span>
          <span>- ₦{cart.discount}</span>
        </div>
      )}

      {cart.coupon && (
        <div className="flex justify-between items-center">
          <span>Coupon: {cart.coupon.code}</span>
          <button onClick={removeCartCoupon} className="text-sm text-red-500">Remove</button>
        </div>
      )}

      <button
        onClick={clear}
        className="w-full p-2 text-center bg-red-600 text-white rounded-xl"
      >
        {loading ? <Loader2 className="animate-spin" /> : 'Clear Cart'}
      </button>
    </div>
  );
};

export default CartSummary;
