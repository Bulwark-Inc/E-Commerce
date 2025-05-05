import { useState } from 'react';
import { useProduct } from '../../context/ProductContext';
import StarRating from '../widgets/StarRatingDisplay';
import toast from 'react-hot-toast';

const ProductReviewForm = ({ productSlug, onReviewSubmitted }) => {
  const { addProductReview } = useProduct();
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReviewData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!reviewData.comment.trim()) {
      toast.error('Please write a comment before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      await addProductReview(productSlug, {
        ...reviewData,
        rating: Number(reviewData.rating),
      });
      onReviewSubmitted();
      setReviewData({ rating: 5, comment: '' });
      toast.success('Review submitted successfully!');
    } catch (err) {
      console.error('Failed to submit review', err.response?.data || err);
      toast.error('Failed to submit review. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-3">Leave a Review</h2>

      <StarRating
        rating={reviewData.rating}
        setRating={(rating) => setReviewData((prev) => ({ ...prev, rating }))}
        disabled={isSubmitting}
      />

      <textarea
        name="comment"
        value={reviewData.comment}
        onChange={handleChange}
        placeholder="Write your review..."
        className="w-full mt-3 p-3 border border-gray-600 rounded bg-gray-800 text-gray-200"
        rows="3"
      ></textarea>

      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="mt-3 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </div>
  );
};

export default ProductReviewForm;