import { useProduct } from "../../context/ProductContext";

const ProductFilter = () => {
  const { categories, filters, setFilters, setCurrentPage } = useProduct();

  const handleChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
    setCurrentPage(1);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <select
          value={filters.category}
          onChange={(e) => handleChange('category', e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">All Categories</option>
          {categories?.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Min Price</label>
        <input
          type="number"
          value={filters.min_price}
          onChange={(e) => handleChange('min_price', e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Max Price</label>
        <input
          type="number"
          value={filters.max_price}
          onChange={(e) => handleChange('max_price', e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Sort By</label>
        <select
          value={filters.ordering}
          onChange={(e) => handleChange('ordering', e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">Default</option>
          <option value="price">Price: Low to High</option>
          <option value="-price">Price: High to Low</option>
          <option value="-created_at">Newest</option>
        </select>
      </div>
    </div>
  );
};

export default ProductFilter;
