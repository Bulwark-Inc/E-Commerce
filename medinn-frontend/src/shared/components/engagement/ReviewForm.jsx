import { useState } from 'react';
import StarRating from './StarRating';

const ReviewForm = ({ onSubmit, loading = false }) => {
  const [data, setData] = useState({ rating: 5, comment: '' });

  const handleSubmit = () => {
    if (!data.comment.trim()) return;
    onSubmit({ ...data, rating: Number(data.rating) });
    setData({ rating: 5, comment: '' });
  };

  return (
    <div className="mb-6">
      <StarRating
        rating={data.rating}
        setRating={(r) => setData((prev) => ({ ...prev, rating: r }))}
        disabled={loading}
      />
      <textarea
        value={data.comment}
        onChange={(e) => setData((prev) => ({ ...prev, comment: e.target.value }))}
        placeholder="Write your review..."
        className="w-full p-3 border border-gray-300 rounded mt-3 text-black"
        rows={3}
        disabled={loading}
      />
      <button
        onClick={handleSubmit}
        disabled={loading || !data.comment.trim()}
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </div>
  );
};

export default ReviewForm;