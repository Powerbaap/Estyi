import React, { useState, useEffect, useRef, memo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, Settings, Bell, DollarSign, Building, X, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getUserRole } from '../../utils/auth';
import { useTranslation } from 'react-i18next';
import { scrollToTopInstant } from '../../utils/scrollUtils';
import Logo from './Logo';
import LanguageSwitcher from './LanguageSwitcher';
import ClinicNotificationCenter from '../Notifications/ClinicNotificationCenter';
import { useNotifications } from '../../hooks/useNotifications';
import type { NotificationItem } from '../../services/notificationsService';

// Bildirimler artık ortak hook ve servis üzerinden yönetiliyor

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { notifications, markAsRead, unreadCount } = useNotifications();
  const [isClinicNotificationOpen, setIsClinicNotificationOpen] = useState(false);
  
  const userRole = getUserRole(user);

  // Ref'ler oluştur
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Bildirimler ortak hook tarafından yönetiliyor; burada mock/init yok

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // User menu için click outside
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      // Notification menu için click outside
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    };

    // Event listener ekle
    document.addEventListener('mousedown', handleClickOutside);
    
    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  // Bildirime tıklayınca ilgili sayfaya git
  const handleNotificationClick = (notification: NotificationItem) => {
    // Bildirimi okundu olarak işaretle
    markAsRead(notification.id);

    // Bildirim türüne göre yönlendirme
    switch (notification.type) {
      case 'offer':
        // Teklif bildirimleri için dashboard'a yönlendir
        navigate('/dashboard');
        break;
      case 'message':
        // Mesaj bildirimleri için mesajlar sayfasına yönlendir
        navigate('/messages');
        break;
      case 'payment':
        // Ödeme bildirimleri için dashboard'a yönlendir
        navigate('/dashboard');
        break;
      case 'system':
        // Sistem bildirimleri için dashboard'a yönlendir
        navigate('/dashboard');
        break;
      default:
        // Varsayılan olarak dashboard'a yönlendir
        navigate('/dashboard');
    }

    // Bildirim panelini kapat
    setIsNotificationOpen(false);
  };

  const getDashboardPath = () => {
    switch (userRole) {
      case 'user': return '/dashboard';
      case 'clinic': return '/clinic-dashboard';
      case 'admin': return '/admin/dashboard';
      default: return '/';
    }
  };

  const getNotificationIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'offer':
        return <DollarSign className="w-4 h-4 text-green-600" />;
      case 'message':
        return <Bell className="w-4 h-4 text-blue-600" />;
      case 'payment':
        return <DollarSign className="w-4 h-4 text-yellow-600" />;
      case 'system':
        return <Bell className="w-4 h-4 text-gray-600" />;
      default:
        return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return t('common.loading');
    if (minutes < 60) return `${minutes} ${t('common.minutes')} ${t('common.ago')}`;
    if (hours < 24) return `${hours} ${t('common.hours')} ${t('common.ago')}`;
    if (days < 7) return `${days} ${t('common.days')} ${t('common.ago')}`;
    return date.toLocaleDateString();
  };

  // Unread count ortak hook'tan geliyor

  return (
    <React.Fragment>
      <header className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-200/50 sticky top-0 z-50" role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 hover:opacity-80 transition-all duration-300 hover:scale-105 group"
            onClick={scrollToTopInstant}
            aria-label="Estyi ana sayfasına git"
          >
            <div className="group-hover:rotate-12 transition-transform duration-300">
              <Logo />
            </div>
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent drop-shadow-lg">Estyi</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6" role="navigation" aria-label="Ana navigasyon">
            {user ? (
              <>
                {/* Messages Link */}
                <Link
                  to="/messages"
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300 relative group"
                  onClick={scrollToTopInstant}
                >
                  <svg className="w-4 h-4 text-gray-600 group-hover:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-purple-700 transition-colors">{t('common.messages')}</span>
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></span>
                </Link>

                {/* Notifications Dropdown */}
                <div className="relative" ref={notificationRef}>
                  <button
                    onClick={() => {
                      if (getUserRole(user) === 'clinic') {
                        setIsClinicNotificationOpen(true);
                      } else {
                        setIsNotificationOpen(!isNotificationOpen);
                      }
                    }}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300 relative group"
                    aria-label={`${t('common.notifications')}${unreadCount > 0 ? `, ${unreadCount} ${t('common.unread')}` : ''}`}
                    aria-expanded={isNotificationOpen}
                    aria-haspopup="true"
                  >
                    <Bell className="w-4 h-4 text-gray-600 group-hover:text-purple-600 transition-colors" />
                    <span className="text-sm font-medium text-gray-700 group-hover:text-purple-700 transition-colors">{t('common.notifications')}</span>
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[18px] flex items-center justify-center animate-bounce">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  {isNotificationOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 py-2 z-50 max-h-96 overflow-y-auto">
                      {/* Header */}
                      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-900">{t('common.notifications')}</h3>
                        <button
                          onClick={() => setIsNotificationOpen(false)}
                          className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <X className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>

                      {/* Notifications List */}
                      <div className="py-2">
                        {notifications.length === 0 ? (
                          <div className="px-4 py-8 text-center text-gray-500">
                            <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">{t('common.noNotifications')}</p>
                          </div>
                        ) : (
                          notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`px-4 py-3 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 cursor-pointer border-l-4 transition-all duration-300 ${
                                notification.isRead ? 'border-gray-200' : 'border-gradient-to-b from-purple-500 to-pink-500'
                              }`}
                              onClick={() => handleNotificationClick(notification)}
                            >
                              <div className="flex items-start space-x-3">
                                <div className="mt-1">
                                  {getNotificationIcon(notification.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-1">
                                    <h4 className={`text-sm font-medium ${
                                      notification.isRead ? 'text-gray-700' : 'text-gray-900'
                                    }`}>
                                      {notification.title}
                                    </h4>
                                    <span className="text-xs text-gray-500">
                                      {formatTime(notification.timestamp)}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-600 leading-relaxed">
                                    {notification.message}
                                  </p>
                                  
                                  {/* Teklif detayları */}
                                  {notification.type === 'offer' && notification.clinicName && (
                                    <div className="mt-2 p-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                                      <div className="flex items-center space-x-2">
                                        <Building className="w-3 h-3 text-green-600" />
                                        <span className="text-xs font-medium text-green-800">
                                          {notification.clinicName}
                                        </span>
                                      </div>
                                      {notification.offerAmount && (
                                        <div className="mt-1 text-xs text-green-700">
                                          Teklif: ${notification.offerAmount.toLocaleString()}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Footer */}
                      {notifications.length > 0 && (
                        <div className="px-4 py-2 border-t border-gray-100">
                          <Link
                            to="/notifications"
                            className="text-xs text-purple-600 hover:text-purple-700 font-medium transition-colors"
                            onClick={() => setIsNotificationOpen(false)}
                          >
                            {t('common.viewAllNotifications')}
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* User Menu */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300 group"
                  >
                    <User className="w-4 h-4 text-gray-600 group-hover:text-purple-600 transition-colors" />
                    <span className="text-sm font-medium text-gray-700 group-hover:text-purple-700 transition-colors">{user.user_metadata?.name || user.email}</span>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 py-2 z-50">
                      {/* Admin Panel Link - Sadece admin kullanıcıları için */}
                      {getUserRole(user) === 'admin' && (
                        <>
                          <Link
                            to="/admin/dashboard"
                            className="flex items-center space-x-3 px-4 py-2 text-sm text-purple-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 w-full text-left transition-all duration-300 rounded-lg mx-2 border-b border-gray-100 pb-2 mb-2"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Shield className="w-4 h-4" />
                            <span className="font-semibold">Admin Paneli</span>
                          </Link>
                          <Link
                            to="/admin/change-control"
                            className="flex items-center space-x-3 px-4 py-2 text-sm text-indigo-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 w-full text-left transition-all duration-300 rounded-lg mx-2 border-b border-gray-100 pb-2 mb-2"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Shield className="w-4 h-4" />
                            <span className="font-semibold">{t('auth.clinic')} {t('common.dashboard')}</span>
                          </Link>
                        </>
                      )}
                      
                      <Link
                        to={getDashboardPath()}
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 w-full text-left transition-all duration-300 rounded-lg mx-2"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>{t('common.dashboard')}</span>
                      </Link>
                      <Link
                        to="/profile"
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 w-full text-left transition-all duration-300 rounded-lg mx-2"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span>{t('common.profile')}</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 w-full text-left transition-all duration-300 rounded-lg mx-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{t('auth.logout')}</span>
                      </button>
                    </div>
                  )}
                </div>

                <LanguageSwitcher />
              </>
            ) : (
              /* Auth Buttons */
              <div className="flex items-center space-x-4">
                <LanguageSwitcher />
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-purple-600 font-medium transition-all duration-300 hover:scale-105"
                  onClick={scrollToTopInstant}
                >
                  {t('auth.login')}
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-medium text-sm shadow-lg hover:shadow-xl transform hover:scale-105"
                  onClick={scrollToTopInstant}
                >
                  {t('auth.signup')}
                </Link>
                <Link
                  to="/clinic-application"
                  className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-4 py-2 rounded-xl hover:from-teal-600 hover:to-cyan-600 transition-all duration-300 font-medium text-sm shadow-lg hover:shadow-xl transform hover:scale-105"
                  onClick={scrollToTopInstant}
                >
                  {t('common.clinicApplication')}
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300"
            aria-label={isMenuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div id="mobile-menu" className="md:hidden py-4 border-t border-gray-200/50 bg-white/90 backdrop-blur-xl rounded-2xl mt-2" role="navigation" aria-label="Mobil navigasyon">
            <div className="flex flex-col space-y-4">
              {user ? (
                <>
                  <Link
                    to="/messages"
                    className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 rounded-xl transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>{t('common.messages')}</span>
                  </Link>
                  <Link
                    to={getDashboardPath()}
                    className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 rounded-xl transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    <span>{t('common.dashboard')}</span>
                  </Link>
                  <Link
                    to="/profile"
                    className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 rounded-xl transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings className="w-5 h-5" />
                    <span>Profil</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 rounded-xl transition-all duration-300 w-full text-left"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Çıkış Yap</span>
                  </button>
                </>
              ) : (
                /* Auth Buttons for Mobile */
                <div className="flex flex-col space-y-4">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 rounded-xl transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Giriş Yap
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Kayıt Ol
                  </Link>
                  <Link
                    to="/clinic-application"
                    className="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl hover:from-teal-600 hover:to-cyan-600 transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Klinik Başvurusu
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>

    {/* Clinic Notification Center */}
    {getUserRole(user) === 'clinic' && (
      <ClinicNotificationCenter
        isOpen={isClinicNotificationOpen}
        onClose={() => setIsClinicNotificationOpen(false)}
        clinicSpecialties={['Rhinoplasty', 'Hair Transplant', 'Breast Surgery']}
      />
    )}
    </React.Fragment>
  );
};

export default memo(Header);