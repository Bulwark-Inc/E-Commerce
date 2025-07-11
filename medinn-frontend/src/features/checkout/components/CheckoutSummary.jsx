import React from 'react';

const CheckoutSummary = ({ cart, shippingPrice = 0, onEditCart }) => {
  // Calculate subtotal using the discount price if available, otherwise use regular price
  const subtotal = cart?.items?.reduce((total, item) => {
    const price = parseFloat(item.product.discount_price || item.product.price);
    return total + price * item.quantity;
  }, 0) || 0;

  const total = subtotal + shippingPrice;

  return (
    <section className="border border-gray-200 dark:border-gray-700 rounded p-4 bg-white dark:bg-gray-800">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
        Order Summary
      </h3>

      <div className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
        <div className="flex justify-between">
          <span>Items:</span>
          <span>{cart?.item_count || 0}</span>
        </div>
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>₦{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping:</span>
          <span>₦{shippingPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
        <hr className="my-2 border-gray-300 dark:border-gray-600" />
        <div className="flex justify-between font-semibold text-gray-900 dark:text-white">
          <span>Total:</span>
          <span>₦{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
      </div>

      {onEditCart && (
        <div className="mt-4 text-right">
          <button
            onClick={onEditCart}
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            Edit Cart
          </button>
        </div>
      )}
    </section>
  );
};

export default CheckoutSummary;
