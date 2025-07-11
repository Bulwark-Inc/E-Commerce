import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';

const CartItemCard = ({ item, updateItem, removeItem }) => {
  const { id, product, quantity, total_price, price_changed } = item;

  const handleQuantityChange = (newQty) => {
    if (newQty >= 1 && newQty <= 20) {
      updateItem(id, newQty);
    }
  };

  return (
    <div className="flex items-center gap-4 p-4 border rounded-2xl shadow-sm">
      <img src={product.image} alt={product.name} className="w-20 h-20 rounded-xl object-cover" />
      <div className="flex-1">
        <h2 className="font-semibold">{product.name}</h2>
        <p className="text-sm text-gray-500">₦{product.price}</p>
        {price_changed && (
          <p className="text-sm text-red-500">Price changed since added</p>
        )}
        <div className="flex items-center mt-2 space-x-3">
          <button
            onClick={() => handleQuantityChange(quantity - 1)}
            className="p-2 border rounded-xl disabled:opacity-50"
            disabled={quantity <= 1}
          >
            <Minus size={16} />
          </button>
          <span className="font-medium">{quantity}</span>
          <button
            onClick={() => handleQuantityChange(quantity + 1)}
            className="p-2 border rounded-xl disabled:opacity-50"
            disabled={quantity >= 20}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold">₦{total_price}</p>
        <button
          onClick={() => removeItem(id)}
          className="mt-2 text-red-500"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default CartItemCard;