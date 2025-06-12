import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import PrivateRoute from '../utils/PrivateRoute';

// Auth pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import ChangePasswordPage from '../pages/auth/ChangePasswordPage';

// User pages
import ProfilePage from '../pages/user/ProfilePage';
import AddressListPage from '../pages/user/AddressListPage';
import AddressFormPage from '../pages/user/AddressFormPage';
import AddressEditPage from '../pages/user/AddressEditPage';

// Home and fallback
import HomePage from '../pages/home/HomePage';
import NotFoundPage from '../pages/notfound/NotFoundPage';

// Product pages
import ProductListPage from '../pages/products/ProductListPage';
import ProductDetailPage from '../pages/products/ProductDetailPage';

// Cart page
import CartPage from '../pages/cart/CartPage';

// Checkout Page
import CheckoutPage from '../pages/checkout/CheckoutPage';
import ConfirmOrderPage from '../pages/checkout/ConfirmOrderPage';

// Order page
import OrdersPage from '../pages/order/OrderListPage';
import OrderDetailPage from '../pages/order/OrderDetailPage';
import OrderConfirmationPage from '../pages/order/OrderConfirmationPage';

// Admin product pages
import AdminCreateProductPage from '../pages/admin/AdminCreateProductPage';
import AdminProductListPage from '../pages/admin/AdminProductListPage';
import AdminEditProductPage from '../pages/admin/AdminEditProductPage';
import AdminProductImagesPage from '../pages/admin/AdminProductImagesPage';

// Blog pages
import BlogListPage from '../pages/blogs/BlogListPage';
import BlogDetailPage from '../pages/blogs/BlogDetailPage';
import CategoryPostsPage from '../pages/blogs/CategoryPostsPage';
import TagPostsPage from '../pages/blogs/TagPostsPage';

// Admin blog pages
import AdminBlogListPage from '../pages/admin/blogs/AdminBlogListPage';
import AdminBlogCreatePage from '../pages/admin/blogs/AdminBlogCreatePage';
import AdminBlogEditPage from '../pages/admin/blogs/AdminBlogEditPage';
import AdminBlogCategoriesPage from '../pages/admin/blogs/AdminBlogCategoriesPage';
import AdminBlogTagsPage from '../pages/admin/blogs/AdminBlogTagsPage';


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
      <Route path="/blogs" element={<BlogListPage />} />
      <Route path="/blogs/:slug" element={<BlogDetailPage />} />
      <Route path="/blogs/category/:slug" element={<CategoryPostsPage />} />
      <Route path="/blogs/tag/:slug" element={<TagPostsPage />} />

      {/* ==========x========= Public ==========x========== */}


      {/* ==================== Protected ===================== */}

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
      
      <Route
        path="/confirm-order"
        element={
          <PrivateRoute>
            <ConfirmOrderPage />
          </PrivateRoute>
        }
      />

      {/* Order */}
      <Route
        path="/orders"
        element={
          <PrivateRoute>
            <OrdersPage />
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
        path="/order-confirmation/:orderId/"
        element={
          <PrivateRoute>
            <OrderConfirmationPage />
          </PrivateRoute>
        }
      />

      {/* ==========x========= Protected ==========x========== */}

      
      {/* ==================== Admin ===================== */}
      
      {/* Admin Products */}
      <Route
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
      />

      {/* Admin Blogs */}
      <Route
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
      />

      {/* ==========x========= Admin ==========x========== */}

      
      {/* Fallback */}
      <Route path="*" element={<NotFoundPage />} />

    </Routes>
  </>
);

export default AppRoutes;
