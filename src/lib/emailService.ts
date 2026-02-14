import { supabase } from './supabase';

const offline = import.meta.env.VITE_OFFLINE_MODE === 'true';

// 8 haneli kullanıcı ID'si oluştur
export const generateUserId = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// 6 haneli doğrulama kodu oluştur
export const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Doğrulama kodunu veritabanına kaydet
export const saveVerificationCode = async (userId: string, code: string): Promise<void> => {
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 15); // 15 dakika geçerli

  const { error } = await supabase
    .from('verification_codes')
    .insert({
      user_id: userId,
      code,
      expires_at: expiresAt.toISOString()
    });

  if (error) {
    throw new Error('Doğrulama kodu kaydedilemedi');
  }
};

// Email gönderme fonksiyonu — kaldırıldı (Supabase email doğrulama linki kullanılıyor)
export const sendVerificationEmail = async (email: string, code: string): Promise<void> => {
  if (offline) {
    console.warn(`OFFLINE: Doğrulama kodu ${code} ${email} adresine gönderilmiş varsayılıyor.`);
    return;
  }
  console.warn('Email gönderimi client üzerinden devre dışı.');
};

// Doğrulama kodunu kontrol et
export const verifyCode = async (userId: string, code: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('verification_codes')
      .select('*')
      .eq('user_id', userId)
      .eq('code', code)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (error || !data) {
      return false;
    }

    // Kullanılan kodu sil
    await supabase
      .from('verification_codes')
      .delete()
      .eq('id', data.id);

    return true;
  } catch (error) {
    return false;
  }
};

// Email ile doğrulama kodu gönder
export const sendVerificationCodeByEmail = async (email: string): Promise<void> => {
  const code = generateVerificationCode();
  
  // Önce kullanıcıyı bul
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  if (userError || !user) {
    if (offline) {
      // OFFLINE: kullanıcıyı dev store'a ekleyip devam edelim
      const devId = generateUserId();
      await supabase.from('users').insert({ id: devId, email });
      await saveVerificationCode(devId, code);
      console.warn(`OFFLINE: ${email} için doğrulama kodu ${code} üretildi.`);
      return;
    }
    throw new Error('Kullanıcı bulunamadı');
  }

  // Kodu kaydet
  await saveVerificationCode(user.id, code);
  
  // Email gönder
  await sendVerificationEmail(email, code);
};
