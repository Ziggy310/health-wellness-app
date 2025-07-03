import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ProtectedRoute = ({ children, requireOnboarding = false }) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Allow demo mode access
  const isDemoMode = localStorage.getItem('demo_mode');
  
  if (!user && !isDemoMode) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (requireOnboarding && profile && !profile.is_onboarded) {
    return <Navigate to="/onboarding" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;