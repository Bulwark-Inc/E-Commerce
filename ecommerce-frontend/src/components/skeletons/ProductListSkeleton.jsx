import React from 'react';

const ProductListSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(count).fill(0).map((_, index) => (
        <div key={index} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg animate-pulse">
          {/* Image placeholder */}
          <div className="h-48 bg-gray-700"></div>
          
          <div className="p-4">
            {/* Title placeholder */}
            <div className="h-6 bg-gray-700 rounded w-2/3 mb-4"></div> {/* Title */}

            {/* Price placeholder */}
            <div className="h-8 bg-gray-700 rounded w-1/4 mb-3"></div> {/* Price */}
            
            {/* Category placeholder */}
            <div className="h-4 bg-gray-700 rounded w-1/5"></div> {/* Category */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductListSkeleton;