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

// Home and fallback
import HomePage from '../pages/home/HomePage';
import NotFoundPage from '../pages/notfound/NotFoundPage';

// Product pages
import ProductListPage from '../pages/products/ProductListPage';
import ProductDetailPage from '../pages/products/ProductDetailPage';

// Cart page
import CartPage from '../pages/cart/CartPage';

// Admin product pages
import AdminCreateProductPage from '../pages/admin/AdminCreateProductPage';
import AdminProductListPage from '../pages/admin/AdminProductListPage';
import AdminEditProductPage from '../pages/admin/AdminEditProductPage';
import AdminProductImagesPage from '../pages/admin/AdminProductImagesPage';

const AppRoutes = () => (
  <>
    <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
    <Routes>
      {/* Public */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:uid/:token" element={<ResetPasswordPage />} />

      {/* Products */}
      <Route path="/products" element={<ProductListPage />} />
      <Route path="/products/:slug" element={<ProductDetailPage />} />

      {/* Cart */}
      <Route
        path="/cart"
        element={
          <PrivateRoute>
            <CartPage />
          </PrivateRoute>
        }
      />

      {/* Admin Routes */}
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
            <AddressFormPage />
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

      {/* Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </>
);

export default AppRoutes;
