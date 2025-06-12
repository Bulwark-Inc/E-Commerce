import React from 'react';
import { FaTag } from 'react-icons/fa';

const PostTagFilter = ({ tags, onSelect }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <button
          key={tag.slug}
          onClick={() => onSelect(tag.slug)}
          className="bg-gold-500/10 text-gold-500 px-3 py-1 rounded-full text-sm hover:bg-gold-500/20 transition flex items-center gap-1"
        >
          <FaTag className="text-gold-500" />
          #{tag.name}
        </button>
      ))}
    </div>
  );
};

export default PostTagFilter;
