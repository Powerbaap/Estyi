import React, { useState, useEffect } from 'react';
import { Bell, X, Check, Trash2, Filter, DollarSign, MessageCircle, AlertCircle, Building, User, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface ClinicNotification {
  id: string;
  type: 'new_request' | 'offer_accepted' | 'offer_rejected' | 'message' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high';
  userId?: string;
  procedure?: string;
  offerAmount?: number;
  requestId?: string;
}

interface ClinicNotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  clinicSpecialties?: string[]; // Klinik uzmanlık alanları
}

const ClinicNotificationCenter: React.FC<ClinicNotificationCenterProps> = ({ 
  isOpen, 
  onClose, 
  clinicSpecialties = ['Rhinoplasty', 'Hair Transplant', 'Breast Surgery'] 
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<ClinicNotification[]>([]);

  // Mock kaldırıldı: API entegrasyonu geldiğinde burada gerçek fetch yapılacak
  useEffect(() => {
    setNotifications([]);
  }, [clinicSpecialties]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getNotificationIcon = (type: ClinicNotification['type']) => {
    switch (type) {
      case 'new_request':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'offer_accepted':
        return <Check className="w-5 h-5 text-green-600" />;
      case 'offer_rejected':
        return <X className="w-5 h-5 text-red-600" />;
      case 'message':
        return <MessageCircle className="w-5 h-5 text-purple-600" />;
      case 'system':
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: ClinicNotification['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-red-500 bg-red-50';
      case 'medium':
        return 'border-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-gray-500 bg-gray-50';
      default:
        return 'border-gray-300 bg-white';
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

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, isRead: true } : n
      )
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  // Bildirime tıklayınca ilgili sayfaya git
  const handleNotificationClick = (notification: ClinicNotification) => {
    // Bildirimi okundu olarak işaretle
    markAsRead(notification.id);

    // Bildirim türüne göre yönlendirme
    switch (notification.type) {
      case 'new_request':
        // Yeni talep bildirimleri için talepler sayfasına yönlendir
        navigate('/clinic-dashboard');
        break;
      case 'offer_accepted':
        // Teklif kabul bildirimleri için teklifler sayfasına yönlendir
        navigate('/clinic-dashboard');
        break;
      case 'offer_rejected':
        // Teklif red bildirimleri için teklifler sayfasına yönlendir
        navigate('/clinic-dashboard');
        break;
      case 'message':
        // Mesaj bildirimleri için mesajlar sayfasına yönlendir
        navigate('/clinic-dashboard');
        break;
      case 'system':
        // Sistem bildirimleri için dashboard'a yönlendir
        navigate('/clinic-dashboard');
        break;
      default:
        // Varsayılan olarak dashboard'a yönlendir
        navigate('/clinic-dashboard');
    }

    // Bildirim panelini kapat
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>
      {/* Notification Panel */}
      <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center">
              <Bell className="w-6 h-6 text-gray-600 mr-3" />
              <h2 className="text-xl font-bold text-gray-900">{t('common.notifications')}</h2>
              {unreadCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  {t('common.markAllRead')}
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <Bell className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-lg font-medium">{t('common.noNotifications')}</p>
                <p className="text-sm">{t('common.newNotificationsHere')}</p>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 rounded-xl border-l-4 ${getPriorityColor(notification.priority)} ${
                      notification.isRead ? 'bg-gray-50' : 'bg-white shadow-sm'
                    } transition-all duration-200 hover:shadow-md cursor-pointer`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={`text-sm font-semibold ${
                            notification.isRead ? 'text-gray-700' : 'text-gray-900'
                          }`}>
                            {notification.title}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">
                              {formatTime(notification.timestamp)}
                            </span>
                            {!notification.isRead && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(notification.id);
                                }}
                                className="text-xs text-blue-600 hover:text-blue-800"
                              >
                                <Check className="w-3 h-3" />
                              </button>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                              className="text-xs text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {notification.message}
                        </p>
                        
                        {/* Bildirim detayları */}
                        {notification.userId && (
                          <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <User className="w-3 h-3 text-blue-600" />
                              <span className="text-xs font-medium text-blue-800">
                                {notification.userId}
                              </span>
                            </div>
                            {notification.procedure && (
                              <div className="mt-1 text-xs text-blue-700">
                                {notification.procedure}
                              </div>
                            )}
                            {notification.offerAmount && (
                              <div className="mt-1 text-xs text-blue-700">
                                {t('common.offer')}: ${notification.offerAmount.toLocaleString()}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{notifications.length} {t('common.notifications')}</span>
              <button
                onClick={markAllAsRead}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                {t('common.markAllRead')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicNotificationCenter;