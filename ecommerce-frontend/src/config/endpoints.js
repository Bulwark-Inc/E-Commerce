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

// API endpoints for orders
export const ORDER_ENDPOINTS = {
  orders: '/api/v1/orders/',
  orderDetail: (id) => `/api/v1/orders/${id}/`,
  cancelOrder: (id) => `/api/v1/orders/${id}/cancel/`,
  initializePayment: (id) => `/api/v1/orders/${id}/initialize_payment/`,
};

// API endpoints for payments
export const PAYMENT_ENDPOINTS = {
  verifyPayment: (reference) => `/api/v1/orders/payments/verify/?reference=${reference}`,
};

// API endpoints for blog
export const BLOG_ENDPOINTS = {
  posts: '/api/v1/blogs/posts/',
  postDetail: (slug) => `/api/v1/blogs/posts/${slug}/`,
  categories: '/api/v1/blogs/categories/',
  categoryDetail: (slug) => `/api/v1/blogs/categories/${slug}/`,
  categoryPosts: (slug) => `/api/v1/blogs/categories/${slug}/posts/`,
  tags: '/api/v1/blogs/tags/',
  tagDetail: (slug) => `/api/v1/blogs/tags/${slug}/`,
  tagPosts: (slug) => `/api/v1/blogs/tags/${slug}/posts/`,
  postComments: (slug) => `/api/v1/blogs/posts/${slug}/comments/`,
  commentDetail: (id) => `/api/v1/blogs/comments/${id}/`,
  featuredPosts: '/api/v1/blogs/featured-posts/',
  popularPosts: '/api/v1/blogs/popular-posts/',
  recentPosts: '/api/v1/blogs/recent-posts/',
  searchPosts: (query) => `/api/v1/blogs/search-posts/?q=${encodeURIComponent(query)}`,
  stats: '/api/v1/blogs/stats/',
};