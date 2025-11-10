import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { X, Mail, CheckCircle } from 'lucide-react';

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  email: string;
}

const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({
  isOpen,
  onClose,
  userId,
  email
}) => {
  const { t } = useTranslation();
  // verifyEmail yerine email tabanlı doğrulamayı kullan
  const { verifyEmailByEmail, isLoading } = useAuth() as any;
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 dakika

  useEffect(() => {
    if (isOpen && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isOpen, timeLeft]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!code) {
      setError(t('auth.enterVerificationCode'));
      return;
    }

    if (code.length !== 6) {
      setError(t('auth.code6digits'));
      return;
    }

    // Email tabanlı doğrulama çağrısı
    const result = await verifyEmailByEmail(email, code);
    
    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        onClose();
        window.location.href = '/dashboard';
      }, 2000);
    } else {
      setError(result.error || t('auth.verificationFailed'));
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">{t('auth.emailVerificationTitle')}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-gray-900 mb-2">{t('auth.verificationSuccess')}</h4>
            <p className="text-gray-600">{t('auth.accountVerified')}</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <Mail className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{t('auth.verificationCodeSentTitle')}</h4>
              <p className="text-gray-600 mb-2">
                <strong>{email}</strong> {t('auth.verificationCodeSent')}
              </p>
              <p className="text-sm text-gray-500">
                {t('auth.codeValidTime')} <span className="font-mono">{formatTime(timeLeft)}</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="verification-code" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('auth.verificationCodeLabel')}
                </label>
                <input
                  id="verification-code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg font-mono"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={isLoading || timeLeft === 0}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                >
                  {isLoading ? t('auth.verifying') : t('auth.verify')}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                >
                  {t('auth.cancel')}
                </button>
              </div>
            </form>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                {t('auth.codeNotReceived')}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EmailVerificationModal;