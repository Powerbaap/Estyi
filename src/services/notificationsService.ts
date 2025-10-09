export type NotificationType = 'offer' | 'message' | 'payment' | 'system';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high';
  clinicName?: string;
  offerAmount?: number;
}

// Temporary in-memory store; replace with API integration later
let notificationsStore: NotificationItem[] = [];

export const notificationsService = {
  init(mock: NotificationItem[]) {
    notificationsStore = mock;
  },
  add(notification: NotificationItem) {
    notificationsStore = [notification, ...notificationsStore];
  },
  list(): NotificationItem[] {
    return notificationsStore;
  },
  markRead(id: string) {
    notificationsStore = notificationsStore.map(n =>
      n.id === id ? { ...n, isRead: true } : n
    );
  },
  markAllRead() {
    notificationsStore = notificationsStore.map(n => ({ ...n, isRead: true }));
  },
  delete(id: string) {
    notificationsStore = notificationsStore.filter(n => n.id !== id);
  },
  clear() {
    notificationsStore = [];
  },
  unreadCount(): number {
    return notificationsStore.filter(n => !n.isRead).length;
  }
};