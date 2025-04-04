"use client"

import React, { useEffect, useState } from 'react';
import { Typography, List, Button, Pagination, Tag, Empty, message, Popconfirm } from 'antd';
import { DeleteOutlined, CheckOutlined } from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { notificationService, Notification } from '@/app/lib/service/notificationService';
import '@/app/ui/components/notification.scss';

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
      setNotifications(response.content);
      setTotal(response.totalElements);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      message.error('Không thể tải thông báo. Vui lòng thử lại sau.');
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
      message.error('Không thể đánh dấu thông báo đã đọc. Vui lòng thử lại sau.');
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prevNotifications => 
        prevNotifications.map(n => ({ ...n, read: true }))
      );
      message.success('Đã đánh dấu tất cả thông báo là đã đọc');
    } catch (error) {
      console.error('Error marking all as read:', error);
      message.error('Không thể đánh dấu tất cả thông báo đã đọc. Vui lòng thử lại sau.');
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications(prevNotifications => 
        prevNotifications.filter(n => n.id !== notificationId)
      );
      message.success('Đã xóa thông báo');
    } catch (error) {
      console.error('Error deleting notification:', error);
      message.error('Không thể xóa thông báo. Vui lòng thử lại sau.');
    }
  };

  const deleteAllNotifications = async () => {
    try {
      await notificationService.deleteAllNotifications();
      setNotifications([]);
      setTotal(0);
      message.success('Đã xóa tất cả thông báo');
    } catch (error) {
      console.error('Error deleting all notifications:', error);
      message.error('Không thể xóa tất cả thông báo. Vui lòng thử lại sau.');
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

  const getNotificationTypeDisplay = (type: string) => {
    switch (type) {
      case 'COMMENT':
        return 'Bình luận';
      case 'SYSTEM':
        return 'Hệ thống';
      case 'NEW_PATTERN':
        return 'Mẫu mới';
      case 'NEW_PRODUCT':
        return 'Sản phẩm mới';
      case 'NEW_BLOG':
        return 'Bài viết mới';
      default:
        return type;
    }
  };

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <Title level={2}>Thông báo của bạn</Title>
        <div className="actions">
          <Button 
            icon={<CheckOutlined />} 
            onClick={markAllAsRead}
            disabled={notifications.length === 0 || notifications.every(n => n.read)}
          >
            Đánh dấu tất cả đã đọc
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa tất cả thông báo?"
            onConfirm={deleteAllNotifications}
            okText="Có"
            cancelText="Không"
          >
            <Button 
              danger 
              icon={<DeleteOutlined />}
              disabled={notifications.length === 0}
            >
              Xóa tất cả
            </Button>
          </Popconfirm>
        </div>
      </div>

      <List
        className="notification-list"
        loading={loading}
        dataSource={notifications}
        locale={{ emptyText: <Empty description="Bạn không có thông báo nào" /> }}
        renderItem={notification => (
          <div 
            className={`notification-item ${!notification.read ? 'unread' : ''}`}
            key={notification.id}
          >
            <div className="notification-header">
              <Tag className={`notification-type ${notification.notificationType}`}>
                {getNotificationTypeDisplay(notification.notificationType)}
              </Tag>
              <Popconfirm
                title="Bạn có chắc chắn muốn xóa thông báo này?"
                onConfirm={() => deleteNotification(notification.id)}
                okText="Có"
                cancelText="Không"
              >
                <Button 
                  size="small" 
                  type="text" 
                  danger 
                  icon={<DeleteOutlined />}
                  onClick={e => e.stopPropagation()}
                />
              </Popconfirm>
            </div>
            
            <div className="notification-content" onClick={() => handleNotificationClick(notification)}>
              <Title level={5}>{notification.title}</Title>
              <Text>{notification.message}</Text>
            </div>
            
            <div className="notification-footer">
              <Text type="secondary">{dayjs(notification.createdAt).fromNow()}</Text>
              {!notification.read && (
                <Button 
                  type="link" 
                  size="small" 
                  onClick={(e) => {
                    e.stopPropagation();
                    markAsRead(notification.id);
                  }}
                >
                  Đánh dấu đã đọc
                </Button>
              )}
            </div>
          </div>
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