import React, { useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import CartItemCard from '../../components/widgets/CartItemCard';
import CartSummary from '../../components/widgets/CartSummary';
import EmptyCart from '../../components/widgets/EmptyCart';
import { Loader2 } from 'lucide-react';

const CartPage = () => {
  const { cart, fetchCart, loading } = useCart();

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  if (!cart || cart.item_count === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
      <div className="md:col-span-2 space-y-4">
        {cart.items.map((item) => (
          <CartItemCard key={item.id} item={item} />
        ))}
      </div>
      <CartSummary />
    </div>
  );
};

export default CartPage;
