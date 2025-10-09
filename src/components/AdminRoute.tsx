import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserRole } from '../utils/auth';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();

  // Başlangıçta auth durumu yüklenirken bekle
  if (isLoading) {
    return null;
  }

  // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Kullanıcı admin değilse ana sayfaya yönlendir
  if (getUserRole(user) !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Admin ise içeriği göster
  return <>{children}</>;
};

export default AdminRoute;