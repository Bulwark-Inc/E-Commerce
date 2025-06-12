import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import blogService from '../services/blogService';

const BlogContext = createContext();

export const BlogProvider = ({ children }) => {
  const pageSize = 10;
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [post, setPost] = useState(null);

  const [filters, setFilters] = useState({
    search: '',
    category: '',
    tag: '',
    ordering: '',
    page: 1,
  });

  const [totalPosts, setTotalPosts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const totalPages = Math.ceil(totalPosts / pageSize);

  const buildQueryParams = () => {
    const params = { ...filters };
    Object.keys(params).forEach((key) => {
      if (!params[key]) delete params[key];
    });
    return params;
  };

  const updateCategoryFilter = (slug, shouldNavigate = false) => {
    setFilters((prev) => ({
        ...prev,
        category: slug,
        page: 1,
    }));
    if (shouldNavigate) {
        navigate('/blogs');
    }
    };

  const setTagFilterAndNavigate = (slug) => {
    setFilters((prev) => ({
      ...prev,
      tag: slug,
      page: 1,
    }));
    navigate('/blogs');
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data } = await blogService.getAllPosts(buildQueryParams());
      setPosts(data.results);
      setTotalPosts(data.count || data.results.length || 0);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch blog posts');
    } finally {
      setLoading(false);
    }
  };

  const fetchPost = async (slug) => {
    setLoading(true);
    try {
      const { data } = await blogService.getPostBySlug(slug);
      setPost(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch post');
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedPosts = async () => {
    try {
      const { data } = await blogService.getFeaturedPosts();
      setFeaturedPosts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRecentPosts = async () => {
    try {
      const { data } = await blogService.getRecentPosts();
      setRecentPosts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const getRelatedPosts = async (post) => {
    try {
        const related = new Map(); // To prevent duplicates
        if (post.category) {
        const { data } = await blogService.getPostsByCategory(post.category.slug);
        data.results.forEach((p) => {
            if (p.id !== post.id) related.set(p.id, p);
        });
        }
        if (post.tags?.length) {
        for (const tag of post.tags) {
            const { data } = await blogService.getPostsByTag(tag.slug);
            data.results.forEach((p) => {
            if (p.id !== post.id) related.set(p.id, p);
            });
        }
        }

        return Array.from(related.values()).slice(0, 4); // Return up to 4 related posts
    } catch (err) {
        console.error('Error fetching related posts', err);
        return [];
    }
    };

  const fetchCategories = async () => {
    try {
      const { data } = await blogService.getCategories();
      setCategories(data.results);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTags = async () => {
    try {
      const { data } = await blogService.getTags();
      setTags(data.results);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [filters]);

  useEffect(() => {
    fetchFeaturedPosts();
    fetchRecentPosts();
    fetchCategories();
    fetchTags();
  }, []);

  return (
    <BlogContext.Provider
      value={{
        posts,
        featuredPosts,
        recentPosts,
        post,
        fetchPost,
        categories,
        tags,
        filters,
        setFilters,
        totalPosts,
        totalPages,
        loading,
        error,
        fetchPosts,
        fetchFeaturedPosts,
        fetchRecentPosts,
        getRelatedPosts,
        fetchCategories,
        fetchTags,
        updateCategoryFilter,
        setTagFilterAndNavigate,
        pageSize,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = () => useContext(BlogContext);
