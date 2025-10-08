import React, { useEffect } from 'react';
import { Bell, X, Check, Trash2, Filter, DollarSign, MessageCircle, AlertCircle, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../hooks/useNotifications';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const {
    notifications,
    isLoading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    requestNotificationPermission
  } = useNotifications();

  // Browser notification izni iste
  useEffect(() => {
    requestNotificationPermission();
  }, [requestNotificationPermission]);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'offer':
        return <DollarSign className="w-5 h-5 text-green-600" />;
      case 'message':
        return <MessageCircle className="w-5 h-5 text-blue-600" />;
      case 'payment':
        return <DollarSign className="w-5 h-5 text-yellow-600" />;
      case 'system':
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
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

    if (minutes < 1) return 'Şimdi';
    if (minutes < 60) return `${minutes} dk önce`;
    if (hours < 24) return `${hours} sa önce`;
    if (days < 7) return `${days} gün önce`;
    return date.toLocaleDateString('tr-TR');
  };

  // Bildirime tıklayınca ilgili sayfaya git
  const handleNotificationClick = async (notification: Notification) => {
    // Bildirimi okundu olarak işaretle
    await markAsRead(notification.id);

    // Bildirim türüne göre yönlendirme
    switch (notification.type) {
      case 'offer':
        navigate('/dashboard');
        break;
      case 'message':
        navigate('/messages');
        break;
      case 'payment':
        navigate('/dashboard');
        break;
      case 'system':
        navigate('/dashboard');
        break;
      default:
        navigate('/dashboard');
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
              <h2 className="text-xl font-bold text-gray-900">Bildirimler</h2>
              {unreadCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
                  {unreadCount}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-lg font-medium">Bildirimler Yükleniyor...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <Bell className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-lg font-medium">Bildirim Yok</p>
                <p className="text-sm">Yeni bildirimler burada görünecek</p>
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
                          <span className="text-xs text-gray-500">
                            {formatTime(notification.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {notification.message}
                        </p>
                        {/* Teklif detayları */}
                        {notification.type === 'offer' && notification.clinicName && (
                          <div className="mt-2 p-2 bg-green-50 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <Building className="w-4 h-4 text-green-600" />
                              <span className="text-sm font-medium text-green-800">
                                {notification.clinicName}
                              </span>
                            </div>
                            {notification.offerAmount && (
                              <div className="mt-1 text-sm text-green-700">
                                Teklif: ${notification.offerAmount.toLocaleString()}
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
              <span>{notifications.length} bildirim</span>
              <button
                onClick={markAllAsRead}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Tümünü Okundu İşaretle
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter; 