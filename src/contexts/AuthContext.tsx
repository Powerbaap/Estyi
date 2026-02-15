import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { User, Session } from '@supabase/supabase-js';
import { getCurrentUserAccess } from '../utils/auth';

const offline = import.meta.env.VITE_OFFLINE_MODE === 'true';

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
          if (currentSession?.user) {
            const access = await getCurrentUserAccess(currentSession.user);
            if (access.role === 'clinic' && !access.isClinicApproved) {
              await supabase.auth.signOut();
              setSession(null);
              setUser(null);
            } else {
              setSession(currentSession);
              setUser(currentSession.user ?? null);
            }
          } else {
            setSession(currentSession);
            setUser(currentSession?.user ?? null);
          }
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
            if (session?.user) {
              const access = await getCurrentUserAccess(session.user);
              if (access.role === 'clinic' && !access.isClinicApproved) {
                await supabase.auth.signOut();
                setSession(null);
                setUser(null);
                return;
              }
            }
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
        const currentUser = data?.user ?? null;
        if (currentUser) {
          const access = await getCurrentUserAccess(currentUser);
          if (access.role === 'clinic' && !access.isClinicApproved) {
            await supabase.auth.signOut();
            setSession(null);
            setUser(null);
            return { success: false, error: 'Başvurunuz incelemede. Onaylanmadan giriş yapılamaz.' };
          }
          try {
            await supabase.from('users').upsert(
              { id: currentUser.id, email, role: access.role, is_verified: true },
              { onConflict: 'id' }
            );
          } catch {}
        }
        return { success: true };
      }

      return { success: false, error: 'Hesabınız yok veya şifre hatalı. Eğer klinik başvurusu yaptıysanız onay bekleyin.' };
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
        const devId = 'DEV_' + Math.random().toString(36).substring(2, 10);
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
    clearMessageNotifications
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
