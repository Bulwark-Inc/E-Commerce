import React from 'react';

const ProductListSkeleton = ({ count = 8 }) => {
  return (
    <div
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      role="status"
      aria-hidden="true"
    >
      {Array(count).fill(0).map((_, index) => (
        <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md animate-pulse">
          {/* Image Placeholder */}
          <div className="h-48 bg-gray-200"></div>
          <div className="p-4">
            {/* Title */}
            <div className="h-5 bg-gray-300 rounded w-2/3 mb-3"></div>
            {/* Price */}
            <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
            {/* Optional category tag */}
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductListSkeleton;
