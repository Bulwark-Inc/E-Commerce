import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useBlog } from '../../context/BlogContext';
import { FaComments, FaHistory, FaStar, FaLink } from 'react-icons/fa';
import PostCard from '../../components/blogs/PostCard';
import CommentList from '../../components/blogs/CommentList';
import CommentForm from '../../components/blogs/CommentForm';
import PostStats from '../../components/blogs/PostStats';
import FeaturedPosts from '../../components/blogs/FeaturedPosts';
import RecentPosts from '../../components/blogs/RecentPosts';

const BlogDetailPage = () => {
  const { slug } = useParams();
  const [relatedPosts, setRelatedPosts] = useState([]);
  const {
    post,
    fetchPost,
    recentPosts,
    fetchRecentPosts,
    featuredPosts,
    fetchFeaturedPosts,
    getRelatedPosts,
    loading,
    error,
  } = useBlog();

  useEffect(() => {
    fetchPost(slug);
    fetchRecentPosts();
    fetchFeaturedPosts();
  }, [slug]);

  useEffect(() => {
    if (post) getRelatedPosts(post).then(setRelatedPosts);
  }, [post]);

  if (loading) return <div className="container mx-auto py-20 text-center text-xl text-purple-700">Loading post...</div>;
  if (error) return <div className="container mx-auto py-20 text-center text-red-600">{error}</div>;
  if (!post) return <div className="container mx-auto py-20 text-center text-gray-500">Post not found.</div>;

  return (
    <div className="container mx-auto px-4 py-10 space-y-12 max-w-4xl">
      <article className="space-y-6">
        <h1 className="text-4xl font-bold text-purple-800">{post.title}</h1>

        <div className="flex flex-wrap items-center text-sm text-gray-500">
            <span>Published on {new Date(post.published_at).toLocaleDateString()}</span>
            {post.author && (
            <span className="ml-4">
                By {post.author.first_name} {post.author.last_name}
            </span>
            )}
        </div>

        {post.featured_image && (
            <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-auto rounded-lg shadow-md"
            />
        )}

        <div
            className="prose prose-purple prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
        />
        </article>

      <section id="comments" className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center space-x-2 text-purple-700">
          <FaComments /> <span>Comments</span>
        </h2>
        {post.comments?.length
          ? <CommentList comments={post.comments} />
          : <p className="text-gray-500">No comments yet. Be the first!</p>
        }
        <CommentForm postSlug={slug} />
      </section>

      {relatedPosts.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold flex items-center text-purple-700">
            <FaLink /> <span>Related Posts</span>
          </h2>
          <div className="flex space-x-4 overflow-x-auto scrollbar-hide py-2">
            {relatedPosts.map(item => (
              <div key={item.id} className="min-w-[280px] flex-shrink-0">
                <PostCard post={item} />
              </div>
            ))}
          </div>
        </section>
      )}

      {recentPosts.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold flex items-center text-purple-700">
            <FaHistory /> <span>Recent Posts</span>
          </h2>
          <RecentPosts posts={recentPosts} />
        </section>
      )}

      {featuredPosts.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold flex items-center text-purple-700">
            <FaStar /> <span>Featured Posts</span>
          </h2>
          <FeaturedPosts posts={featuredPosts} />
        </section>
      )}
    </div>
  );
};

export default BlogDetailPage;
