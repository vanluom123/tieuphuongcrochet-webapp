import { API_ROUTES } from "../constant";

export interface Notification {
  id: string;
  title: string;
  message: string;
  link: string;
  read: boolean;
  createdAt: string;
  notificationType: string;
}

export interface NotificationPage {
  content: Notification[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export const notificationService = {
  async getNotifications(page: number = 0, size: number = 10): Promise<NotificationPage> {
    const response = await fetch(`${API_ROUTES}/notifications/me?page=${page}&size=${size}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch notifications');
    }

    return await response.json();
  },

  async getUnreadCount(): Promise<number> {
    const response = await fetch(`${API_ROUTES}/notifications/unread/count`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch unread count');
    }

    return await response.json();
  },

  async markAsRead(notificationId: string): Promise<Notification> {
    const response = await fetch(`${API_ROUTES}/notifications/${notificationId}/read`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to mark notification as read');
    }

    return await response.json();
  },

  async markAllAsRead(): Promise<void> {
    const response = await fetch(`${API_ROUTES}/notifications/read-all`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to mark all notifications as read');
    }
  },

  async deleteNotification(notificationId: string): Promise<void> {
    const response = await fetch(`${API_ROUTES}/notifications/${notificationId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete notification');
    }
  },

  async deleteAllNotifications(): Promise<void> {
    const response = await fetch(`${API_ROUTES}/notifications/all`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete all notifications');
    }
  }
}; 