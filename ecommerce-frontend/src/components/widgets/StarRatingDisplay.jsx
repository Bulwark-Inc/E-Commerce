import { useState } from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';

const StarRating = ({ rating, setRating, outOf = 5, className = '', disabled = false }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {Array.from({ length: outOf }, (_, i) => {
        const filled = i < (hoverRating || rating);

        return (
          <button
            key={i}
            type="button"
            onClick={() => !disabled && setRating && setRating(i + 1)}
            onMouseEnter={() => !disabled && setHoverRating(i + 1)}
            onMouseLeave={() => !disabled && setHoverRating(0)}
            disabled={disabled}
            className={`transition transform ${
              disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:scale-125'
            }`}
          >
            {filled ? (
              <FaStar
                className="text-yellow-400"
                style={{ filter: 'drop-shadow(0 0 5px rgba(253, 224, 71, 0.8))' }}
              />
            ) : (
              <FaRegStar className="text-gray-500" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
