import { Navigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/context/AuthContext';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user: currentUser, authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && !currentUser.isAdmin) {
    console.log("Redirected")
    return <Navigate to="/" />; // Or to a page that says "Not authorized"
  }

  return children;
};

export default PrivateRoute;
