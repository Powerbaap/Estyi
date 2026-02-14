import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';
import { generateUserId, generateVerificationCode, saveVerificationCode, sendVerificationEmail, verifyCode } from '../lib/emailService';

const offline = import.meta.env.VITE_OFFLINE_MODE === 'true';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string, role?: 'user' | 'clinic' | 'admin') => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, role?: 'user' | 'clinic' | 'admin') => Promise<{ success: boolean; error?: string; userId?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  verifyEmail: (userId: string, code: string) => Promise<{ success: boolean; error?: string }>;
  // Yeni: email ile doğrulama
  verifyEmailByEmail: (email: string, code: string) => Promise<{ success: boolean; error?: string; message?: string }>;
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

  // Mock kullanıcılar kaldırıldı - artık sadece gerçek Supabase kullanıcıları kullanılıyor

  // Session'ı kontrol et
  useEffect(() => {
    let subscription: { unsubscribe?: () => void } | undefined;
    try {
      const getSession = async () => {
        try {
          if (offline) {
            const raw = localStorage.getItem('estyi_offline_user');
            if (raw) {
              try { setUser(JSON.parse(raw)); } catch { /* ignore */ }
            }
            setSession(null);
            setIsLoading(false);
            return;
          }
          const { data } = await supabase.auth.getSession();
          const currentSession = data?.session ?? null;
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
        } catch {
          setSession(null);
          setUser(null);
        } finally {
          setIsLoading(false);
        }
      };

      getSession();

      const authChange = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          if (offline) return;
          try {
            setSession(session);
            setUser(session?.user ?? null);
          } catch { /* ignore */ }
          setIsLoading(false);
        }
      );
      subscription = authChange?.data?.subscription;
    } catch {
      setIsLoading(false);
      setSession(null);
      setUser(null);
    }

    return () => {
      try {
        if (subscription?.unsubscribe) subscription.unsubscribe();
      } catch { /* ignore */ }
    };
  }, []);

  const login = async (email: string, password: string, requestedRole?: 'user' | 'clinic' | 'admin') => {
    try {
      setIsLoading(true);
      
      if (offline) {
        const devUser: any = {
          id: 'DEV_' + Math.random().toString(36).substring(2, 10),
          email,
          user_metadata: { role: requestedRole || 'user', name: email.split('@')[0] }
        };
        setUser(devUser);
        try { localStorage.setItem('estyi_offline_user', JSON.stringify(devUser)); } catch {}
        return { success: true };
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error) {
        return { success: true };
      }

      return { success: false, error: error?.message || 'Geçersiz e-posta veya şifre' };
    } catch (error) {
      return { success: false, error: 'Giriş yapılırken bir hata oluştu' };
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      if (offline) {
        const devUser: any = {
          id: 'DEV_GOOGLE_' + Math.random().toString(36).substring(2, 10),
          email: 'google-user@example.com',
          user_metadata: { role: 'user', name: 'Google User' }
        };
        setUser(devUser);
        return { success: true };
      }
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Google ile giriş yapılırken bir hata oluştu' };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, role: 'user' | 'clinic' | 'admin' = 'user') => {
    try {
      setIsLoading(true);
      if (offline) {
        const devId = generateUserId();
        setUser({ id: devId, email, user_metadata: { role, name: email.split('@')[0] } } as any);
        return { success: true, userId: devId };
      }
      
      // Direkt Supabase ile kayıt ol
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: role,
            name: email.split('@')[0]
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        const msg = (error.message || '').toLowerCase();
        if (msg.includes('already') && (msg.includes('exists') || msg.includes('registered'))) {
          return { success: false, error: 'Bu e-posta zaten kayıtlı. Lütfen giriş yapın.' };
        }
        return { success: false, error: error.message };
      }

      if (data?.user) {
        return { success: true, userId: data.user.id };
      }
      return { success: false, error: 'Beklenmeyen hata: kullanıcı oluşturulamadı' };
    } catch (error) {
      return { success: false, error: 'Kayıt olurken bir hata oluştu' };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (userId: string, code: string) => {
    try {
      setIsLoading(true);
      if (offline) {
        return { success: true };
      }
      const configured = (import.meta as any).env.VITE_API_BASE_URL || (import.meta as any).env.VITE_API_URL;
      const local = 'http://localhost:3005';
      const primaryUrl = `${(configured || local)}/api/verify-code`;
      let response: Response | null = null;
      try {
        response = await fetch(primaryUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, code })
        });
      } catch (_) {
        response = null;
      }
      if (!response || !response.ok) {
        if (configured && configured !== local) {
          const fallbackResp = await fetch(`${local}/api/verify-code`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, code })
          });
          if (!fallbackResp.ok) {
            const errorData = await fallbackResp.json().catch(() => ({} as any));
            return { success: false, error: errorData.error || 'Doğrulama başarısız' };
          }
          response = fallbackResp;
        } else {
          const errorData = await (response ? response.json() : Promise.resolve({} as any)).catch(() => ({} as any));
          return { success: false, error: errorData.error || 'Doğrulama başarısız' };
        }
      }

      await response.json().catch(() => ({} as any));
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Doğrulama sırasında hata oluştu' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      if (offline) {
        try { localStorage.removeItem('estyi_offline_user'); } catch {}
        setSession(null);
        setUser(null);
        return;
      }
      const { error } = await supabase.auth.signOut();
      if (error) {
      }
      setSession(null);
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

  const verifyEmailByEmail = async (email: string, code: string) => {
    try {
      setIsLoading(true);
      if (offline) {
        return { success: true, message: 'OFFLINE: Doğrulama varsayılan olarak başarılı.' };
      }
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3005';
      const resp = await fetch(`${apiUrl}/api/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });
      if (!resp.ok) {
        const err = await resp.json().catch(() => null);
        return { success: false, error: err?.error || 'Doğrulama başarısız' };
      }
      const result = await resp.json();
      return { success: true, message: result?.message || 'Doğrulama başarılı' };
    } catch (error) {
      return { success: false, error: 'Doğrulama sırasında hata oluştu' };
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    session,
    login,
    signup,
    signInWithGoogle,
    verifyEmail,
    verifyEmailByEmail,
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
