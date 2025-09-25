import React from 'react';
import { Navigate } from 'react-router-dom';
import { useRepairCenterAuth } from '../hooks/useRepairCenterAuth';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useRepairCenterAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/repair-center/login" replace />;
  }

  // Render children if authenticated
  return children;
};

export default ProtectedRoute;