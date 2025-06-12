import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useBlog } from '../../context/BlogContext';
import PostCard from '../../components/blogs/PostCard';
import PostPagination from '../../components/blogs/PostPagination';

const CategoryPostsPage = () => {
  const { slug } = useParams();
  const {
    posts,
    totalPages,
    pageSize,
    filters,
    setFilters,
    updateCategoryFilter,
    loading,
  } = useBlog();

  useEffect(() => {
    // On mount, set category filter — this will automatically trigger fetchPosts via context useEffect
    updateCategoryFilter(slug);
  }, [slug]);

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  return (
    <div className="category-posts-page">
      <h2>Posts in "{slug.replace(/-/g, ' ')}"</h2>

      {loading ? (
        <p>Loading posts...</p>
      ) : posts.length === 0 ? (
        <p>No posts found in this category.</p>
      ) : (
        <div className="posts-grid">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <PostPagination
          page={filters.page}
          setPage={handlePageChange}
          totalPages={totalPages}
        />
      )}
    </div>
  );
};

export default CategoryPostsPage;
