import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, Mail } from 'lucide-react';

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

        <div className="text-center mb-6">
          <Mail className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">{t('auth.verificationCodeSentTitle')}</h4>
          <p className="text-gray-600 mb-2">
            <strong>{email}</strong> adresine doğrulama linki gönderdik.
          </p>
          <p className="text-sm text-gray-500">
            Lütfen e-postandaki bağlantıya tıklayarak hesabını doğrula. Doğrulama sonrası otomatik yönlendirileceksin.
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Tamam
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationModal;
