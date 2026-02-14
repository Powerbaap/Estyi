import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, User } from 'lucide-react';
import { scrollToTopInstant } from '../../utils/scrollUtils';
import Logo from '../../components/Layout/Logo';
import EmailVerificationModal from '../../components/Auth/EmailVerificationModal';
import { logLegalAcceptance } from '../../services/legalAcceptance';

const Signup: React.FC = () => {
  const { t } = useTranslation();
  const { signup, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user' as 'user' | 'clinic'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationData, setVerificationData] = useState<{ userId: string; email: string } | null>(null);
  const [diagnostic, setDiagnostic] = useState<{ ok: boolean; message: string } | null>(null);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError(t('signup.passwordMismatch'));
      return;
    }

    if (formData.password.length < 6) {
      setError(t('signup.passwordLength'));
      return;
    }

    const result = await signup(formData.email, formData.password, formData.role);

    if (result.success && result.userId) {
      try {
        await logLegalAcceptance('user', result.userId, 'tos');
        await logLegalAcceptance('user', result.userId, 'privacy');
        await logLegalAcceptance('user', result.userId, 'notice_at_collection');
        await logLegalAcceptance('user', result.userId, 'explicit_consent');
        await logLegalAcceptance('user', result.userId, 'age_gate');
      } catch (_) { /* non-blocking */ }
      setVerificationData({
        userId: result.userId,
        email: formData.email
      });
      setShowVerificationModal(true);
    } else {
      setError(result.error || t('signup.signupError'));
    }
  };

  const handleGoogleSignup = async () => {
    try {
      // Google signup functionality would be implemented here
    } catch (err) {
      setError(t('signup.googleSignupError'));
    }
  };

  // Supabase bağlantı tanılama
  const checkSupabaseConnectivity = async () => {
    try {
      setDiagnostic(null);
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      if (!supabaseUrl || !supabaseAnonKey) {
        setDiagnostic({ ok: false, message: 'ENV eksik: VITE_SUPABASE_URL veya VITE_SUPABASE_ANON_KEY tanımlı değil.' });
        return;
      }
      // Basit bir sağlık kontrolü: auth ayarlarını çekmeyi dene
      const resp = await fetch(`${supabaseUrl}/auth/v1/settings`, {
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`
        }
      });
      if (!resp.ok) {
        const text = await resp.text();
        setDiagnostic({ ok: false, message: `HTTP ${resp.status}: ${text || 'Supabase settings endpoint erişilemedi'}` });
        return;
      }
      const data = await resp.json().catch(() => null);
      setDiagnostic({ ok: true, message: `Bağlantı OK. Ayarlar çekildi: ${data ? 'auth settings alındı' : 'yanıt alındı'}.` });
    } catch (e: any) {
      const msg = (e?.message || '').toLowerCase();
      const isNetwork = msg.includes('fetch') || msg.includes('network');
      if (isNetwork) {
        setDiagnostic({ ok: false, message: 'Ağ hatası: Supabase domenine erişilemedi (Failed to fetch). DNS/Firewall/CORS kontrol edin.' });
      } else {
        setDiagnostic({ ok: false, message: `Hata: ${e?.message || 'bilinmeyen hata'}` });
      }
    }
  };

  // Sayfa yüklendiğinde en üste scroll yap
  React.useEffect(() => {
    scrollToTopInstant();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-3 mb-8" onClick={scrollToTopInstant}>
            <Logo size="lg" />
                            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Estyi</span>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {t('signup.title')}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {t('signup.haveAccount')}{' '}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              onClick={scrollToTopInstant}
            >
              {t('signup.loginHere')}
            </Link>
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm py-10 px-8 shadow-2xl rounded-3xl border border-white/20">
          {import.meta.env.VITE_OFFLINE_MODE === 'true' && (
            <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-sm text-yellow-800">
              Offline geliştirme modu: Mock verilerle çalışıyorsunuz; gerçek bağlantılar kapalı.
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Role Selection — Sadece Değişim Arayan kayıt olabilir */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                {t('login.selectAccountType')}
              </label>
              <div className="flex justify-center">
                <div className="p-4 rounded-2xl border-2 border-blue-500 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg w-full max-w-xs">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="text-sm font-bold">{t('auth.patient')}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {t('login.email')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder={t('login.emailPlaceholder')}
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {t('login.password')}
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder={t('signup.passwordPlaceholder')}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                {t('signup.confirmPassword')}
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder={t('signup.confirmPasswordPlaceholder')}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Legal clickwrap — tek onay: Şartlar ve Politikalar (/legal) */}
            <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  {t('legal.clickwrap.acceptAll')}{' '}
                  <a href="/legal" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">{t('legal.clickwrap.legalPage')}</a>
                </span>
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}

            {/* Diagnostic (Dev only) */}
            {import.meta.env.MODE !== 'production' && (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={checkSupabaseConnectivity}
                  className="w-full flex justify-center items-center px-4 py-2 border border-blue-300 rounded-md shadow-sm bg-blue-50 text-sm font-medium text-blue-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Supabase bağlantısını test et
                </button>
                {diagnostic && (
                  <div className={`text-sm text-center p-3 rounded-md ${diagnostic.ok ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'}`}>
                    {diagnostic.message}
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading || !acceptTerms}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? t('signup.signingUp') : t('signup.signupButton')}
              </button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">{t('login.or')}</span>
                </div>
              </div>

              {/* Google Signup Button */}
              <button
                type="button"
                onClick={handleGoogleSignup}
                className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {t('signup.signupWithGoogle')}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Email Verification Modal */}
      {verificationData && (
        <EmailVerificationModal
          isOpen={showVerificationModal}
          onClose={() => setShowVerificationModal(false)}
          userId={verificationData.userId}
          email={verificationData.email}
        />
      )}
    </div>
  );
};

export default Signup;