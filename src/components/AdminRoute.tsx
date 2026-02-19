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
      let resolved;
      try {
        resolved = await Promise.race([
          getCurrentUserRole(user),
          new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000)),
        ]);
      } catch {
        const meta = (user as any)?.user_metadata || {};
        const email = (user.email || '').toLowerCase();
        resolved = email === 'admin@estyi.com' ? 'admin' : (meta.role || 'user');
      }
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
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
