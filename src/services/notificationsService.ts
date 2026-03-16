import { supabase } from '../lib/supabaseClient';

export type NotificationType = 'offer' | 'message' | 'appointment' | 'review' | 'system';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  action_url?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export const notificationsService = {
  async list(userId: string): Promise<NotificationItem[]> {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);
    return (data || []) as NotificationItem[];
  },

  async unreadCount(userId: string): Promise<number> {
    const { count } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);
    return count || 0;
  },

  async markRead(id: string) {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
  },

  async markAllRead(userId: string) {
    await supabase.from('notifications').update({ is_read: true }).eq('user_id', userId).eq('is_read', false);
  },

  async delete(id: string) {
    await supabase.from('notifications').delete().eq('id', id);
  },

  async clear(userId: string) {
    await supabase.from('notifications').delete().eq('user_id', userId);
  },

  async create(notification: {
    user_id: string;
    type: NotificationType;
    title: string;
    message: string;
    action_url?: string;
    metadata?: Record<string, any>;
  }) {
    await supabase.from('notifications').insert(notification);
  },
};
