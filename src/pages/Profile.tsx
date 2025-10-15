import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserRole } from '../utils/auth';
import { useTranslation } from 'react-i18next';
import { User, Save, Edit, Mail, Shield } from 'lucide-react';
import { requestService } from '../services/api';

// Güvenli çeviri fallback metinleri (bileşen dışında sabit)
const profileFallbackTexts: Record<string, Record<string, string>> = {
  'profile.user': {
    tr: 'Kullanıcı',
    en: 'User',
    ar: 'مستخدم'
  },
  'profile.patient': {
    tr: 'Hasta',
    en: 'Patient',
    ar: 'مريض'
  },
  'profile.clinic': {
    tr: 'Klinik',
    en: 'Clinic',
    ar: 'عيادة'
  },
  'profile.totalRequests': {
    tr: 'Toplam Talepler',
    en: 'Total Requests',
    ar: 'إجمالي الطلبات'
  },
  'profile.receivedOffers': {
    tr: 'Alınan Teklifler',
    en: 'Received Offers',
    ar: 'العروض المستلمة'
  },
  'profile.memberSince': {
    tr: 'Üyelik Tarihi',
    en: 'Member Since',
    ar: 'عضو منذ'
  },
  'profile.location': {
    tr: 'Konum',
    en: 'Location',
    ar: 'الموقع'
  },
  'profile.locationPlaceholder': {
    tr: 'Şehir, ülke',
    en: 'City, country',
    ar: 'المدينة، الدولة'
  },
  'profile.security': {
    tr: 'Güvenlik',
    en: 'Security',
    ar: 'الأمان'
  },
  'profile.changePassword': {
    tr: 'Şifreyi Değiştir',
    en: 'Change Password',
    ar: 'تغيير كلمة المرور'
  },
  'profile.changePasswordDesc': {
    tr: 'Hesap güvenliğiniz için güçlü bir şifre kullanın.',
    en: 'Use a strong password for your account security.',
    ar: 'استخدم كلمة مرور قوية لأمان حسابك.'
  },
  'profile.twoFactor': {
    tr: 'İki Aşamalı Doğrulama',
    en: 'Two-Factor Authentication',
    ar: 'المصادقة الثنائية'
  },
  'profile.twoFactorDesc': {
    tr: 'Hesabınızı ekstra güvenlik katmanı ile koruyun.',
    en: 'Protect your account with an extra security layer.',
    ar: 'قم بحماية حسابك بطبقة أمان إضافية.'
  }
};

const Profile: React.FC = () => {
  const { t, ready, i18n } = useTranslation();
  const safeTranslate = (key: string) => {
    if (ready) {
      const translation = t(key);
      if (translation && translation !== key) {
        return translation;
      }
    }
    const currentLang = i18n.language || 'tr';
    const fallback = profileFallbackTexts[key];
    if (fallback && (fallback as any)[currentLang]) return (fallback as any)[currentLang];
    if (fallback && fallback.tr) return fallback.tr;
    return key;
  };
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    email: user?.email || '',
    gender: user?.gender || '',
    location: user?.location || '',
    avatar: user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  });

  // Dinamik istatistikler
  const [totalRequests, setTotalRequests] = useState<number>(0);
  const [receivedOffers, setReceivedOffers] = useState<number>(0);
  const [memberSince, setMemberSince] = useState<string>('');

  useEffect(() => {
    // Üyelik tarihini Supabase kullanıcısından al
    try {
      if (user?.created_at) {
        const dateStr = new Date(user.created_at).toLocaleDateString(i18n.language || 'tr-TR');
        setMemberSince(dateStr);
      } else {
        setMemberSince('—');
      }
    } catch {
      setMemberSince('—');
    }
  }, [user, i18n.language]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        if (!user?.id) {
          setTotalRequests(0);
          setReceivedOffers(0);
          return;
        }
        const reqs = await requestService.getUserRequests(user.id);
        const list = Array.isArray(reqs) ? reqs : [];
        setTotalRequests(list.length);
        const offersTotal = list.reduce((sum: number, r: any) => {
          const countFromField = typeof r.offersCount === 'number' ? r.offersCount : 0;
          const countFromArray = Array.isArray(r.offers) ? r.offers.length : 0;
          return sum + (countFromField || countFromArray);
        }, 0);
        setReceivedOffers(offersTotal);
      } catch (err) {
        setTotalRequests(0);
        setReceivedOffers(0);
      }
    };

    loadStats();
  }, [user]);

  const handleSave = () => {
    // Burada API çağrısı yapılacak
    setIsEditing(false);
  };

  // Profil fotoğrafı yükleme seçeneği kaldırıldı; mevcut avatar sadece görüntülenir

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('auth.login')}</h2>
          <p className="text-gray-600">{t('profile.title')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('profile.title')}</h1>
          <p className="text-gray-600 mt-2">{t('profile.personalInfo')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              {/* Avatar Section */}
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 mt-4">
                  {user?.name || safeTranslate('profile.user')}
                </h2>
                <p className="text-gray-600">{getUserRole(user) === 'user' ? safeTranslate('profile.patient') : safeTranslate('profile.clinic')}</p>
              </div>

              {/* Quick Stats */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">{safeTranslate('profile.totalRequests')}</span>
                  <span className="font-semibold text-gray-900">{totalRequests}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">{safeTranslate('profile.receivedOffers')}</span>
                  <span className="font-semibold text-gray-900">{receivedOffers}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">{safeTranslate('profile.memberSince')}</span>
                  <span className="font-semibold text-gray-900">{memberSince}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">{t('profile.personalInfo')}</h3>
                <div className="flex space-x-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        {t('profile.cancel')}
                      </button>
                      <button
                        onClick={handleSave}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        <span>{t('profile.save')}</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      <span>{t('profile.edit')}</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('profile.email')}
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('profile.gender')}
                  </label>
                  <select
                    value={profileData.gender}
                    onChange={(e) => setProfileData(prev => ({ ...prev, gender: e.target.value }))}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                  >
                    <option value="">{t('profile.selectGender')}</option>
                    <option value="male">{t('profile.male')}</option>
                    <option value="female">{t('profile.female')}</option>
                    <option value="other">{t('profile.other')}</option>
                  </select>
                </div>

                {/* Konum alanı kaldırıldı */}
              </div>

              {/* Security Section */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-blue-600" />
                  {safeTranslate('profile.security')}
                </h4>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="font-medium text-gray-900">{safeTranslate('profile.changePassword')}</div>
                    <div className="text-sm text-gray-600">{safeTranslate('profile.changePasswordDesc')}</div>
                  </button>
                  <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="font-medium text-gray-900">{safeTranslate('profile.twoFactor')}</div>
                    <div className="text-sm text-gray-600">{safeTranslate('profile.twoFactorDesc')}</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;