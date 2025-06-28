
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  switch (user.role) {
    case 'tenant':
      return <Navigate to="/tenant" replace />;
    case 'owner':
      return <Navigate to="/owner" replace />;
    case 'admin':
      return <Navigate to="/admin" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

export default Index;
