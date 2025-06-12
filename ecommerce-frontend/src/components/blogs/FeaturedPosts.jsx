import React from 'react';
import { Link } from 'react-router-dom';
import FeaturedPostsSkeleton from './FeaturedPostsSkeleton';

const FeaturedPosts = ({ posts }) => {
  if (!posts || posts.length === 0) return <FeaturedPostsSkeleton />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {posts.map(post => (
        <Link
          key={post.id}
          to={`/blogs/${post.slug}`}
          className="block bg-white rounded-lg shadow-md hover:shadow-lg transition duration-200 overflow-hidden"
        >
          {post.featured_image && (
            <img src={post.featured_image}
                 alt={post.title}
                 className="w-full h-48 object-cover" />
          )}
          <div className="p-4">
            <h3 className="text-lg font-semibold text-purple-800 mb-2 line-clamp-2">{post.title}</h3>
            <p className="text-gray-600 text-sm line-clamp-3">{post.excerpt}</p>
            <div className="text-xs text-gray-500 mt-3 flex justify-between">
              <span>⏱️ {post.reading_time}</span>
              <span>👁️ {post.views_count}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default FeaturedPosts;
