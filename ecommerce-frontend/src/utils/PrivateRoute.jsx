import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, authLoading } = useAuth();

  if (authLoading) return <div>Loading...</div>; // or a proper loader

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;