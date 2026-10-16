'use client';

import React, { useState } from 'react';
import { MailOutlined, LeftOutlined } from '@ant-design/icons';
import { Button, Form, Input, Spin } from 'antd';
import { useTranslations } from 'next-intl';

import { REGEX } from '@/app/lib/constant';
import { passwordResetRequest } from '@/app/lib/service/registerService';
import { notification } from '@/app/lib/notify';
import AuthTextLink from '../primitives/AuthTextLink';

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onBackToLogin }) => {
  const [form] = Form.useForm();
  const t = useTranslations('ForgotPassword');
  const [isLoading, setIsLoading] = useState(false);

  const onFinish = async (values: { email: string }) => {
    setIsLoading(true);
    try {
      const res = await passwordResetRequest(values.email);
      if (res.status) {
        notification.success({
          message: t('success_title'),
          description: t('success_description'),
        });
        form.resetFields();
      } else {
        notification.error({
          message: t('error_title'),
          description: res.data?.message || t('error_description'),
        });
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : t('error_description');
      notification.error({
        message: t('error_title'),
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Spin spinning={isLoading} tip="Loading...">
      <div className="auth-form">
        <p className="auth-form-instruction">{t('instruction')}</p>
        <Form
          form={form}
          name="forgot_password"
          className="login-form layout-wrap"
          onFinish={onFinish}
          disabled={isLoading}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: t('error_msg_required_email') },
              {
                pattern: new RegExp(REGEX.EMAIL),
                message: t('error_msg_incorrect_email'),
              },
            ]}
          >
            <Input
              maxLength={100}
              placeholder={t('input_email')}
              prefix={<MailOutlined className="site-form-item-icon" />}
            />
          </Form.Item>
          <Form.Item className="actions">
            <Button
              block
              type="primary"
              loading={isLoading}
              htmlType="submit"
              className="login-form-button btn-border"
              disabled={isLoading}
            >
              {t('btn_submit')}
            </Button>
            <p className="auth-form-back">
              <AuthTextLink onClick={onBackToLogin}>
                <LeftOutlined style={{ fontSize: 12 }} /> {t('back_to_login')}
              </AuthTextLink>
            </p>
          </Form.Item>
        </Form>
      </div>
    </Spin>
  );
};

export default ForgotPasswordForm;
