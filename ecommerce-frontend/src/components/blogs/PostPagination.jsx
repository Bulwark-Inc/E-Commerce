import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const PostPagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="flex justify-center items-center gap-6 mt-10 text-sm">
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-40"
      >
        <FaChevronLeft /> Prev
      </button>

      <span className="font-medium text-purple-800">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-40"
      >
        Next <FaChevronRight />
      </button>
    </div>
  );
};

export default PostPagination;
