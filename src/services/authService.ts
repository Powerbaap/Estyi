export const authService = {
  async sendVerificationCode(_email: string) {
    throw new Error('Kaldırıldı: Supabase email doğrulama linki kullanılıyor.');
  },
  async verifyCode(_email: string, _code: string) {
    throw new Error('Kaldırıldı: Supabase email doğrulama linki kullanılıyor.');
  }
};
