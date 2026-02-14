import React, { useState, useEffect, useRef } from 'react';
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
  /** Bildirimler butonunun bulunduğu element ref'i - dropdown bu öğenin hemen altında açılır */
  anchorRef?: React.RefObject<HTMLElement | null>;
  clinicSpecialties?: string[];
}

const ClinicNotificationCenter: React.FC<ClinicNotificationCenterProps> = ({ 
  isOpen, 
  onClose, 
  anchorRef,
  clinicSpecialties = ['Rhinoplasty', 'Hair Transplant', 'Breast Surgery'] 
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<ClinicNotification[]>([]);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({
    position: 'fixed',
    top: '4.5rem',
    right: '1rem',
    width: '20rem',
    maxHeight: 'min(24rem, 70vh)',
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setNotifications([]);
  }, [clinicSpecialties]);

  // Dışarı tıklanınca kapat (backdrop veya sayfanın herhangi bir yeri)
  useEffect(() => {
    if (!isOpen) return;
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      const insideDropdown = dropdownRef.current?.contains(target);
      const insideAnchor = anchorRef?.current?.contains(target);
      if (!insideDropdown && !insideAnchor) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [isOpen, onClose, anchorRef]);

  // Bildirimler butonunun hemen altında konumla
  useEffect(() => {
    if (!isOpen) return;
    if (anchorRef?.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: 'fixed',
        top: rect.bottom + 6,
        right: window.innerWidth - rect.right,
        width: '20rem',
        maxHeight: 'min(24rem, 70vh)',
      });
    } else {
      setDropdownStyle({
        position: 'fixed',
        top: '4.5rem',
        right: '1rem',
        width: '20rem',
        maxHeight: 'min(24rem, 70vh)',
      });
    }
  }, [isOpen, anchorRef]);

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
    <>
      {/* Dışarı tıklanınca kapanan arka plan */}
      <div
        className="fixed inset-0 z-[9998] bg-black/20"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Bildirimler butonunun hemen altında açılan dropdown */}
      <div
        ref={dropdownRef}
        style={dropdownStyle}
        className="z-[9999] flex flex-col bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden"
        role="dialog"
        aria-label={t('common.notifications')}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="font-semibold text-gray-900">{t('common.notifications')}</span>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold rounded-full min-w-[1.25rem] h-5 px-1.5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium px-2 py-1 rounded hover:bg-blue-50"
              >
                {t('common.markAllRead')}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label={t('common.close')}
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Liste */}
        <div className="overflow-y-auto flex-1 min-h-0">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-gray-500 text-center">
              <Bell className="w-12 h-12 mb-3 opacity-40" />
              <p className="text-sm font-medium">{t('common.noNotifications')}</p>
              <p className="text-xs mt-0.5">{t('common.newNotificationsHere')}</p>
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-3 rounded-lg border-l-2 ${getPriorityColor(notification.priority)} ${
                    notification.isRead ? 'bg-gray-50' : 'bg-white'
                  } hover:bg-gray-50 transition-colors cursor-pointer`}
                >
                  <div className="flex items-start gap-2">
                    <div className="shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className={`text-sm font-medium truncate ${
                          notification.isRead ? 'text-gray-600' : 'text-gray-900'
                        }`}>
                          {notification.title}
                        </h3>
                        <span className="text-xs text-gray-400 shrink-0">
                          {formatTime(notification.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2 mt-0.5">
                        {notification.message}
                      </p>
                      {notification.userId && (
                        <div className="mt-1.5 p-1.5 bg-blue-50 rounded text-xs text-blue-800">
                          {notification.userId}
                          {notification.procedure && ` · ${notification.procedure}`}
                          {notification.offerAmount != null && ` · $${notification.offerAmount.toLocaleString()}`}
                        </div>
                      )}
                    </div>
                    <div className="flex shrink-0 gap-0.5">
                      {!notification.isRead && (
                        <button
                          onClick={(e) => { e.stopPropagation(); markAsRead(notification.id); }}
                          className="p-1 rounded text-blue-600 hover:bg-blue-50"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteNotification(notification.id); }}
                        className="p-1 rounded text-gray-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {notifications.length > 0 && (
          <div className="px-3 py-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 shrink-0">
            <span>{notifications.length} {t('common.notifications')}</span>
            <button onClick={markAllAsRead} className="text-blue-600 hover:text-blue-800 font-medium">
              {t('common.markAllRead')}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ClinicNotificationCenter;