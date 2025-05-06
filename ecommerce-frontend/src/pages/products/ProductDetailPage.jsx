import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProduct } from '../../context/ProductContext';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';
import ReviewList from '../../components/widgets/ProductReviewList';
import ReviewForm from '../../components/forms/ProductReviewForm';
import StarRating from '../../components/widgets/StarRatingDisplay';

const ProductDetailPage = () => {
  const { slug } = useParams();
  const { product, fetchProduct, loading, error } = useProduct();
  const { isAuthenticated } = useAuth();
  const { addItem, loading: cartLoading } = useCart();

  useEffect(() => {
    if (slug) fetchProduct(slug);
  }, [slug]);

  if (loading) return <div className="text-center text-cyan-200">Loading product details...</div>;

  if (error)
    return (
      <div className="text-center text-red-400 p-6 border border-red-700 rounded">
        {error}
        <button
          onClick={() => fetchProduct(slug)}
          className="mt-3 bg-red-600 text-white px-4 py-1 rounded"
        >
          Retry
        </button>
      </div>
    );

  if (!product) return <div className="text-center text-gray-400">Product not found.</div>;

  // Primary product image or fallback
  const primaryImage = product.images.find(img => img.is_primary) || product.images[0];

  return (
    <div className="container mx-auto px-4 py-8 bg-[#0e1621] text-gray-200 rounded-lg shadow-lg">
      {/* Breadcrumb */}
      <div className="mb-3">
        <Link
          to={`/products?category=${product.category.slug}`}
          className="text-cyan-400 hover:underline text-sm"
        >
          {product.category.name}
        </Link>
      </div>

      {/* Product Image */}
      {primaryImage && (
        <div className="mb-6">
          <img
            src={primaryImage.image}
            alt={primaryImage.alt_text}
            className="w-full max-w-md rounded-lg shadow-md mx-auto"
          />
        </div>
      )}

      {/* Product Name */}
      <h1 className="text-3xl font-bold mb-4 text-white">{product.name}</h1>

      {/* Pricing */}
      <div className="mb-4">
        {product.discount_price ? (
          <div className="flex items-center gap-3">
            <span className="text-3xl text-teal-400 font-bold">${product.discount_price}</span>
            <span className="line-through text-red-400">${product.price}</span>
            <span className="text-sm text-red-500">-{product.discount_percentage}%</span>
          </div>
        ) : (
          <span className="text-3xl text-teal-400 font-bold">${product.price}</span>
        )}
      </div>

      {/* Stock */}
      <p className={`font-medium mb-2 ${product.available ? 'text-green-400' : 'text-red-400'}`}>
        {product.available ? `${product.stock} in stock` : 'Out of stock'}
      </p>

      {/* Rating */}
      {product.average_rating != null && (
        <div className="flex items-center mb-3">
          <span className="text-yellow-400 text-2xl mr-2">{product.average_rating.toFixed(1)}</span>
          <StarRating rating={Math.round(product.average_rating)} />
          <span className="text-sm text-gray-400 ml-2">({product.reviews.length} reviews)</span>
        </div>
      )}

      {/* Description */}
      <p className="text-gray-300 mb-6">{product.description}</p>

      {/* Metadata */}
      <p className="text-xs text-gray-500 mb-8">
        Added on {new Date(product.created_at).toLocaleDateString()}
      </p>

      {/* Add to Cart Button */}
      {product.available && (
        <button
          onClick={async () => {
            try {
              await addItem(product.id, 1);
              toast.success(`${product.name} added to cart!`);
            } catch (err) {
              toast.error('Could not add to cart.');
            }
          }}
          disabled={cartLoading}
          className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-5 py-2 rounded-lg shadow disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {cartLoading ? 'Adding...' : 'Add to Cart'}
        </button>
      )}

      {/* Reviews */}
      <ReviewList reviews={product.reviews} averageRating={product.average_rating} />

      {/* Review Form */}
      {isAuthenticated && (
        <ReviewForm
          productSlug={product.slug}
          onReviewSubmitted={() => fetchProduct(product.slug)}
        />
      )}
    </div>
  );
};

export default ProductDetailPage;
