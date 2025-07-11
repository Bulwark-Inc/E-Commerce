import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProduct } from '../context/ProductContext';
import { useAuth } from '../../auth/context/AuthContext';
import { useCart } from '../../cart/context/CartContext';
import toast from 'react-hot-toast';

import CommentList from '../../../shared/components/engagement/CommentList';
import CommentForm from '../../../shared/components/engagement/CommentForm';
import ReviewList from '../../../shared/components/engagement/ReviewList';
import ReviewForm from '../../../shared/components/engagement/ReviewForm';
import StarRating from '../../../shared/components/engagement/StarRating';

import { EngagementProvider } from '../../../shared/context/EngagementContext';
import { useEngagementContext } from '../../../shared/context/useEngagementContext';

const EngagementSection = ({ product }) => {
  const { isAuthenticated } = useAuth();
  const {
    comments,
    reviews,
    averageRating,
    loading,
    addComment,
    addReview,
    rate,
  } = useEngagementContext();

  const displayRating = averageRating ?? product.average_rating;

  return (
    <>
      Comments
      <CommentList comments={comments} loading={loading.comments} />
      {isAuthenticated && (
        <CommentForm onSubmit={addComment} loading={loading.comments} />
      )}

      {/* Reviews */}
      <ReviewList reviews={reviews} averageRating={displayRating} loading={loading.reviews} />
      {isAuthenticated && (
        <ReviewForm onSubmit={addReview} loading={loading.reviews} />
      )}

      {/* Rating */}
      <div>
        <span>Rate this product:</span>
        <StarRating
          rating={Math.round(displayRating)}
          setRating={rate}
          disabled={loading.rating}
        />
      </div>
    </>
  );
};

const ProductDetailPage = () => {
  const { slug } = useParams();
  const { product, fetchProduct, loading, error } = useProduct();
  const { addItem, loading: cartLoading } = useCart();

  useEffect(() => {
    if (slug) fetchProduct(slug);
  }, [slug]);

  if (loading) return <div>Loading product details...</div>;
  if (error)
    return (
      <div>
        {error}
        <button onClick={() => fetchProduct(slug)}>Retry</button>
      </div>
    );
  if (!product) return <div>Product not found.</div>;

  const primaryImage = Array.isArray(product.images)
    ? product.images.find((img) => img.is_primary) || product.images[0]
    : null;

  return (
    <div className="container mx-auto p-8 bg-[#0e1621] text-gray-200 rounded-lg shadow-lg">
      <Link to={`/products?category=${product.category.slug}`}>
        {product.category.name}
      </Link>

      {primaryImage && (
        <img src={primaryImage.image} alt={primaryImage.alt_text} />
      )}

      <h1>{product.name}</h1>

      <div>
        {product.discount_price ? (
          <>
            <span>${product.discount_price}</span>
            <span className="line-through">${product.price}</span>
            <span>-{product.discount_percentage}%</span>
          </>
        ) : (
          <span>${product.price}</span>
        )}
      </div>

      <p className={product.available ? 'text-green-400' : 'text-red-400'}>
        {product.available ? `${product.stock} in stock` : 'Out of stock'}
      </p>

      <div>
        <span>{product.average_rating?.toFixed(1)}</span>
        <StarRating rating={Math.round(product.average_rating)} disabled />
        <span>({Array.isArray(product.reviews) ? product.reviews.length : 0} reviews)</span>
      </div>

      <p>{product.description}</p>
      <p>Added on {new Date(product.created_at).toLocaleDateString()}</p>

      {product.available && (
        <button
          onClick={async () => {
            try {
              await addItem(product.id, 1);
              toast.success(`${product.name} added to cart!`);
            } catch {
              toast.error('Could not add to cart.');
            }
          }}
          disabled={cartLoading}
        >
          {cartLoading ? 'Adding...' : 'Add to Cart'}
        </button>
      )}

      {/* 🧠 Engagement Section via Provider */}
      <EngagementProvider type="products" slug={product.slug}>
        <EngagementSection product={product} />
      </EngagementProvider>
    </div>
  );
};

export default ProductDetailPage;
