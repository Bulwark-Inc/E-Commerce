import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import PrivateRoute from '../shared/utils/PrivateRoute';

// Home and fallback
import HomePage from '../pages/home/HomePage';
import NotFoundPage from '../pages/notfound/NotFoundPage';


/* --------------- Auth and Users Imports --------------- */

// Auth pages
import LoginPage from '../features/auth/pages/LoginPage';
import RegisterPage from '../features/auth/pages/RegisterPage';
import ForgotPasswordPage from '../features/auth/pages/ForgotPasswordPage';
import ResetPasswordPage from '../features/auth/pages/ResetPasswordPage';
import ChangePasswordPage from '../features/auth/pages/ChangePasswordPage';

// User pages
import ProfilePage from '../features/users/pages/ProfilePage';
import AddressListPage from '../features/users/pages/AddressListPage';
import AddressFormPage from '../features/users/pages/AddressFormPage';
import AddressEditPage from '../features/users/pages/AddressEditPage';

/* --------X------ Auth & Users Imports -------X------- */


/* --------------- Commerce Imports --------------- */

// Product pages
import ProductListPage from '../features/products/pages/ProductListPage';
import ProductDetailPage from '../features/products/pages/ProductDetailPage';

// Cart page
import CartPage from '../features/cart/pages/CartPage';

// Checkout Page
import CheckoutPage from '../features/checkout/pages/CheckoutPage';

// Order pages
import OrderConfirmationPage from '../features/order/pages/OrderConfirmationPage';
import OrderHistoryPage from '../features/order/pages/OrderHistoryPage';
import OrderDetailPage from '../features/order/pages/OrderDetailPage';

// Payment Page
// import PaymentCheckoutPage from '../features/payment/pages/PaymentPage';

// // Admin product pages
// import AdminCreateProductPage from '../pages/admin/AdminCreateProductPage';
// import AdminProductListPage from '../pages/admin/AdminProductListPage';
// import AdminEditProductPage from '../pages/admin/AdminEditProductPage';
// import AdminProductImagesPage from '../pages/admin/AdminProductImagesPage';

/* --------X------ Commerce Imports -------X------- */


/* --------------- Content and Engagement Imports --------------- */

// // Blog pages
// import BlogListPage from '../pages/blogs/BlogListPage';
// import BlogDetailPage from '../pages/blogs/BlogDetailPage';
// import CategoryPostsPage from '../pages/blogs/CategoryPostsPage';
// import TagPostsPage from '../pages/blogs/TagPostsPage';

// // Admin blog pages
// import AdminBlogListPage from '../pages/admin/blogs/AdminBlogListPage';
// import AdminBlogCreatePage from '../pages/admin/blogs/AdminBlogCreatePage';
// import AdminBlogEditPage from '../pages/admin/blogs/AdminBlogEditPage';
// import AdminBlogCategoriesPage from '../pages/admin/blogs/AdminBlogCategoriesPage';
// import AdminBlogTagsPage from '../pages/admin/blogs/AdminBlogTagsPage';


const AppRoutes = () => (
  <>
    <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
    <Routes>
      
      {/* ==================== Public ===================== */}

      {/* Home and Auth */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:uid/:token" element={<ResetPasswordPage />} />

      {/* Products */}
      <Route path="/products" element={<ProductListPage />} />
      <Route path="/products/:slug" element={<ProductDetailPage />} />
      
      {/* Blog */}
      {/* <Route path="/blogs" element={<BlogListPage />} />
      <Route path="/blogs/:slug" element={<BlogDetailPage />} />
      <Route path="/blogs/category/:slug" element={<CategoryPostsPage />} />
      <Route path="/blogs/tag/:slug" element={<TagPostsPage />} /> */}

      {/* ==========x========= Public ==========x========== */}


      {/* ==================== Private ===================== */}

      {/* User Private */}
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/addresses"
        element={
          <PrivateRoute>
            <AddressListPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/addresses/new"
        element={
          <PrivateRoute>
            <AddressFormPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/addresses/:id/edit"
        element={
          <PrivateRoute>
            <AddressEditPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/settings/password"
        element={
          <PrivateRoute>
            <ChangePasswordPage />
          </PrivateRoute>
        }
      />
      
      {/* Cart */}
      <Route
        path="/cart"
        element={
          <PrivateRoute>
            <CartPage />
          </PrivateRoute>
        }
      />

      {/* Checkout */}
      <Route
        path="/checkout"
        element={
          <PrivateRoute>
            <CheckoutPage />
          </PrivateRoute>
        }
      />

      {/* Order */}
      <Route
        path="/orders"
        element={
          <PrivateRoute>
            <OrderHistoryPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/order/:id"
        element={
          <PrivateRoute>
            <OrderDetailPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/order-confirmation/:orderId"
        element={
          <PrivateRoute>
            <OrderConfirmationPage />
          </PrivateRoute>
        }
      />

      {/* ==========x========= Private ==========x========== */}

      
      {/* ==================== Admin ===================== */}
      
      {/* Admin Products */}
      {/* <Route
        path="/admin/products"
        element={
          <PrivateRoute adminOnly={true}>
            <AdminProductListPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/products/create"
        element={
          <PrivateRoute adminOnly={true}>
            <AdminCreateProductPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/products/edit/:slug"
        element={
          <PrivateRoute adminOnly={true}>
            <AdminEditProductPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/products/:slug/images"
        element={
          <PrivateRoute adminOnly={true}>
            <AdminProductImagesPage />
          </PrivateRoute>
        }
      /> */}

      {/* Admin Blogs */}
      {/* <Route
        path="/admin/blogs"
        element={
          <PrivateRoute adminOnly={true}>
            <AdminBlogListPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/blogs/create"
        element={
          <PrivateRoute adminOnly={true}>
            <AdminBlogCreatePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/blogs/edit/:slug"
        element={
          <PrivateRoute adminOnly={true}>
            <AdminBlogEditPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/blogs/categories"
        element={
          <PrivateRoute adminOnly={true}>
            <AdminBlogCategoriesPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/blogs/tags"
        element={
          <PrivateRoute adminOnly={true}>
            <AdminBlogTagsPage />
          </PrivateRoute>
        }
      /> */}

      {/* ==========x========= Admin ==========x========== */}

      
      {/* Fallback */}
      <Route path="*" element={<NotFoundPage />} />

    </Routes>
  </>
);

export default AppRoutes;
