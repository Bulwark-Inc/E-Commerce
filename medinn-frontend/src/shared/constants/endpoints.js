// API endpoints for Auth
export const AUTH_ENDPOINTS = {
  login: '/api/v1/account/auth/login/',
  register: '/api/v1/account/auth/register/',
  refresh: '/api/v1/account/auth/refresh/',
  passwordReset: '/api/v1/account/auth/password-reset/',
  passwordResetConfirm: '/api/v1/account/auth/password-reset-confirm/<uidb64>/<token>/',
};


// API endpoints for users
export const USER_ENDPOINTS = {
  profile: '/api/v1/profile/profile/',
  addresses: {
    list: '/api/v1/profile/addresses/',
    detail: (id) => `/api/v1/profile/addresses/${id}/`,
  },
};


// API endpoints for products, categories, comments, ratings, and reviews
export const PRODUCT_ENDPOINTS = {
  // 📦 Products
  list: '/api/v1/products/products/',
  detail: (slug) => `/api/v1/products/products/${slug}/`,
  create: '/api/v1/products/products/',
  update: (slug) => `/api/v1/products/products/${slug}/`,
  delete: (slug) => `/api/v1/products/products/${slug}/`,

  // 📸 Add Product Image
  addImage: (slug) => `/api/v1/products/products/${slug}/add_image/`,

  // 🌟 Featured Products
  featured: '/api/v1/products/products/featured/',

  // 🔁 Related Products
  related: (productId, categoryId) =>
    `/api/v1/products/products/related/?product_id=${productId}&category_id=${categoryId}`,

  // 🗂️ Categories
  categories: '/api/v1/products/categories/',
  categoryDetail: (slug) => `/api/v1/products/categories/${slug}/`,
  productsInCategory: (slug) => `/api/v1/products/categories/${slug}/products/`,

  // 💬 Comments
  comments: (slug) => `/api/v1/products/${slug}/comments/`,
  commentDetail: (id) => `/api/v1/products/comments/${id}/`,

  // ⭐ Ratings
  rate: (slug) => `/api/v1/products/${slug}/rate/`,

  // 📝 Reviews
  reviews: (slug) => `/api/v1/products/${slug}/reviews/`,
};



/* --------------------- Commerce Domain ---------------------*/

// API endpoints for carts
export const CART_ENDPOINTS = {
  cart: '/api/v1/cart/', // Get cart details (GET) or update the cart (POST)
  clear: '/api/v1/cart/clear/', // Clear all items in the cart (POST)
  applyCoupon: '/api/v1/cart/apply_coupon/', // Apply a coupon to the cart (POST)
  removeCoupon: '/api/v1/cart/remove_coupon/', // Remove coupon from the cart (POST)
  items: '/api/v1/cart/items/', // Get all items in the cart (GET) or add new items (POST)
  cartItemDetail: (id) => `/api/v1/cart/items/${id}/`, // Get, update or delete a specific cart item (GET, PUT, DELETE)
  checkout: '/api/v1/orders/checkout/', // Create an order from the cart (POST)
};

// API endpoints for orders
export const ORDER_ENDPOINTS = {
  orders: '/api/v1/orders/', // List all orders (GET) or create a new order (POST)
  orderDetail: (id) => `/api/v1/orders/${id}/`, // Get detailed information of a specific order (GET)
  cancelOrder: (id) => `/api/v1/orders/${id}/cancel/`, // Cancel a specific order (POST)
  checkout: '/api/v1/orders/checkout/', // Checkout (create order from cart)
  initializePayment: (id) => `/api/v1/orders/${id}/initialize_payment/`, // Initialize payment for the order (POST)
};

// API endpoints for payments
export const PAYMENT_ENDPOINTS = {
  verifyPayment: (reference) => `/api/v1/payment/verify/?reference=${reference}`, // Verify payment status (GET)
};

/* ---------n---------- Commerce Domain ---------n---------- */


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