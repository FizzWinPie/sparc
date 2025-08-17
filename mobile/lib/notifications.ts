import { Platform } from 'react-native';

const RAW_BASE = process.env.EXPO_PUBLIC_BACKEND_URL ?? 'http://localhost:8000';
const BASE =
  Platform.OS === 'android' && RAW_BASE.includes('localhost')
    ? RAW_BASE.replace('localhost', '10.0.2.2')
    : RAW_BASE;

export type AppNotification = {
  _id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export const fetchNotifications = async (userId: string): Promise<AppNotification[]> => {
  const r = await fetch(`${BASE}/api/notifications?userId=${encodeURIComponent(userId)}`);
  if (!r.ok) throw new Error(`Failed to load notifications (${r.status})`);
  return r.json();
};

export const markNotificationRead = async (id: string): Promise<void> => {
  const r = await fetch(`${BASE}/api/notifications/${id}/read`, { method: 'PUT' });
  if (!r.ok) throw new Error(`Failed to mark read (${r.status})`);
};

export const fetchUnreadCount = async (userId: string): Promise<number> => {
  const r = await fetch(`${BASE}/api/notifications/unread-count?userId=${encodeURIComponent(userId)}`);
  if (!r.ok) throw new Error(`Failed to load unread count (${r.status})`);
  const data = await r.json();
  return Number(data?.count ?? 0);
};

export const createNotification = async (userId: string, message: string, read: boolean): Promise<number> => {
  const r = await fetch(`${BASE}/api/notifications/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      userId,
      message,
      read
    })
  });
  if (!r.ok) throw new Error(`Failed to create a new notification`);
  const data = await r.json();
  return Number(data?.count ?? 0);
};