import { Navigate } from 'react-router-dom';
import { useBuyerAuth } from '../hooks/useBuyerAuth';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useBuyerAuth();

  // Show loading state while checking authentication
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/buyer/login" replace />;
  }

  // Render children if authenticated
  return children;
};

export default ProtectedRoute;