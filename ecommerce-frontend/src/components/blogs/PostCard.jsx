import { Link } from 'react-router-dom';
import { FaClock, FaEye } from 'react-icons/fa';

const PostCard = ({ post }) => (
  <div className="bg-white border rounded-lg shadow-sm hover:shadow-md transition overflow-hidden">
    <Link to={`/blogs/${post.slug}`}>
      <img
        src={post.featured_image}
        alt={post.title}
        className="w-full h-48 object-cover"
      />
    </Link>
    <div className="p-4">
      <h2 className="text-lg font-bold mb-1 text-purple-800 line-clamp-2">
        {post.title}
      </h2>
      <p className="text-sm text-gray-600 mb-3 line-clamp-3">{post.excerpt}</p>

      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
        <div className="flex items-center gap-1">
          <FaClock className="text-gold-500" />
          {post.reading_time}
        </div>
        <div className="flex items-center gap-1">
          <FaEye className="text-purple-700" />
          {post.views_count} views
        </div>
      </div>

      <Link
        to={`/blogs/${post.slug}`}
        className="inline-block text-sm text-purple-700 font-medium hover:underline"
      >
        Read More →
      </Link>
    </div>
  </div>
);

export default PostCard;
