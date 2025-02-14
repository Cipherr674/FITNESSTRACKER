import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Assuming you have an AuthContext that provides authenticated user info

const AdminRoute = ({ children }) => {
  const { user } = useAuth();

  // If user is not logged in or not an admin, redirect to login or an error page
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminRoute; 