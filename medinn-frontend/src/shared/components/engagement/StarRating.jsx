import { useState } from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';

const StarRating = ({ rating, setRating, disabled = false, outOf = 5 }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {Array.from({ length: outOf }).map((_, i) => {
        const filled = i < (hover || rating);
        return (
          <button
            key={i}
            type="button"
            disabled={disabled}
            onClick={() => setRating && !disabled && setRating(i + 1)}
            onMouseEnter={() => !disabled && setHover(i + 1)}
            onMouseLeave={() => !disabled && setHover(0)}
            className={`transition ${
              disabled ? 'opacity-60 cursor-not-allowed' : 'hover:scale-125'
            }`}
          >
            {filled ? (
              <FaStar className="text-yellow-400" />
            ) : (
              <FaRegStar className="text-gray-400" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
