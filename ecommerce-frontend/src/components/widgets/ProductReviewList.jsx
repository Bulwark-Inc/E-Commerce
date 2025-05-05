import StarRating from './StarRatingDisplay';

const ReviewList = ({ reviews, averageRating }) => (
  <div className="mb-6">
    <h2 className="text-xl font-bold mb-3">Customer Reviews</h2>

    {averageRating != null && (
    <div className="flex items-center mb-2">
        <span className="text-yellow-400 text-2xl mr-2">{averageRating.toFixed(1)}</span>
        <StarRating rating={Math.round(averageRating)} />
    </div>
    )}


    {reviews.length === 0 ? (
      <p className="text-gray-400">No reviews yet.</p>
    ) : (
      reviews.map((review) => (
        <div key={review.id} className="border-t border-gray-700 py-3">
          <p className="font-semibold text-blue-300">{review.username}</p>
          <StarRating rating={review.rating} className="mb-1" />
          <p className="text-gray-300">{review.comment}</p>
          <p className="text-xs text-gray-500">{new Date(review.created_at).toLocaleString()}</p>
        </div>
      ))
    )}
  </div>
);

export default ReviewList;
