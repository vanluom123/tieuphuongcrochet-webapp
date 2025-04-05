"use client"

import React, { useEffect, useState } from 'react';
import { Badge, Popover, List, Typography, Button, Empty, Spin } from 'antd';
import { BellOutlined, CheckOutlined } from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

import { notificationService, Notification } from '@/app/lib/service/notificationService';
import '@/app/ui/components/notificationBell.scss';
import { timeUtils } from '@/app/lib/utils';

const { Text, Title } = Typography;

const NotificationBell: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const t = useTranslations('Notification');
  const locale = useLocale();

  const fetchNotifications = async () => {
    if (!session?.user?.id) return;

    try {
      setLoading(true);
      const response = await notificationService.getNotifications(0, 5);
      setNotifications(response.contents);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    if (!session?.user?.id) return;

    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchUnreadCount();

      // Set up polling for unread count (every 30 seconds)
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (visible) {
      fetchNotifications();
    }
  }, [visible]);

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    notificationService.markAsRead(notification.id)
      .then(() => {
        fetchUnreadCount();
        setNotifications(prevNotifications =>
          prevNotifications.map(n =>
            n.id === notification.id ? { ...n, read: true } : n
          )
        );
      })
      .catch(error => console.error('Error marking notification as read:', error));

    // Navigate if there's a link
    if (notification.link) {
      router.push(notification.link);
      setVisible(false);
    }
  };

  const markAllAsRead = () => {
    notificationService.markAllAsRead()
      .then(() => {
        setUnreadCount(0);
        setNotifications(prevNotifications =>
          prevNotifications.map(n => ({ ...n, read: true }))
        );
      })
      .catch(error => console.error('Error marking all as read:', error));
  };

  const viewAllNotifications = () => {
    router.push('/notifications');
    setVisible(false);
  };

  const notificationContent = (
    <div className="notification-popup">
      <div className="notification-header">
        <Title level={5}>{t('title')}</Title>
        {unreadCount > 0 && (
          <Button
            type="text"
            size="small"
            icon={<CheckOutlined />}
            onClick={markAllAsRead}
          >
            {t('mark_all_as_read')}
          </Button>
        )}
      </div>

      <div className="notification-content">
        {loading ? (
          <div className="notification-loading">
            <Spin />
          </div>
        ) : notifications.length > 0 ? (
          <List
            dataSource={notifications}
            renderItem={(notification) => (
              <List.Item
                className={`notification-item ${!notification.read ? 'unread' : ''}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="notification-item-content">
                  <Text strong>{notification.title}</Text>
                  <Text>{notification.message}</Text>
                  <Text type="secondary" className="notification-time">
                    {timeUtils.timeAgo(notification.createdAt, locale)}
                  </Text>
                </div>
              </List.Item>
            )}
          />
        ) : (
          <Empty description={t('no_notifications')} />
        )}
      </div>

      <div className="notification-footer">
        <Button type="link" onClick={viewAllNotifications}>
          {t('view_all')}
        </Button>
      </div>
    </div>
  );

  if (!session?.user?.id) return null;

  return (
    <div className="notification-bell">
      <Popover
        content={notificationContent}
        trigger="click"
        open={visible}
        onOpenChange={setVisible}
        overlayClassName="notification-popover"
      >
        <Badge count={unreadCount} overflowCount={99}>
          <BellOutlined className="bell-icon" />
        </Badge>
      </Popover>
    </div>
  );
};

export default NotificationBell; 