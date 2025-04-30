import React from 'react';

const ProductDetailSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs placeholder */}
        <div className="flex items-center mb-6 animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-16"></div>
          <span className="mx-2">/</span>
          <div className="h-4 bg-gray-700 rounded w-20"></div>
          <span className="mx-2">/</span>
          <div className="h-4 bg-gray-700 rounded w-24"></div>
        </div>
        
        <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Image placeholder */}
            <div className="bg-gray-700 h-96 rounded-lg animate-pulse"></div>
            
            {/* Product info placeholders */}
            <div className="flex flex-col animate-pulse">
              {/* name */}
              <div className="h-8 bg-gray-700 rounded w-3/4 mb-4"></div>
              
              {/* Price */}
              <div className="h-10 bg-gray-700 rounded w-1/3 mb-6"></div>
              
              {/* Availability */}
              <div className="h-6 bg-gray-700 rounded w-1/4 mb-6"></div>
              
              {/* Tags */}
              <div className="flex gap-2 mb-6">
                <div className="h-8 bg-gray-700 rounded-full w-16"></div>
                <div className="h-8 bg-gray-700 rounded-full w-20"></div>
                <div className="h-8 bg-gray-700 rounded-full w-14"></div>
              </div>
              
              {/* Buttons */}
              <div className="flex gap-4 mb-8">
                <div className="h-12 bg-gray-700 rounded flex-1"></div>
                <div className="h-12 bg-gray-700 rounded w-20"></div>
              </div>
              
              {/* Description */}
              <div className="space-y-3">
                <div className="h-6 bg-gray-700 rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-700 rounded w-2/3"></div>
              </div>
            </div>
          </div>
          
          {/* Reviews section placeholder */}
          <div className="border-t border-gray-700 p-6">
            <div className="h-7 bg-gray-700 rounded w-1/4 mb-6"></div>
            
            {/* Form placeholders */}
            <div className="bg-gray-900 rounded-lg p-6 mb-8 animate-pulse">
              <div className="h-6 bg-gray-700 rounded w-1/5 mb-4"></div>
              
              <div className="mb-4">
                <div className="h-5 bg-gray-700 rounded w-16 mb-2"></div>
                <div className="flex gap-1">
                  {Array(5).fill(0).map((_, i) => (
                    <div key={i} className="h-6 w-6 bg-gray-700 rounded-full"></div>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <div className="h-5 bg-gray-700 rounded w-24 mb-2"></div>
                <div className="h-24 bg-gray-700 rounded w-full"></div>
              </div>
              
              <div className="h-10 bg-gray-700 rounded w-32"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailSkeleton;