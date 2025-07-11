import React from 'react';
import { useCart } from '../context/CartContext';
import CartItemCard from '../components/widgets/CartItemCard';
import CartSummary from '../components/widgets/CartSummary';
import EmptyCart from '../components/widgets/EmptyCart';
import { Loader2 } from 'lucide-react';

const CartPage = () => {
  const {
    cart,
    updateItem,
    removeItem,
    clear,
    applyCartCoupon,
    removeCartCoupon,
    loading,
    error,
  } = useCart();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-600">
        <p>Error fetching cart: {error}</p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
      <div className="md:col-span-2 space-y-4">
        {cart.items.map((item) => (
          <CartItemCard
            key={item.id}
            item={item}
            updateItem={updateItem}
            removeItem={removeItem}
          />
        ))}
      </div>
      <CartSummary
        cart={cart}
        applyCoupon={applyCartCoupon}
        removeCoupon={removeCartCoupon}
        clearCart={clear}
      />
    </div>
  );
};

export default CartPage;
