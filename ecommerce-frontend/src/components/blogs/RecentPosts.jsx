import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import RecentPostsSkeleton from './RecentPostsSkeleton';

const RecentPosts = ({ posts }) => {
  if (!posts || posts.length === 0) return <RecentPostsSkeleton />;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <ul className="space-y-3">
        {posts.map(post => (
          <li key={post.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-2">
            <Link
              to={`/blogs/${post.slug}`}
              className="text-purple-700 hover:underline font-medium"
            >{post.title}</Link>
            <time className="text-xs text-gray-500 mt-1 sm:mt-0">
              {format(new Date(post.published_at), 'MMM d, yyyy')}
            </time>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentPosts;
