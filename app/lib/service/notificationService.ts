import { API_ROUTES } from "../constant";
import apiJwtService from "./apiJwtService";

export interface Notification {
  id: string;
  title: string;
  message: string;
  link: string;
  read: boolean;
  createdAt: string;
  notificationType: string;
  senderName?: string;
  senderImageUrl?: string;
}

export interface NotificationPage {
  contents: Notification[];
  totalElements: number;
  totalPages: number;
  pageSize: number;
  pageNo: number;
  last: boolean;
}

export const notificationService = {
  async getNotifications(page: number = 0, size: number = 10): Promise<NotificationPage> {
    const res = await apiJwtService({
      endpoint: `${API_ROUTES.NOTIFICATIONS}/me`,
      method: 'GET',
      queryParams: {
        page: page.toString(),
        size: size.toString(),
      },
    });
    return res.data;
  },

  async getUnreadCount(): Promise<number> {
    const res = await apiJwtService({
      endpoint: `${API_ROUTES.NOTIFICATIONS}/unread/count`,
      method: 'GET',
    });
    return res.data;
  },

  async markAsRead(notificationId: string): Promise<Notification> {
    const res = await apiJwtService({
      endpoint: `${API_ROUTES.NOTIFICATIONS}/${notificationId}/read`,
      method: 'PUT',
    });
    return res.data;
  },

  async markAllAsRead(): Promise<void> {
    const res = await apiJwtService({
      endpoint: `${API_ROUTES.NOTIFICATIONS}/read-all`,
      method: 'PUT',
    });
    return res.data;
  },

  async deleteNotification(notificationId: string): Promise<void> {
    const res = await apiJwtService({
      endpoint: `${API_ROUTES.NOTIFICATIONS}/${notificationId}`,
      method: 'DELETE',
    });
    return res.data;
  },

  async deleteAllNotifications(): Promise<void> {
    const res = await apiJwtService({
      endpoint: `${API_ROUTES.NOTIFICATIONS}/all`,
      method: 'DELETE',
    });
    return res.data;
  }
};