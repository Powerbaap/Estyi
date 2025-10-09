import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { 
  User, 
  LogOut, 
  Settings, 
  Bell, 
  MessageSquare, 
  X,
  Shield
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../hooks/useNotifications';
import type { NotificationItem } from '../../services/notificationsService';

// Admin bildirimleri artık ortak hook’tan geliyor (type seti farklı olabilir)

interface Message {
  id: string;
  from: string;
  subject: string;
  preview: string;
  time: string;
  isRead: boolean;
}

const AdminHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const { notifications, markAsRead, unreadCount } = useNotifications();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      from: 'Sistem Yöneticisi',
      subject: 'Günlük Rapor',
      preview: 'Bugünkü sistem aktiviteleri raporu hazırlandı.',
      time: '30 dakika önce',
      isRead: false
    },
    {
      id: '2',
      from: 'Teknik Destek',
      subject: 'Bakım Bildirimi',
      preview: 'Planlı bakım işlemleri hakkında bilgilendirme.',
      time: '2 saat önce',
      isRead: true
    }
  ]);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
      if (messageRef.current && !messageRef.current.contains(event.target as Node)) {
        setIsMessageOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const markNotificationAsRead = (id: string) => {
    markAsRead(id);
  };

  const markMessageAsRead = (id: string) => {
    setMessages(prev => 
      prev.map(message => 
        message.id === id ? { ...message, isRead: true } : message
      )
    );
  };

  const unreadNotifications = unreadCount;
  const unreadMessages = messages.filter(m => !m.isRead).length;

  const getNotificationIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'offer':
        return <div className="w-2 h-2 bg-green-500 rounded-full"></div>;
      case 'message':
        return <div className="w-2 h-2 bg-blue-500 rounded-full"></div>;
      case 'payment':
        return <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>;
      case 'system':
        return <div className="w-2 h-2 bg-gray-500 rounded-full"></div>;
      default:
        return <div className="w-2 h-2 bg-gray-500 rounded-full"></div>;
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

  const getNotificationColor = (type: NotificationItem['type']) => {
    switch (type) {
      case 'message':
        return 'border-l-blue-500';
      case 'offer':
        return 'border-l-green-500';
      case 'payment':
        return 'border-l-yellow-500';
      case 'system':
        return 'border-l-gray-500';
      default:
        return 'border-l-gray-500';
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo ve Başlık */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
                <p className="text-sm text-gray-600">Sistem Yönetimi</p>
              </div>
            </div>
          </div>

          {/* Sağ Menü */}
          <div className="flex items-center space-x-4">
            {/* Mesajlar */}
            <div className="relative" ref={messageRef}>
              <button
                onClick={() => setIsMessageOpen(!isMessageOpen)}
                className="flex items-center space-x-2 px-2 sm:px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors relative"
              >
                <MessageSquare className="w-4 h-4 text-gray-600" />
                <span className="hidden sm:block text-sm text-gray-700">Mesajlar</span>
                {unreadMessages > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadMessages}
                  </span>
                )}
              </button>

              {/* Mesaj Dropdown */}
              {isMessageOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Mesajlar</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {messages.length > 0 ? (
                      messages.map((message) => (
                        <div
                          key={message.id}
                          className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                            !message.isRead ? 'bg-blue-50' : ''
                          }`}
                          onClick={() => markMessageAsRead(message.id)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-900">
                                  {message.from}
                                </span>
                                {!message.isRead && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                )}
                              </div>
                              <p className="text-sm font-medium text-gray-900 mt-1">
                                {message.subject}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {message.preview}
                              </p>
                              <p className="text-xs text-gray-500 mt-2">
                                {message.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        Mesaj bulunamadı
                      </div>
                    )}
                  </div>
                  <div className="p-4 border-t border-gray-200">
                    <button
                      onClick={() => navigate('/admin/messages')}
                      className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Tüm Mesajları Görüntüle
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bildirimler */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="flex items-center space-x-2 px-2 sm:px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors relative"
              >
                <Bell className="w-4 h-4 text-gray-600" />
                <span className="hidden sm:block text-sm text-gray-700">Bildirimler</span>
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </button>

              {/* Bildirim Dropdown */}
              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Bildirimler</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer border-l-4 ${getNotificationColor(notification.type)}`}
                          onClick={() => markNotificationAsRead(notification.id)}
                        >
                          <div className="flex items-start space-x-3">
                            {getNotificationIcon(notification.type)}
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-900">
                                  {notification.title}
                                </span>
                                {!notification.isRead && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-2">
                                {formatTime(notification.timestamp)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        Bildirim bulunamadı
                      </div>
                    )}
                  </div>
                  <div className="p-4 border-t border-gray-200">
                    <button
                      onClick={() => navigate('/admin/settings')}
                      className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Tüm Bildirimleri Görüntüle
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Admin Kullanıcı Menüsü */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 px-2 sm:px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.user_metadata?.name?.charAt(0) || 'A'}
                  </span>
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700">
                  {user?.user_metadata?.name || 'Admin'}
                </span>
              </button>

              {/* User Menu Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.user_metadata?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <button
                      onClick={() => navigate('/admin/settings')}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Ayarlar</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Çıkış Yap</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;