import StarRating from './StarRating';

const ReviewList = ({ reviews, averageRating, loading }) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-3">Customer Reviews</h2>

      {loading && <p className="text-sm text-gray-400">Loading reviews...</p>}

      {!loading && averageRating != null && (
        <div className="flex items-center mb-2">
          <span className="text-yellow-400 text-2xl mr-2">{averageRating.toFixed(1)}</span>
          <StarRating rating={Math.round(averageRating)} disabled />
        </div>
      )}

      {!loading && (!reviews.length ? (
        <p className="text-gray-500">No reviews yet.</p>
      ) : (
        reviews.map((r) => (
          <div key={r.id} className="border-t py-3">
            <p className="font-semibold">{r.username}</p>
            <StarRating rating={r.rating} disabled />
            <p>{r.comment}</p>
            <p className="text-xs text-gray-400">{new Date(r.created_at).toLocaleString()}</p>
          </div>
        ))
      ))}
    </div>
  );
};

export default ReviewList;