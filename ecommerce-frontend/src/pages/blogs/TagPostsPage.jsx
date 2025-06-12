import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useBlog } from '../../context/BlogContext';
import PostList from '../../components/blogs/PostList';
import PostPagination from '../../components/blogs/PostPagination';

const TagPostsPage = () => {
  const { slug } = useParams();
  const {
    posts,
    totalPages,
    pageSize,
    filters,
    setFilters,
    fetchPosts,
    loading,
  } = useBlog();

  // On tag change: update filters and fetch posts
  useEffect(() => {
    if (slug) {
      setFilters((prev) => ({
        ...prev,
        tag: slug,
        page: 1,
      }));
    }
  }, [slug, setFilters]);

  // Fetch posts whenever filters update
  useEffect(() => {
    fetchPosts();
  }, [filters]);

  return (
    <div className="tag-posts-page container">
      <h1 className="page-title">Posts tagged with: {slug}</h1>

      {loading ? (
        <p>Loading posts...</p>
      ) : (
        <>
          <PostList posts={posts} />

          {totalPages > 1 && (
            <PostPagination
              currentPage={filters.page}
              totalPages={totalPages}
              onPageChange={(page) =>
                setFilters((prev) => ({ ...prev, page }))
              }
              pageSize={pageSize}
            />
          )}
        </>
      )}
    </div>
  );
};

export default TagPostsPage;
