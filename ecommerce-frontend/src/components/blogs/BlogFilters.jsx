import React from 'react';
import { useBlog } from '../../context/BlogContext';
import PostCategoryFilter from './PostCategoryFilter';
import PostTagFilter from './PostTagFilter';
import DropdownSelect from '../ui/DropdownSelect';

const BlogFilters = () => {
  const {
    filters,
    setFilters,
    categories,
    tags,
    updateCategoryFilter,
    setTagFilterAndNavigate,
  } = useBlog();

  const handleSearchChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      search: e.target.value,
      page: 1,
    }));
  };

  const handleOrderingChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      ordering: e.target.value,
      page: 1,
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      tag: '',
      ordering: '',
      page: 1,
    });
  };

  return (
    <div className="space-y-6">
      {/* 🔍 Search */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
        <input
          type="text"
          value={filters.search}
          onChange={handleSearchChange}
          placeholder="Search blog posts..."
          className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-purple-700"
        />
      </div>

      {/* 📂 Categories */}
      <div>
        <h4 className="text-sm font-semibold text-gray-800 mb-2">Categories</h4>
        <PostCategoryFilter categories={categories} onSelect={updateCategoryFilter} />
      </div>

      {/* 🏷️ Tags */}
      <div>
        <h4 className="text-sm font-semibold text-gray-800 mb-2">Tags</h4>
        <PostTagFilter tags={tags} onSelect={setTagFilterAndNavigate} />
      </div>

      {/* ↕️ Ordering */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
        <DropdownSelect
          value={filters.ordering}
          onChange={handleOrderingChange}
          options={[
            { value: '', label: 'Sort by' },
            { value: '-created_at', label: 'Newest' },
            { value: 'created_at', label: 'Oldest' },
            { value: '-views', label: 'Most Viewed' },
            { value: 'title', label: 'Title (A-Z)' },
          ]}
        />
      </div>

      {/* ❌ Clear Filters */}
      <div>
        <button
          onClick={clearFilters}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 rounded px-4 py-2 text-sm font-medium"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default BlogFilters;
