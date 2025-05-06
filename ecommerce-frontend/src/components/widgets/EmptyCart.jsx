import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmptyCart = () => {
  return (
    <div className="text-center py-12 space-y-4">
      <ShoppingCart size={48} className="mx-auto text-gray-400" />
      <h2 className="text-xl font-semibold">Your cart is empty</h2>
      <Link
        to="/products"
        className="inline-block px-4 py-2 bg-blue-600 text-white rounded-xl"
      >
        Browse Products
      </Link>
    </div>
  );
};

export default EmptyCart;
