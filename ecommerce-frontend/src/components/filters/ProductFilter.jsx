import { useProduct } from "../../context/ProductContext";
import { Listbox } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

const ProductFilter = () => {
  const { categories, filters, setFilters } = useProduct();

  const handleChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // reset to first page on filter change
    }));
  };

  const handleCategoryChange = (value) => {
    handleChange('category', value);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <Listbox value={filters.category} onChange={handleCategoryChange}>
          <div className="relative">
            <Listbox.Button className="w-full border border-gray-300 rounded px-3 py-2 text-left focus:ring-2 focus:ring-blue-500 focus:outline-none flex justify-between items-center">
              <span>
                {filters.category
                  ? categories.find((c) => c.slug === filters.category)?.name
                  : 'All Categories'}
              </span>
              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
            </Listbox.Button>

            <Listbox.Options className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded shadow-lg max-h-60 overflow-auto focus:outline-none">
              <Listbox.Option value="">
                {({ active }) => (
                  <div
                    className={`cursor-pointer px-4 py-2 ${
                      active ? 'bg-blue-100' : ''
                    }`}
                  >
                    All Categories
                  </div>
                )}
              </Listbox.Option>

              {categories?.map((cat) => (
                <Listbox.Option key={cat.id} value={cat.slug}>
                  {({ selected, active }) => (
                    <div
                      className={`cursor-pointer px-4 py-2 flex justify-between ${
                        active ? 'bg-blue-100' : ''
                      }`}
                    >
                      <span>{cat.name}</span>
                      {selected && <CheckIcon className="h-5 w-5 text-blue-600" />}
                    </div>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        </Listbox>
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
