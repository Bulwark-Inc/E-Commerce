import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const ProductCard = ({ product }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { url: image, alt_text } = product.primary_image || {};

  return (
    <>
      <div className="bg-white rounded-lg shadow hover:shadow-lg hover:scale-[1.03] transition transform duration-300 overflow-hidden">
        <div onClick={() => setIsOpen(true)} className="cursor-pointer">
          <img
            src={image || '/placeholder.jpg'}
            alt={alt_text || product.name}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
            <p className="text-gray-800 font-medium text-md">
              ${product.discount_price || product.price}
            </p>
            {product.discount_percentage && (
              <span className="inline-block mt-1 text-sm text-red-600 font-medium">
                -{product.discount_percentage}%
              </span>
            )}
          </div>
        </div>
      </div>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white max-w-md w-full rounded-lg overflow-hidden shadow-lg">
            <div className="flex justify-between items-center p-4 border-b">
              <Dialog.Title className="text-lg font-medium">{product.name}</Dialog.Title>
              <button onClick={() => setIsOpen(false)}>
                <XMarkIcon className="h-6 w-6 text-gray-600 hover:text-gray-900" />
              </button>
            </div>
            <img
              src={image || '/placeholder.jpg'}
              alt={alt_text || product.name}
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <p className="text-gray-800 text-lg mb-2">
                ${product.discount_price || product.price}
              </p>
              <p className="text-gray-600 text-sm">Product preview details could go here.</p>
              <Link
                to={`/products/${product.slug}`}
                className="block mt-4 text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              >
                View Full Details
              </Link>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

export default ProductCard;
