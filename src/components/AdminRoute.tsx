import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getCurrentUserRole, type UserRole } from '../utils/auth';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const [role, setRole] = useState<UserRole>('user');
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const resolveRole = async () => {
      if (!user) {
        if (active) {
          setRole('user');
          setRoleLoading(false);
        }
        return;
      }
      setRoleLoading(true);
      const resolved = await getCurrentUserRole(user);
      if (active) {
        setRole(resolved);
        setRoleLoading(false);
      }
    };
    resolveRole();
    return () => {
      active = false;
    };
  }, [user]);

  // Başlangıçta auth durumu yüklenirken bekle
  if (isLoading || roleLoading) {
    return null;
  }

  // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Kullanıcı admin değilse ana sayfaya yönlendir
  if (role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Admin ise içeriği göster
  return <>{children}</>;
};

export default AdminRoute;
