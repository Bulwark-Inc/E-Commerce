import { useProduct } from "../../context/ProductContext";
import { Listbox } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';

const ProductFilter = () => {
  const { categories, filters, setFilters } = useProduct();

  // Local state for controlled form inputs
  const [localFilters, setLocalFilters] = useState(filters);

  const handleChange = (key, value) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    setFilters({ ...localFilters, page: 1 });
  };

  const handleClear = () => {
    const cleared = {
      search: '',
      category: '',
      min_price: '',
      max_price: '',
      ordering: '',
      page: 1,
    };
    setLocalFilters(cleared);
    setFilters(cleared);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
      {/* Category Filter */}
      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        {categories.length === 0 ? (
          <p className="text-sm text-gray-400">Loading categories...</p>
        ) : (
          <Listbox value={localFilters.category} onChange={(val) => handleChange('category', val)}>
            <div className="relative">
              <Listbox.Button className="w-full border border-gray-300 rounded px-3 py-2 text-left flex justify-between items-center">
                <span>
                  {localFilters.category
                    ? categories.find((c) => c.slug === localFilters.category)?.name || 'Selected Category'
                    : 'All Categories'}
                </span>
                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
              </Listbox.Button>
              <Listbox.Options className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded shadow-lg max-h-60 overflow-auto">
                <Listbox.Option value="">
                  {({ active }) => (
                    <div className={`cursor-pointer px-4 py-2 ${active ? 'bg-blue-100' : ''}`}>
                      All Categories
                    </div>
                  )}
                </Listbox.Option>
                {categories.map((cat) => (
                  <Listbox.Option key={cat.id} value={cat.slug}>
                    {({ selected, active }) => (
                      <div className={`cursor-pointer px-4 py-2 flex justify-between ${active ? 'bg-blue-100' : ''}`}>
                        <span>{cat.name}</span>
                        {selected && <CheckIcon className="h-5 w-5 text-blue-600" />}
                      </div>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
        )}
      </div>

      {/* Min Price */}
      <div>
        <label className="block text-sm font-medium mb-1">Min Price</label>
        <input
          type="number"
          value={localFilters.min_price}
          onChange={(e) => handleChange('min_price', e.target.value)}
          placeholder="0"
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      {/* Max Price */}
      <div>
        <label className="block text-sm font-medium mb-1">Max Price</label>
        <input
          type="number"
          value={localFilters.max_price}
          onChange={(e) => handleChange('max_price', e.target.value)}
          placeholder="1000"
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      {/* Sort */}
      <div>
        <label className="block text-sm font-medium mb-1">Sort By</label>
        <select
          value={localFilters.ordering}
          onChange={(e) => handleChange('ordering', e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          <option value="">Default</option>
          <option value="price">Price: Low to High</option>
          <option value="-price">Price: High to Low</option>
          <option value="name">Name: A-Z</option>
          <option value="-name">Name: Z-A</option>
        </select>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-2 justify-end">
        <button
          onClick={handleApply}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Apply
        </button>
        <button
          onClick={handleClear}
          className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default ProductFilter;
