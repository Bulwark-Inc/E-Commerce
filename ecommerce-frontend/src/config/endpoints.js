// API endpoints for Auth
export const AUTH_ENDPOINTS = {
  login: '/api/v1/user/auth/login/',
  register: '/api/v1/user/auth/register/',
  refresh: '/api/v1/user/auth/refresh/',
  passwordReset: '/api/v1/user/auth/password-reset/',
  passwordResetConfirm: '/api/v1/user/auth/password-reset-confirm/<uidb64>/<token>/',
};
  
// API endpoints for users
export const USER_ENDPOINTS = {
  profile: '/api/v1/user/profile/',
  addresses: {
    list: '/api/v1/user/addresses/',
    detail: (id) => `/api/v1/user/addresses/${id}/`,
  },
};

// API endpoints for products
export const PRODUCT_ENDPOINTS = {
  products: '/api/v1/products/',
  productDetail: (slug) => `/api/v1/products/${slug}/`,
  featuredProducts: '/api/v1/products/featured/',
  relatedProducts: '/api/v1/products/related/',
  categories: '/api/v1/products/categories/',
  categoryDetail: (slug) => `/api/v1/products/categories/${slug}/`,
  categoryProducts: (slug) => `/api/v1/products/categories/${slug}/products/`,
  addProductImage: (slug) => `/api/v1/products/${slug}/add_image/`,
  addProductReview: (slug) => `/api/products/${slug}/add_review/`
};
  
// API endpoints for carts
export const CART_ENDPOINTS = {
  cart: '/api/v1/cart/',
  clear: '/api/v1/cart/clear/',
  applyCoupon: '/api/v1/cart/apply_coupon/',
  removeCoupon: '/api/v1/cart/remove_coupon/',
  items: '/api/v1/cart/items/',
  cartItemDetail: (id) => `/api/v1/cart/items/${id}/`
};
