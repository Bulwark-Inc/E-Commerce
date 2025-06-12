import { useEffect } from 'react';
import { useBlog } from '../../context/BlogContext';
import PostList from '../../components/blogs/PostList';
import PostPagination from '../../components/blogs/PostPagination';
import BlogSkeleton from '../../components/skeletons/BlogSkeleton';
import BlogFilters from '../../components/blogs/BlogFilters';
import FeaturedPosts from '../../components/blogs/FeaturedPosts';
import RecentPosts from '../../components/blogs/RecentPosts';
import PostStats from '../../components/blogs/PostStats'

const BlogListPage = () => {
  const {
    posts,
    fetchPosts,
    loading,
    filters,
    setFilters,
    totalPages,
    recentPosts,
    featuredPosts,
  } = useBlog();

  useEffect(() => {
    fetchPosts();
  }, [filters]);

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-purple-800 mb-8">🩺 Our Medical Blog</h1>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* 📝 Main Blog Area */}
        <div className="flex-1 space-y-6">
          <div className="bg-white shadow rounded-lg p-4">
            <BlogFilters />
          </div>

          {loading ? (
            <BlogSkeleton count={6} />
          ) : (
            <>
              <PostList posts={posts} />
              <PostPagination
                currentPage={filters.page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>

        {/* 📌 Sidebar */}
        <aside className="w-full lg:w-1/3 space-y-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <FeaturedPosts posts={featuredPosts} />
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <RecentPosts posts={recentPosts} />
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <PostStats />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default BlogListPage;
