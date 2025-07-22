const BASE = process.env.EXPO_PUBLIC_BACKEND_URL;

export const fetchNotifications = async (hostId: string) => {
  const r = await fetch(`${BASE}/api/notifications?hostId=${hostId}`);
  return r.json();
};

export const markNotificationRead = async (id: string) =>
  fetch(`${BASE}/api/notifications/${id}/read`, { method: 'PUT' });
