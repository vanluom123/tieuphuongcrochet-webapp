import { Popconfirm, Typography } from "antd";
import { Tag } from "antd";
import { Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useLocale, useTranslations } from "next-intl";
import { Notification } from "@/app/lib/service/notificationService";
import '@/app/ui/components/notificationCard.scss';
import { timeUtils } from "@/app/lib/utils";

interface NotificationCardProps {
  notification: Notification;
  onDelete: (id: string) => void;
  onMarkAsRead: (id: string) => void;
  onNotificationClick: (notification: Notification) => void;
}

const NotificationCard = ({ notification, onDelete, onMarkAsRead, onNotificationClick }: NotificationCardProps) => {
  const { Title, Text } = Typography;

  const t = useTranslations('Notification');
  const locale = useLocale();

  const getNotificationTypeDisplay = (type: string) => {
    switch (type) {
      case 'COMMENT':
        return t('type.COMMENT');
      case 'SYSTEM':
        return t('type.SYSTEM');
      case 'NEW_PATTERN':
        return t('type.NEW_PATTERN');
      case 'NEW_PRODUCT':
        return t('type.NEW_PRODUCT');
      case 'NEW_BLOG':
        return t('type.NEW_BLOG');
      default:
        return t('type.OTHER');
    }
  };

  return <div
    className={`notification-item ${!notification.read ? 'unread' : ''}`}
    key={notification.id}
  >
    <div className="notification-header">
      <Tag className={`notification-type ${notification.notificationType}`}>
        {getNotificationTypeDisplay(notification.notificationType)}
      </Tag>
      <Popconfirm
        title={t('delete_confirm_title')}
        onConfirm={() => onDelete(notification.id)}
        okText={t('yes')}
        cancelText={t('no')}
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

    <div className="notification-content" onClick={() => onNotificationClick(notification)}>
      <Title level={5}>{notification.title}</Title>
      <Text>{notification.message}</Text>
    </div>

    <div className="notification-footer">
      <Text type="secondary">{timeUtils.timeAgo(notification.createdAt, locale)}</Text>
      {!notification.read && (
        <Button
          type="link"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onMarkAsRead(notification.id);
          }}
        >
          {t('mark_as_read')}
        </Button>
      )}
    </div>
  </div>
};

export default NotificationCard;


