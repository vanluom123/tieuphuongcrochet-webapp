'use client';

import React, { useState } from 'react';
import { Button, Modal, Typography, Flex } from 'antd';
import { MailOutlined, ReloadOutlined, InfoCircleOutlined, EditOutlined } from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import { useResendCooldown } from '@/app/hooks/useResendCooldown';
import { resendVerificationEmail } from '@/app/lib/service/registerService';
import { notification } from '@/app/lib/notify';

const { Text } = Typography;

interface ActiveAccountModalProps {
  isOpen: boolean;
  email?: string;
  onClick: () => void;
  onCancel: () => void;
  onEditEmail?: () => void;
}

const ActiveAccountModal: React.FC<ActiveAccountModalProps> = ({
  isOpen,
  email = '',
  onClick,
  onCancel,
  onEditEmail,
}) => {
  const t = useTranslations('Register.ActiveModal');
  const [isResending, setIsResending] = useState(false);
  const { secondsLeft, isCooldownActive, startCooldown } = useResendCooldown(
    email ? `active_modal_${email}` : 'active_modal_default'
  );

  if (!isOpen) {
    return null;
  }

  const handleResend = async () => {
    if (!email) {
      notification.error({
        message: t('resend_error_title'),
        description: t('resend_error_description'),
      });
      return;
    }

    setIsResending(true);
    try {
      const res = await resendVerificationEmail(email);
      if (res.status) {
        notification.success({
          message: t('resend_success_title'),
          description: t('resend_success_description'),
        });
        startCooldown(60);
      } else {
        const errorDesc =
          res.statusCode === 429 || res.data?.message?.includes?.('limit')
            ? res.data?.message || t('rate_limit_error')
            : res.data?.message || t('resend_error_description');

        notification.error({
          message: t('resend_error_title'),
          description: errorDesc,
        });

        if (res.statusCode === 429 || res.data?.message?.includes?.('limit')) {
          startCooldown(60);
        }
      }
    } catch {
      notification.error({
        message: t('resend_error_title'),
        description: t('resend_error_description'),
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Modal
      className="active-account-modal"
      title={null}
      open={isOpen}
      onCancel={onCancel}
      footer={
        <Flex vertical gap={10} style={{ width: '100%', marginTop: 8 }}>
          <Button
            className="btn-border"
            type="primary"
            block
            size="large"
            onClick={onClick}
          >
            {t('btn_sign_in') || 'Sign In'}
          </Button>
        </Flex>
      }
    >
      <div className="modal-icon-header">
        <div className="icon-wrapper">
          <MailOutlined />
        </div>
      </div>

      <h3 style={{ textAlign: 'center', marginBottom: 12, fontSize: 20 }}>
        {t('title') || 'Activate Your Account'}
      </h3>

      <p style={{ textAlign: 'center', color: '#595959', marginBottom: 14 }}>
        {t('description')}
      </p>

      {email && (
        <div className="registered-email-card">
          <div className="email-info" title={email}>
            <MailOutlined className="mail-icon" />
            <Text ellipsis style={{ maxWidth: 220 }}>
              {email}
            </Text>
          </div>
          {onEditEmail && (
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              onClick={onEditEmail}
              style={{ padding: 0 }}
            >
              {t('btn_edit_email')}
            </Button>
          )}
        </div>
      )}

      <div className="spam-note">
        <InfoCircleOutlined style={{ color: '#faad14' }} />
        <span>{t('spam_note')}</span>
      </div>

      <div className="resend-section">
        <Flex vertical gap={8} align="center">
          <Button
            block
            className="btn-border"
            type="default"
            icon={<ReloadOutlined spin={isResending} />}
            loading={isResending}
            disabled={isCooldownActive || isResending}
            onClick={handleResend}
          >
            {isCooldownActive
              ? t('btn_resend_cooldown', { seconds: secondsLeft })
              : t('btn_resend')}
          </Button>
        </Flex>
      </div>
    </Modal>
  );
};

export default ActiveAccountModal;