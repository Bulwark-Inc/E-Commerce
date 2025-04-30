import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
      <Link to={`/products/${product.slug}`}>
        <img
          src={product.primary_image?.url || '/placeholder.jpg'}
          alt={product.primary_image?.alt_text || product.name}
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
      </Link>
    </div>
  );
};

export default ProductCard;
