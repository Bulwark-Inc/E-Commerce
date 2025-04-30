import { useState } from 'react';
import { useProduct } from '../../context/ProductContext';

const ProductSearchBar = () => {
  const { setFilters, setCurrentPage } = useProduct();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    setFilters((prev) => ({
      ...prev,
      search: searchQuery,
      page: 1,
    }));
    setCurrentPage(1);
  };

  return (
    <div className="flex gap-2 mb-6">
      <input
        type="text"
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
      <button
        onClick={handleSearch}
        className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
      >
        Search
      </button>
    </div>
  );
};

export default ProductSearchBar;
