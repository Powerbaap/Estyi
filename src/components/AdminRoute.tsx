import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user } = useAuth();

  // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Kullanıcı admin değilse ana sayfaya yönlendir
  if (user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Admin ise içeriği göster
  return <>{children}</>;
};

export default AdminRoute; 