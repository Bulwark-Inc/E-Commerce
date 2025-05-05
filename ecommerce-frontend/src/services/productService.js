import apiClient from './api';
import { PRODUCT_ENDPOINTS } from '../config/endpoints';

const productService = {
  // 🛍 Products
  getAll: (params = {}) => apiClient.get(PRODUCT_ENDPOINTS.products, { params }),
  getBySlug: (slug) => apiClient.get(PRODUCT_ENDPOINTS.productDetail(slug)),
  getFeatured: () => apiClient.get(PRODUCT_ENDPOINTS.featuredProducts),
  getRelated: (productId, categoryId) =>
    apiClient.get(PRODUCT_ENDPOINTS.relatedProducts, {
      params: { product_id: productId, category_id: categoryId },
    }),

  // 🗂 Categories
  getCategories: () => apiClient.get(PRODUCT_ENDPOINTS.categories),
  getCategoryBySlug: (slug) => apiClient.get(PRODUCT_ENDPOINTS.categoryDetail(slug)),
  getProductsByCategory: (slug) => apiClient.get(PRODUCT_ENDPOINTS.categoryProducts(slug)),

  // 🔧 Admin Actions
  create: (data) => apiClient.post(PRODUCT_ENDPOINTS.products, data),
  update: (slug, data) => apiClient.patch(PRODUCT_ENDPOINTS.productDetail(slug), data),
  delete: (slug) => apiClient.delete(PRODUCT_ENDPOINTS.productDetail(slug)),

  // 📸 Images
  addImage: (slug, formData) =>
    apiClient.post(PRODUCT_ENDPOINTS.addProductImage(slug), formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // 📝 Reviews
  addReview: (slug, reviewData) =>
    apiClient.post(PRODUCT_ENDPOINTS.addProductReview(slug), reviewData),
};

export default productService;
