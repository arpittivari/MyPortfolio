import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import Loader from '../../components/ui/Loader.jsx';

/**
 * Component to protect routes. Redirects to login if not authenticated.
 */
const ProtectedRoute = () => {
  const { auth } = useAuth();
  
  if (auth.isLoading) {
    // Show a global loader while we check the token
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <Loader size="w-12 h-12" color="text-pcb-green" />
      </div>
    );
  }

  // If authenticated, render the nested component (Dashboard/Manage Pages)
  if (auth.isAuthenticated) {
    return <Outlet />;
  }
  
  // If not authenticated, redirect to the login page
  return <Navigate to="/admin/login" replace />;
};

export default ProtectedRoute;