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
    const getSession = async () => {
      try {
        if (offline) {
          const raw = localStorage.getItem('estyi_offline_user');
          if (raw) {
            try { setUser(JSON.parse(raw)); } catch {}
          }
          setSession(null);
          setIsLoading(false);
          return;
        }
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
        if (offline) {
          return;
        }
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
      // Önce Supabase ile normal giriş dene
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error) {
        return { success: true };
      }

      // Başarısızsa ve admin e-postası ise backend üzerinden admin provision fallback dene
      const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || '')
        .split(',')
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);
      const isAdminEmail = !!email && adminEmails.includes(email.toLowerCase());

      if (isAdminEmail) {
        try {
          const apiUrl = import.meta.env.VITE_API_URL;
          if (apiUrl && apiUrl.startsWith('http')) {
            const resp = await fetch(`${apiUrl}/api/admin/provision`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password, name: email.split('@')[0] })
            });

            if (resp.ok) {
              // Provision sonrası tekrar giriş dene
              const retry = await supabase.auth.signInWithPassword({ email, password });
              if (!retry.error) {
                return { success: true };
              }
            }
          }
        } catch (be) {
          // Backend erişilemiyorsa sessizce devam et
        }
      }

      // Hala başarısız ise hata dön
      return { success: false, error: error?.message || 'Geçersiz e-posta veya şifre' };
    } catch (error) {
      return { success: false, error: 'Giriş yapılırken bir hata oluştu' };
    } finally {
      setIsLoading(false);
    }
  };

  const triggerVerificationEmail = async (email: string) => {
    try {
      if (offline) {
        return true;
      }
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3005';
      const resp = await fetch(`${apiUrl}/api/send-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (!resp.ok) {
        return false;
      }
      return true;
    } catch {
      return false;
    }
  };

  const signup = async (email: string, password: string, role: 'user' | 'clinic' | 'admin' = 'user') => {
    try {
      setIsLoading(true);
      if (offline) {
        const devId = generateUserId();
        await supabase.from('users').insert({ id: devId, email, role });
        await triggerVerificationEmail(email);
        return { success: true, userId: devId };
      }
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
            // Kayıttan hemen sonra doğrulama e-postası gönder
            await triggerVerificationEmail(email);
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
        const isAlreadyExists = (msg.includes('already') && (msg.includes('exists') || msg.includes('registered')));

        // E-posta zaten kayıtlı ise kullanıcı dostu mesaj ver
        if (isAlreadyExists) {
          return { success: false, error: 'Bu e-posta zaten kayıtlı. Lütfen giriş yapın.' };
        }

        // Hata ne olursa olsun (ağ/DB/diğer), backend üzerinden kayıt fallback dene
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
                if (result?.userId) {
                  await triggerVerificationEmail(email);
                  return { success: true, userId: result.userId };
                }
              }
            } else {
              // Yerel backend mevcut değil
              const errJson = await (resp ? resp.json().catch(() => null) : Promise.resolve(null));
              return { success: false, error: errJson?.error || 'Backend üzerinden kayıt başarısız' };
            }
          } else {
            const result = await resp.json();
            if (result?.userId) {
              await triggerVerificationEmail(email);
              return { success: true, userId: result.userId };
            }
          }
          return { success: false, error: 'Backend üzerinden kayıt başarısız' };
        } catch (be) {
          const beMsg = ((be as any)?.message || '').toLowerCase();
          const beNet = beMsg.includes('fetch') || beMsg.includes('network') || beMsg.includes('timeout');
          if (beNet) {
            return { success: false, error: 'Backend API bağlantısı sağlanamadı. Lütfen .env içindeki VITE_API_URL değerini ve backend sunucusunun çalıştığını kontrol edin.' };
          }
          return { success: false, error: 'Supabase bağlantısı sağlanamadı ve backend fallback başarısız' };
        }
      }

      // Başarılı supabase kaydı
      const newUserId = data?.user?.id;
      if (newUserId) {
        await triggerVerificationEmail(email);
        return { success: true, userId: newUserId };
      }
      return { success: false, error: 'Beklenmeyen hata: kullanıcı ID alınamadı' };
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
    verifyEmail,
    // Yeni: email ile doğrulamayı dışa aç
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