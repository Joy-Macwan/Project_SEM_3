import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSellerAuth } from '../hooks/useSellerAuth';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSellerAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/seller/login" />;
  }

  return children;
};

export default ProtectedRoute;