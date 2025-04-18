import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../utils/PrivateRoute';

// Auth pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';

// User pages
import ProfilePage from '../pages/user/ProfilePage';
import AddressListPage from '../pages/user/AddressListPage';
import AddressFormPage from '../pages/user/AddressFormPage';
import ChangePasswordPage from '../pages/auth/ChangePasswordPage';

// Home and fallback
import HomePage from '../pages/home/HomePage';
import NotFoundPage from '../pages/notfound/NotFoundPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:uid/:token" element={<ResetPasswordPage />} />

      {/* Protected */}
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
  );
};

export default AppRoutes;
