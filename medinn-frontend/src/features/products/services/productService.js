import apiClient from '../../../api/api';
import { PRODUCT_ENDPOINTS } from '../../../shared/constants/endpoints';

const productService = {
  // 🛍 Products
  list: (params = {}) =>
    apiClient.get(PRODUCT_ENDPOINTS.list, { params }),

  getBySlug: (slug) =>
    apiClient.get(PRODUCT_ENDPOINTS.detail(slug)),

  getFeatured: () =>
    apiClient.get(PRODUCT_ENDPOINTS.featured),

  getRelated: (productId, categoryId) =>
    apiClient.get(PRODUCT_ENDPOINTS.related(productId, categoryId)),

  // 🗂 Categories
  getCategories: () =>
    apiClient.get(PRODUCT_ENDPOINTS.categories),

  getCategoryBySlug: (slug) =>
    apiClient.get(PRODUCT_ENDPOINTS.categoryDetail(slug)),

  getProductsByCategorySlug: (slug) =>
    apiClient.get(PRODUCT_ENDPOINTS.productsInCategory(slug)),

  // 🔧 Admin Actions
  create: (data) =>
    apiClient.post(PRODUCT_ENDPOINTS.create, data),

  update: (slug, data) =>
    apiClient.patch(PRODUCT_ENDPOINTS.update(slug), data),

  delete: (slug) =>
    apiClient.delete(PRODUCT_ENDPOINTS.delete(slug)),

  // 📸 Product Images
  addImage: (slug, formData) =>
    apiClient.post(PRODUCT_ENDPOINTS.addImage(slug), formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // // 💬 Comments
  // getComments: (slug) =>
  //   apiClient.get(PRODUCT_ENDPOINTS.comments(slug)),

  // addComment: (slug, commentData) =>
  //   apiClient.post(PRODUCT_ENDPOINTS.comments(slug), commentData),

  // updateComment: (id, data) =>
  //   apiClient.put(PRODUCT_ENDPOINTS.commentDetail(id), data),

  // deleteComment: (id) =>
  //   apiClient.delete(PRODUCT_ENDPOINTS.commentDetail(id)),

  // // ⭐ Ratings
  // rateProduct: (slug, ratingData) =>
  //   apiClient.post(PRODUCT_ENDPOINTS.rate(slug), ratingData),

  // // 📝 Reviews
  // getReviews: (slug) =>
  //   apiClient.get(PRODUCT_ENDPOINTS.reviews(slug)),

  // addReview: (slug, formData) =>
  //   apiClient.post(PRODUCT_ENDPOINTS.reviews(slug), formData, {
  //     headers: { 'Content-Type': 'multipart/form-data' },
  //   }),
};

export default productService;
