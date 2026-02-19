import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { User, Session } from '@supabase/supabase-js';
import { getCurrentUserAccess, getUserRole } from '../utils/auth';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string, role?: 'user' | 'clinic' | 'admin') => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, role?: 'user' | 'clinic' | 'admin') => Promise<{ success: boolean; error?: string; userId?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
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

  useEffect(() => {
    let subscription: { unsubscribe?: () => void } | undefined;

    const initSession = async () => {
      try {
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

    initSession();

    const authChange = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
    });
    subscription = authChange?.data?.subscription;

    return () => {
      try {
        if (subscription?.unsubscribe) subscription.unsubscribe();
      } catch {}
    };
  }, []);

  const login = async (email: string, password: string, requestedRole?: 'user' | 'clinic' | 'admin') => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('[AUTH] signInWithPassword error', {
          message: error.message,
          details: (error as { details?: string }).details,
          hint: (error as { hint?: string }).hint,
          status: (error as { status?: number }).status,
        });
        return {
          success: false,
          error: 'Hesabınız yok veya şifre hatalı. Eğer klinik başvurusu yaptıysanız onay bekleyin.',
        };
      }

      const currentUser = data?.user ?? null;

      if (!currentUser) {
        return { success: false, error: 'Giriş yapılamadı. Lütfen tekrar deneyin.' };
      }

      const metaRole = getUserRole(currentUser);

      if (metaRole === 'clinic') {
        const access = await getCurrentUserAccess(currentUser);
        if (access.role === 'clinic' && !access.isClinicApproved) {
          try {
            await supabase.auth.signOut();
          } catch {}
          setSession(null);
          setUser(null);
          return {
            success: false,
            error: 'Başvurunuz incelemede. Onaylanmadan giriş yapılamaz.',
          };
        }
      }

      try {
        await supabase.from('users').upsert(
          {
            id: currentUser.id,
            email,
            role: getUserRole(currentUser),
            is_verified: true,
          },
          { onConflict: 'id' }
        );
      } catch {}

      return { success: true };
    } catch (error) {
      const err = error as { message?: string; details?: string; hint?: string; status?: number };
      console.error('[AUTH] login exception', {
        message: err?.message,
        details: err?.details,
        hint: err?.hint,
        status: err?.status,
      });
      return { success: false, error: 'Giriş yapılırken bir hata oluştu' };
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);

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

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: role,
            name: email.split('@')[0],
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
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

  const logout = async () => {
    try {
      setIsLoading(true);

      try {
        localStorage.removeItem('estyi_user_access_cache');
      } catch {}

      try {
        localStorage.removeItem('clinic_id');
      } catch {}

      setSession(null);
      setUser(null);

      try {
        await supabase.auth.signOut();
      } catch {}
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
    signInWithGoogle,
    logout,
    resetPassword,
    isLoading,
    markMessageAsRead,
    getUnreadMessageCount,
    clearMessageNotifications,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
