import apiClient from './api';
import { BLOG_ENDPOINTS } from '../config/endpoints';

const blogService = {
  // 📖 Posts
  getAllPosts: (params = {}) => apiClient.get(BLOG_ENDPOINTS.posts, { params }),
  getPostBySlug: (slug) => apiClient.get(BLOG_ENDPOINTS.postDetail(slug)),
  getFeaturedPosts: () => apiClient.get(BLOG_ENDPOINTS.featuredPosts),
  getPopularPosts: () => apiClient.get(BLOG_ENDPOINTS.popularPosts),
  getRecentPosts: () => apiClient.get(BLOG_ENDPOINTS.recentPosts),
  searchPosts: (query) => apiClient.get(BLOG_ENDPOINTS.searchPosts(query)),

  // 📂 Categories
  getCategories: () => apiClient.get(BLOG_ENDPOINTS.categories),
  getCategoryBySlug: (slug) => apiClient.get(BLOG_ENDPOINTS.categoryDetail(slug)),
  getPostsByCategory: (slug, params = {}) =>
    apiClient.get(BLOG_ENDPOINTS.categoryPosts(slug), { params }),

  // 🏷️ Tags
  getTags: () => apiClient.get(BLOG_ENDPOINTS.tags),
  getTagBySlug: (slug) => apiClient.get(BLOG_ENDPOINTS.tagDetail(slug)),
  getPostsByTag: (slug, params = {}) =>
    apiClient.get(BLOG_ENDPOINTS.tagPosts(slug), { params }),

  // 💬 Comments
  getCommentsForPost: (slug) => apiClient.get(BLOG_ENDPOINTS.postComments(slug)),
  createComment: (slug, commentData) =>
    apiClient.post(BLOG_ENDPOINTS.postComments(slug), commentData),
  updateComment: (id, data) => apiClient.patch(BLOG_ENDPOINTS.commentDetail(id), data),
  deleteComment: (id) => apiClient.delete(BLOG_ENDPOINTS.commentDetail(id)),

  // 📊 Stats
  getStats: () => apiClient.get(BLOG_ENDPOINTS.stats),

  // 🔧 Admin Actions
  createPost: (data) => apiClient.post(BLOG_ENDPOINTS.posts, data),
  updatePost: (slug, data) => apiClient.patch(BLOG_ENDPOINTS.postDetail(slug), data),
  deletePost: (slug) => apiClient.delete(BLOG_ENDPOINTS.postDetail(slug)),
};

export default blogService;
