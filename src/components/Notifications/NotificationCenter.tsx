import React from 'react';
import { Bell, X, DollarSign, MessageCircle, AlertCircle, Calendar, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '../../hooks/useNotifications';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const {
    notifications,
    isLoading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'offer':
        return <DollarSign className="w-5 h-5 text-green-600" />;
      case 'message':
        return <MessageCircle className="w-5 h-5 text-blue-600" />;
      case 'appointment':
        return <Calendar className="w-5 h-5 text-purple-600" />;
      case 'review':
        return <Star className="w-5 h-5 text-yellow-600" />;
      case 'system':
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const formatTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const minutes = Math.floor(diff / (1000 * 60));
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));

      if (minutes < 1) return t('notifications.now', 'Now');
      if (minutes < 60) return `${minutes} ${t('notifications.minutesAgo', 'min ago')}`;
      if (hours < 24) return `${hours} ${t('notifications.hoursAgo', 'h ago')}`;
      if (days < 7) return `${days} ${t('notifications.daysAgo', 'd ago')}`;
      return date.toLocaleDateString(i18n.language || 'tr');
    } catch {
      return '';
    }
  };

  const handleNotificationClick = async (notification: { id: string; action_url?: string; type: string }) => {
    await markAsRead(notification.id);
    if (notification.action_url) {
      navigate(notification.action_url);
    } else {
      switch (notification.type) {
        case 'offer': navigate('/dashboard'); break;
        case 'message': navigate('/messages'); break;
        case 'appointment': navigate('/messages'); break;
        case 'review': navigate('/clinic-dashboard'); break;
        default: navigate('/dashboard');
      }
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center">
              <Bell className="w-6 h-6 text-gray-600 mr-3" />
              <h2 className="text-xl font-bold text-gray-900">{t('notifications.title', 'Notifications')}</h2>
              {unreadCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
                  {unreadCount}
                </span>
              )}
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-lg font-medium">{t('notifications.loading', 'Loading...')}</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <Bell className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-lg font-medium">{t('notifications.empty', 'No notifications')}</p>
                <p className="text-sm">{t('notifications.emptyHint', 'New notifications will appear here')}</p>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 rounded-xl border-l-4 ${
                      notification.is_read
                        ? 'border-gray-300 bg-gray-50'
                        : 'border-blue-500 bg-white shadow-sm'
                    } transition-all duration-200 hover:shadow-md cursor-pointer`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={`text-sm font-semibold ${
                            notification.is_read ? 'text-gray-700' : 'text-gray-900'
                          }`}>
                            {notification.title}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {formatTime(notification.created_at)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {notification.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{notifications.length} {t('notifications.count', 'notifications')}</span>
              <button
                onClick={markAllAsRead}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                {t('notifications.markAllRead', 'Mark all as read')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;
