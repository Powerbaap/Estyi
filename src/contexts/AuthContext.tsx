import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';
import { generateUserId, generateVerificationCode, saveVerificationCode, sendVerificationEmail, verifyCode } from '../lib/emailService';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string, role?: 'user' | 'clinic' | 'admin') => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, role?: 'user' | 'clinic' | 'admin') => Promise<{ success: boolean; error?: string; userId?: string }>;
  verifyEmail: (userId: string, code: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
  markMessageAsRead: (messageId: string) => void;
  getUnreadMessageCount: () => number;
  clearMessageNotifications: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [messageNotifications, setMessageNotifications] = useState<string[]>([]);

  // Mock admin kullanıcıları
  const adminUsers = [
    {
              email: 'admin@estyi.com',
      password: 'admin123',
      name: 'Admin User',
      role: 'admin' as const,
      id: 'admin-1',
      user_id: 'A1234567'
    },
    {
              email: 'system@estyi.com', 
      password: 'system123',
      name: 'System Admin',
      role: 'admin' as const,
      id: 'admin-2',
      user_id: 'S8765432'
    },
    {
      email: 'change_seeker_admin',
      password: 'seeker123456',
      name: 'Değişim Arayan Admin',
      role: 'admin' as const,
      id: 'admin-3',
      user_id: 'CSA123456'
    },
    {
      email: 'change_creator_admin',
      password: 'creator123456',
      name: 'Değişim Yaratan Admin',
      role: 'admin' as const,
      id: 'admin-4',
      user_id: 'CYA789012'
    }
  ];

  // Mock klinik kullanıcıları
  const mockClinics = [
    {
      email: 'info@istanbulestetik.com',
      password: 'clinic123',
      name: 'İstanbul Estetik Merkezi',
      role: 'clinic' as const,
      id: 'clinic-1',
      user_id: 'C8765432'
    },
    {
      email: 'info@hairworld.com',
      password: 'clinic456',
      name: 'Hair World İstanbul',
      role: 'clinic' as const,
      id: 'clinic-2',
      user_id: 'H1234567'
    },
    {
      email: 'test@user.com',
      password: 'test123456',
      name: 'Test Klinik',
      role: 'clinic' as const,
      id: 'clinic-3',
      user_id: 'TC123456'
    }
  ];

  // Mock normal kullanıcılar (Değişimi Arayan)
  const mockUsers = [
    {
      email: 'user@test.com',
      password: 'test123456',
      name: 'Test Kullanıcı',
      role: 'user' as const,
      id: 'user-1',
      user_id: 'TU123456'
    }
  ];

  // Session'ı kontrol et
  useEffect(() => {
    const getSession = async () => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string, requestedRole?: 'user' | 'clinic' | 'admin') => {
    try {
      setIsLoading(true);
      
      // Admin kullanıcı kontrolü
      const adminUser = adminUsers.find(u => u.email === email && u.password === password);
      if (adminUser) {
        const mockUser: User = {
          id: adminUser.id,
          email: adminUser.email,
          user_metadata: { name: adminUser.name, role: adminUser.role, user_id: adminUser.user_id },
          app_metadata: { role: adminUser.role },
          aud: 'authenticated',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          role: 'authenticated'
        } as User;
        setUser(mockUser);
        return { success: true };
      }

      // Kullanıcının seçtiği role'e göre kontrol et
      if (requestedRole === 'clinic') {
        // Klinik kullanıcı kontrolü
        const clinicUser = mockClinics.find(u => u.email === email && u.password === password);
        if (clinicUser) {
          const mockUser: User = {
            id: clinicUser.id,
            email: clinicUser.email,
            user_metadata: { name: clinicUser.name, role: clinicUser.role, user_id: clinicUser.user_id },
            app_metadata: { role: clinicUser.role },
            aud: 'authenticated',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            role: 'authenticated'
          } as User;
          setUser(mockUser);
          return { success: true };
        }
      } else {
        // Normal kullanıcı kontrolü (Değişimi Arayan)
        const normalUser = mockUsers.find(u => u.email === email && u.password === password);
        if (normalUser) {
          const mockUser: User = {
            id: normalUser.id,
            email: normalUser.email,
            user_metadata: { name: normalUser.name, role: normalUser.role, user_id: normalUser.user_id },
            app_metadata: { role: normalUser.role },
            aud: 'authenticated',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            role: 'authenticated'
          } as User;
          setUser(mockUser);
          return { success: true };
        }
      }

      // Supabase ile normal login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Giriş yapılırken bir hata oluştu' };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, role: 'user' | 'clinic' | 'admin' = 'user') => {
    try {
      setIsLoading(true);
      
      // Backend API'sini kullanarak kullanıcı kaydı
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role })
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.error || 'Kayıt olurken bir hata oluştu' };
      }

      const result = await response.json();
      
      if (result.success && result.userId) {
        // Verification kodu oluştur ve gönder
        const verificationCode = generateVerificationCode();
        await saveVerificationCode(result.userId, verificationCode);
        await sendVerificationEmail(email, verificationCode);

        return { success: true, userId: result.userId };
      }

      return { success: false, error: 'Kayıt olurken bir hata oluştu' };
    } catch (error) {
      return { success: false, error: 'Kayıt olurken bir hata oluştu' };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (userId: string, code: string) => {
    try {
      setIsLoading(true);
      
      // Backend API'sini kullanarak doğrulama yap
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/verify-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, code })
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.error || 'Doğrulama başarısız' };
      }

      // Kullanıcıyı doğrulanmış olarak işaretle
      const { error } = await supabase
        .from('users')
        .update({ is_verified: true })
        .eq('id', userId);

      if (error) {
        return { success: false, error: 'Kullanıcı durumu güncellenemedi' };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Doğrulama işlemi başarısız' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
      }
      setUser(null);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Şifre sıfırlama emaili gönderilirken bir hata oluştu' };
    } finally {
      setIsLoading(false);
    }
  };

  const markMessageAsRead = (messageId: string) => {
    setMessageNotifications(prev => prev.filter(id => id !== messageId));
  };

  const getUnreadMessageCount = () => {
    return messageNotifications.length;
  };

  const clearMessageNotifications = () => {
    setMessageNotifications([]);
  };

  const value: AuthContextType = {
    user,
    session,
    login,
    signup,
    verifyEmail,
    logout,
    resetPassword,
    isLoading,
    markMessageAsRead,
    getUnreadMessageCount,
    clearMessageNotifications
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};