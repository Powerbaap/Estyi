import { useEffect, useRef, useState } from 'react';
import { notificationsService, NotificationItem } from '../services/notificationsService';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const pollingRef = useRef<number | null>(null);

  useEffect(() => {
    // Mock veri tohumlamayı kaldır: doğrudan mevcut store'u oku
    setNotifications(notificationsService.list());
    setIsLoading(false);

    // Basit polling ile store güncellemelerini yakala
    pollingRef.current = window.setInterval(() => {
      setNotifications(notificationsService.list());
    }, 10000); // 10 saniyede bir kontrol

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  const markAsRead = (id: string) => {
    notificationsService.markRead(id);
    setNotifications(notificationsService.list());
  };

  const markAllAsRead = () => {
    notificationsService.markAllRead();
    setNotifications(notificationsService.list());
  };

  const deleteNotification = (id: string) => {
    notificationsService.delete(id);
    setNotifications(notificationsService.list());
  };

  const clearNotifications = () => {
    notificationsService.clear();
    setNotifications(notificationsService.list());
  };

  const requestNotificationPermission = async () => {
    try {
      if (typeof Notification !== 'undefined' && Notification.permission !== 'granted') {
        await Notification.requestPermission();
      }
    } catch (err) {
      // Sessizce yoksay: tarayıcı desteklemeyebilir
    }
  };

  const unreadCount = notificationsService.unreadCount();

  return {
    notifications,
    isLoading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearNotifications,
    requestNotificationPermission,
  };
};