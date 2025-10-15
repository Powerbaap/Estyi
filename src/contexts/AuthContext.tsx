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

  // Mock kullanıcılar kaldırıldı - artık sadece gerçek Supabase kullanıcıları kullanılıyor

  // Session'ı kontrol et
  useEffect(() => {
    const getSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const currentSession = data?.session ?? null;
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
      } catch (err) {
        setSession(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    return () => {
      try {
        subscription.unsubscribe();
      } catch {}
    };
  }, []);

  const login = async (email: string, password: string, requestedRole?: 'user' | 'clinic' | 'admin') => {
    try {
      setIsLoading(true);
      
      // Sadece Supabase authentication kullan
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
      // Ortam değişkenleri ön kontrol
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      if (!supabaseUrl || !supabaseAnonKey) {
        // Supabase env eksik ise doğrudan backend üzerinden kayıt fallback
        try {
          const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3005';
          const resp = await fetch(`${apiUrl}/api/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, role, name: email.split('@')[0] })
          });
          if (!resp.ok) {
            const err = await resp.json().catch(() => null);
            return { success: false, error: err?.error || 'Backend üzerinden kayıt başarısız' };
          }
          const result = await resp.json();
          if (result?.userId) {
            return { success: true, userId: result.userId };
          }
          return { success: false, error: 'Backend yanıtı beklenen formatta değil' };
        } catch (be) {
          const beMsg = ((be as any)?.message || '').toLowerCase();
          const beNet = beMsg.includes('fetch') || beMsg.includes('network');
          if (beNet) {
            return { success: false, error: 'Backend API bağlantısı sağlanamadı. Lütfen .env içindeki VITE_API_URL değerini ve backend sunucusunun çalıştığını kontrol edin.' };
          }
          return { success: false, error: 'Supabase env eksik ve backend fallback başarısız' };
        }
      }
      
      // Direkt Supabase ile kayıt ol
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: role,
            name: email.split('@')[0]
          }
        }
      });

      if (error) {
        const msg = (error.message || '').toLowerCase();
        const isNetwork = msg.includes('fetch') || msg.includes('network');
        if (isNetwork) {
          // Backend üzerinden kayıt fallback
          try {
            const configured = import.meta.env.VITE_API_URL;
            const local = 'http://localhost:3005';
            const primaryUrl = `${(configured || local)}/api/register`;
            let resp: Response | null = null;
            try {
              resp = await fetch(primaryUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, role, name: email.split('@')[0] })
              });
            } catch (_) {
              resp = null;
            }
            if (!resp || !resp.ok) {
              if (configured && configured !== local) {
                const fallbackResp = await fetch(`${local}/api/register`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email, password, role, name: email.split('@')[0] })
                });
                if (fallbackResp.ok) {
                  const result = await fallbackResp.json();
                  if (result?.userId) return { success: true, userId: result.userId };
                }
              }
            } else {
              const result = await resp.json();
              if (result?.userId) {
                return { success: true, userId: result.userId };
              }
            }
            return { success: false, error: 'Backend üzerinden kayıt başarısız' };
          } catch (be) {
            const beMsg = ((be as any)?.message || '').toLowerCase();
            const beNet = beMsg.includes('fetch') || beMsg.includes('network');
            if (beNet) {
              return { success: false, error: 'Backend API bağlantısı sağlanamadı. Lütfen .env içindeki VITE_API_URL değerini ve backend sunucusunun çalıştığını kontrol edin.' };
            }
            return { success: false, error: 'Supabase bağlantısı sağlanamadı ve backend fallback başarısız' };
          }
        }
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Users tablosuna da ekle
        const { error: dbError } = await supabase
          .from('users')
          .insert([
            {
              id: data.user.id,
              email: email,
              name: email.split('@')[0],
              role: role,
              is_verified: true, // Geçici olarak otomatik doğrulama
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ]);

        if (dbError) {
          console.error('Database insert error:', dbError);
          // Auth başarılı oldu ama DB'ye eklenemedi, yine de başarılı say
        }

        return { success: true, userId: data.user.id };
      }

      return { success: false, error: 'Kayıt olurken bir hata oluştu' };
    } catch (error) {
      console.error('Signup error:', error);
      const msg = ((error as any)?.message || '').toLowerCase();
      const isNetwork = msg.includes('fetch') || msg.includes('network');
      if (isNetwork) {
        return { success: false, error: 'Supabase bağlantısı sağlanamadı (Failed to fetch). Lütfen internet bağlantınızı ve .env içindeki VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY değerlerinin doğruluğunu kontrol edin.' };
      }
      return { success: false, error: 'Kayıt olurken bir hata oluştu' };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (userId: string, code: string) => {
    try {
      setIsLoading(true);
      
      // Backend API'sini kullanarak doğrulama yap
      const configured = import.meta.env.VITE_API_URL;
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
      const msg = ((error as any)?.message || '').toLowerCase();
      const isNetwork = msg.includes('fetch') || msg.includes('network');
      if (isNetwork) {
        return { success: false, error: 'Backend API bağlantısı sağlanamadı (Failed to fetch). Lütfen .env içindeki VITE_API_URL değerini ve backend sunucusunun çalıştığını kontrol edin.' };
      }
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