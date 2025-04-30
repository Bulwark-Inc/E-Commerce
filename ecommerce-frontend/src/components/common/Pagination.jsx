import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const delta = 2; // Pages to show before and after current page
    
    // Always start with page 1
    if (currentPage > 1 + delta) {
      pages.push(1);
      if (currentPage > 2 + delta) {
        pages.push('...');
      }
    }
    
    // Calculate start and end page numbers
    const start = Math.max(1, currentPage - delta);
    const end = Math.min(totalPages, currentPage + delta);
    
    // Add range of pages
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    // Add ellipsis and last page if needed
    if (currentPage < totalPages - delta) {
      if (currentPage < totalPages - delta - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }
    
    return pages;
  };
  
  const pageNumbers = getPageNumbers();
  
  // Handle page click
  const handlePageClick = (page) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
      // Scroll to top of products grid
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  // Don't render pagination if there's only one page
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-4">
      <button
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-blue-500 text-white rounded-full"
      >
        <FaChevronLeft />
      </button>

      {pageNumbers.map((page, index) => (
        <button
          key={index}
          onClick={() => handlePageClick(page)}
          disabled={page === '...'}
          className={`px-4 py-2 rounded-full ${
            page === currentPage
              ? 'bg-blue-500 text-white'
              : page === '...'
              ? 'bg-transparent text-gray-400 cursor-default'
              : 'bg-gray-700 text-gray-300'
          }`}          
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-blue-500 text-white rounded-full"
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default Pagination;
