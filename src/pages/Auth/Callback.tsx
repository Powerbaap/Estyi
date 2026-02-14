import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

const AuthCallback: React.FC = () => {
  const [message, setMessage] = useState('Doğrulama yapılıyor...');

  useEffect(() => {
    let unsub: any;
    const run = async () => {
      try {
        // Önce mevcut session var mı bak
        const { data } = await supabase.auth.getSession();
        let session = data?.session || null;

        if (!session) {
          // Redirect’ten gelen token’ı yakalamak için auth state’i dinle
          const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
            if (s) {
              session = s;
              finalize(s);
            }
          });
          unsub = sub.subscription;
          // Kısa bir süre bekle, sonra tekrar dene
          setTimeout(async () => {
            const again = await supabase.auth.getSession();
            if (again.data?.session) {
              finalize(again.data.session);
            } else {
              setMessage('Oturum bulunamadı. Link süresi dolmuş olabilir.');
            }
          }, 800);
        } else {
          finalize(session);
        }
      } catch {
        setMessage('Doğrulama sırasında bir hata oluştu.');
      }
    };

    const finalize = async (s: any) => {
      try {
        const user = s?.user;
        if (user?.id && user?.email) {
          // İlk doğrulama/giriş sonrası users upsert
          await supabase.from('users').upsert(
            { id: user.id, email: user.email, role: 'user', is_verified: true },
            { onConflict: 'id' }
          );
        }
        setMessage('Başarılı! Yönlendiriliyorsunuz…');
        window.location.replace('/dashboard');
      } catch {
        setMessage('Doğrulama tamamlandı, ancak profil güncellemesi yapılamadı. Yine de yönlendiriliyorsunuz…');
        window.location.replace('/dashboard');
      }
    };

    run();
    return () => {
      try { unsub?.unsubscribe?.(); } catch {}
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center text-gray-700">{message}</div>
    </div>
  );
};

export default AuthCallback;
