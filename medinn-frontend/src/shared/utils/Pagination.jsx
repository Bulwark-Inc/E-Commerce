import usePagination from '../hooks/usePagination';

const Pagination = ({
  currentPage,
  totalItems,
  pageSize = 12,
  onPageChange,
  siblingCount = 1,
}) => {
  const { totalPages, paginationRange } = usePagination({
    totalItems,
    pageSize,
    currentPage,
    siblingCount,
  });

  if (totalPages <= 1) return null;

  const handlePageChange = (page) => {
    if (page === '...') return;
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex justify-center mt-8">
      <nav className="inline-flex items-center space-x-1">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100"
        >
          Prev
        </button>

        {paginationRange.map((page, idx) => (
          <button
            key={idx}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-1 border rounded ${
              page === currentPage
                ? 'bg-blue-600 text-white'
                : 'hover:bg-gray-100'
            } ${page === '...' ? 'cursor-default' : ''}`}
            disabled={page === '...'}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100"
        >
          Next
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
