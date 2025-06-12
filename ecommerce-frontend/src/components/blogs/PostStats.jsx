import React, { useEffect, useState } from 'react';
import blogService from '../../services/blogService';
import { FaFileAlt, FaFolderOpen, FaTags, FaComments } from 'react-icons/fa';

const PostStats = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await blogService.getStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch blog stats:', err);
      }
    };
    fetchStats();
  }, []);

  if (!stats) return null;

  return (
    <div className="bg-white border rounded-lg p-5 shadow">
      <h2 className="text-lg font-semibold mb-4 text-purple-800">📈 Blog Insights</h2>
      <ul className="space-y-3 text-sm text-gray-700">
        <li className="flex items-center gap-2">
          <FaFileAlt className="text-gold-500" /> Total Posts: {stats.total_posts}
        </li>
        <li className="flex items-center gap-2">
          <FaFolderOpen className="text-purple-700" /> Categories: {stats.total_categories}
        </li>
        <li className="flex items-center gap-2">
          <FaTags className="text-purple-700" /> Tags: {stats.total_tags}
        </li>
        <li className="flex items-center gap-2">
          <FaComments className="text-gold-500" /> Comments: {stats.total_comments}
        </li>
      </ul>
    </div>
  );
};

export default PostStats;
