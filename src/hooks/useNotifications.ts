import { useEffect, useState, useCallback } from 'react';
import { notificationsService, NotificationItem } from '../services/notificationsService';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';

export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const load = useCallback(async () => {
    if (!user?.id) return;
    try {
      const [items, count] = await Promise.all([
        notificationsService.list(user.id),
        notificationsService.unreadCount(user.id),
      ]);
      setNotifications(items);
      setUnreadCount(count);
    } catch (err) {
      console.error('Bildirim yükleme hatası:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    load();

    if (!user?.id) return;

    const channel = supabase
      .channel(`notifications-${user.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`,
      }, (payload: any) => {
        setNotifications(prev => [payload.new as NotificationItem, ...prev]);
        setUnreadCount(prev => prev + 1);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, load]);

  const markAsRead = async (id: string) => {
    await notificationsService.markRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = async () => {
    if (!user?.id) return;
    await notificationsService.markAllRead(user.id);
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  const deleteNotification = async (id: string) => {
    const wasUnread = notifications.find(n => n.id === id && !n.is_read);
    await notificationsService.delete(id);
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (wasUnread) setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const clearNotifications = async () => {
    if (!user?.id) return;
    await notificationsService.clear(user.id);
    setNotifications([]);
    setUnreadCount(0);
  };

  return {
    notifications,
    isLoading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearNotifications,
  };
};
