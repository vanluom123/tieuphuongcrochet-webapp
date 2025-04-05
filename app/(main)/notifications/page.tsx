"use client"

import React, { useEffect, useState } from 'react';
import { Typography, List, Button, Pagination, Tag, Empty, message, Popconfirm } from 'antd';
import { DeleteOutlined, CheckOutlined } from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useTranslations } from 'next-intl';

import { notificationService, Notification } from '@/app/lib/service/notificationService';
import '@/app/ui/components/notification.scss';
import NotificationCard from '@/app/components/notification/NotificationCard';
dayjs.extend(relativeTime);

const { Title, Text } = Typography;

const NotificationsPage: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const t = useTranslations('Notification');
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchNotifications();
    }
  }, [session?.user?.id, page, pageSize]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationService.getNotifications(page - 1, pageSize);
      setNotifications(response.contents);
      setTotal(response.totalElements);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      message.error(t('error.fetch'));
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prevNotifications =>
        prevNotifications.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
      message.error(t('error.mark_as_read'));
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prevNotifications =>
        prevNotifications.map(n => ({ ...n, read: true }))
      );
      message.success(t('success.mark_all_as_read'));
    } catch (error) {
      console.error('Error marking all as read:', error);
      message.error(t('error.mark_all_as_read'));
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications(prevNotifications =>
        prevNotifications.filter(n => n.id !== notificationId)
      );
      message.success(t('success.delete'));
    } catch (error) {
      console.error('Error deleting notification:', error);
      message.error(t('error.delete'));
    }
  };

  const deleteAllNotifications = async () => {
    try {
      await notificationService.deleteAllNotifications();
      setNotifications([]);
      setTotal(0);
      message.success(t('success.delete_all'));
    } catch (error) {
      console.error('Error deleting all notifications:', error);
      message.error(t('error.delete_all'));
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }

    if (notification.link) {
      router.push(notification.link);
    }
  };


  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <Title level={2}>{t('title_page')}</Title>
        <div className="actions">
          <Button
            icon={<CheckOutlined />}
            onClick={markAllAsRead}
            disabled={notifications.length === 0 || notifications.every(n => n.read)}
          >
            {t('mark_all_as_read')}
          </Button>
          <Popconfirm
            title={t('delete_all_confirm_title')}
            onConfirm={deleteAllNotifications}
            okText={t('yes')}
            cancelText={t('no')}
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              disabled={notifications.length === 0}
            >
              {t('delete_all')}
            </Button>
          </Popconfirm>
        </div>
      </div>

      <List
        className="notification-list"
        loading={loading}
        dataSource={notifications}
        locale={{ emptyText: <Empty description={t('no_notifications')} /> }}
        renderItem={notification => (
          <NotificationCard
            notification={notification}
            onDelete={deleteNotification}
            onMarkAsRead={markAsRead}
            onNotificationClick={handleNotificationClick}
          />
        )}
      />

      {total > 0 && (
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Pagination
            current={page}
            pageSize={pageSize}
            total={total}
            onChange={setPage}
            onShowSizeChange={(current, size) => {
              setPage(1);
              setPageSize(size);
            }}
            showSizeChanger
            showQuickJumper
          />
        </div>
      )}
    </div>
  );
};

export default NotificationsPage; 