export const AUTH_ENDPOINTS = {
  login: '/api/user/auth/login/',
  register: '/api/user/auth/register/',
  refresh: '/api/user/auth/refresh/',
  passwordReset: '/api/user/auth/password-reset/',
  passwordResetConfirm: '/api/user/auth/password-reset-confirm/<uidb64>/<token>/',
};
  
export const USER_ENDPOINTS = {
  profile: '/api/user/profile/',
  addresses: {
    list: '/api/user/addresses/',
    detail: (id) => `/api/user/addresses/${id}/`,
  },
};

// Build API endpoints for products
export const PRODUCT_ENDPOINTS = {
  products: '/api/products/',
  productDetail: (slug) => `/api/products/${slug}/`,
  featuredProducts: '/api/products/featured/',
  relatedProducts: '/api/products/related/',
  categories: '/api/categories/',
  categoryDetail: (slug) => `/api/categories/${slug}/`,
  categoryProducts: (slug) => `/api/categories/${slug}/products/`,
  addProductImage: (slug) => `/api/products/${slug}/add_image/`,
  addProductReview: (slug) => `/api/products/${slug}/add_review/`
};
  