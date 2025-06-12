import React from 'react';
import { FaFolder } from 'react-icons/fa';

const PostCategoryFilter = ({ categories, onSelect }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <button
          key={cat.slug}
          onClick={() => onSelect(cat.slug, true)}
          className="flex items-center gap-2 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm hover:bg-purple-200 transition"
        >
          <FaFolder className="text-purple-700" /> {cat.name}
        </button>
      ))}
    </div>
  );
};

export default PostCategoryFilter;
