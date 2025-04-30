import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProduct } from '../../context/ProductContext';
import { useAuth } from '../../context/AuthContext';
import ProductDetailSkeleton from '../../components/skeletons/ProductDetailSkeleton';
import { FaArrowLeft, FaStar, FaRegStar, FaShoppingCart, FaHeart } from 'react-icons/fa';
import ImageGallery from 'react-image-gallery';

const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const {
    product,
    loading,
    error,
    fetchProduct,
  } = useProduct();

  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProduct(slug);
    window.scrollTo(0, 0);
  }, [slug]);

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewData(prev => ({ ...prev, [name]: value }));
  };

  const formatPrice = (price) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);

  const getGalleryImages = () => {
    if (!product) return [];
    const images = [];

    if (product.thumbnail) {
      images.push({
        original: product.thumbnail,
        thumbnail: product.thumbnail,
      });
    }

    if (product.images && product.images.length > 0) {
      product.images.forEach(img => {
        images.push({
          original: img.image,
          description: img.alt_text || product.title,
        });
      });
    }

    if (images.length === 0) {
      images.push({
        original: '/placeholder-product.jpg',
        thumbnail: '/placeholder-product.jpg',
      });
    }

    return images;
  };

  const goBack = () => navigate(-1);

  const StarRating = ({ rating, setRating }) => (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          className="focus:outline-none"
        >
          {star <= rating ? <FaStar className="text-yellow-400 w-6 h-6" /> : <FaRegStar className="text-yellow-400 w-6 h-6" />}
        </button>
      ))}
    </div>
  );

  if (loading) return <ProductDetailSkeleton />;

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-900 text-white p-4 rounded mb-6">{error}</div>
        <button onClick={goBack} className="flex items-center text-blue-400 hover:text-blue-300">
          <FaArrowLeft className="mr-2" /> Go Back
        </button>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center mb-6 text-sm text-gray-400">
          <Link to="/" className="hover:text-blue-400">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:text-blue-400">Products</Link>
          {product.category && (
            <>
              <span className="mx-2">/</span>
              <Link to={`/products?category=${product.category?.slug}`} className="hover:text-blue-400">
                {product.category?.name}
              </Link>
            </>
          )}
          <span className="mx-2">/</span>
          <span className="text-gray-300">{product.title}</span>
        </div>

        {/* Main Card */}
        <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <ImageGallery
                items={getGalleryImages()}
                showPlayButton={false}
                showFullscreenButton={true}
                showNav={true}
                thumbnailPosition="bottom"
                useBrowserFullscreen={true}
              />
            </div>

            <div className="flex flex-col">
              <h1 className="text-3xl font-bold mb-2">{product.title}</h1>

              <div className="mb-4 flex items-center">
                <span className="text-3xl font-bold text-blue-400 mr-3">{formatPrice(product.price)}</span>
                {product.old_price && (
                  <span className="text-lg text-gray-500 line-through">{formatPrice(product.old_price)}</span>
                )}
              </div>

              <div className="mb-6">
                {product.is_available ? (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-900 text-green-400">
                    In Stock ({product.quantity})
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-900 text-red-400">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap gap-4 mb-8">
                <button
                  className={`flex-1 flex items-center justify-center px-6 py-3 rounded-md transition-colors ${
                    product.is_available
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-600 cursor-not-allowed text-gray-300'
                  }`}
                  disabled={!product.is_available}
                >
                  <FaShoppingCart className="mr-2" />
                  Add to Cart
                </button>
                <button className="px-4 py-3 rounded-md bg-gray-700 hover:bg-gray-600 text-white flex items-center">
                  <FaHeart className="mr-2" /> Save
                </button>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-bold mb-3">Description</h2>
                <div
                  className="prose prose-sm prose-invert max-w-none text-gray-300"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
