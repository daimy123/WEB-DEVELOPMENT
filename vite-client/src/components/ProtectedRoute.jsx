import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Component for routes that require authentication
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { currentUser, isAdmin } = useAuth();
  
  // Debug information
  console.log('ProtectedRoute - Current User:', currentUser);
  console.log('ProtectedRoute - Is Admin:', isAdmin());
  console.log('ProtectedRoute - Require Admin:', requireAdmin);

  // If not logged in, redirect to login page
  if (!currentUser) {
    console.log('ProtectedRoute - Redirecting to login: No current user');
    return <Navigate to="/login" replace />;
  }

  // If admin access is required but user is not admin, redirect to home
  if (requireAdmin && !isAdmin()) {
    console.log('ProtectedRoute - Redirecting to home: Admin required but user is not admin');
    return <Navigate to="/home" replace />;
  }

  // Otherwise, render the children components
  return children;
};

export default ProtectedRoute;
