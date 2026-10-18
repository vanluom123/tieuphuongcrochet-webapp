'use client';

import React, { useState } from 'react';
import { LockOutlined, MailOutlined, GoogleOutlined, ReloadOutlined } from '@ant-design/icons';
import { Alert, Button, Checkbox, Divider, Flex, Form, Input, Spin } from 'antd';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { User } from '@/app/lib/definitions';
import { REGEX } from '@/app/lib/constant';
import { resendVerificationEmail } from '@/app/lib/service/registerService';
import { notification } from '@/app/lib/notify';
import AuthTextLink from '../primitives/AuthTextLink';

interface LoginFormProps {
  onNavigate: (view: 'register' | 'forgot') => void;
  onOpenResendVerification: (email?: string) => void;
  onLoginSuccess: () => void | Promise<void>;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onNavigate,
  onOpenResendVerification,
  onLoginSuccess,
}) => {
  const [form] = Form.useForm();
  const t = useTranslations('Login');

  const [isLoading, setIsLoading] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState('');
  const [isResending, setIsResending] = useState(false);

  const onFinish = async (values: User & { remember?: boolean }) => {
    setIsLoading(true);
    try {
      const result = await signIn('credentials', {
        email: values.email,
        password: values.password,
        remember: values.remember ? 'true' : 'false',
        redirect: false,
      });

      if (result?.error === 'EMAIL_NOT_VERIFIED' || result?.error?.includes('not verified')) {
        setUnverifiedEmail(values.email);
        notification.warning({
          message: t('unverified_account_alert'),
          description: t('unverified_account_desc'),
        });
      } else if (result?.error) {
        const description =
          result.status === 401 ? t('error_login_401_description') : result.error;
        notification.error({ message: t('error_login_title'), description });
      } else if (result?.ok) {
        await onLoginSuccess();
      }
    } catch (error) {
      if (error instanceof Error) {
        notification.error({ message: t('error_login_title'), description: error.message });
      } else {
        notification.error({
          message: t('error_login_title'),
          description: t('error_login_unknown_error'),
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendFromLogin = async () => {
    if (!unverifiedEmail) return;
    setIsResending(true);
    try {
      const res = await resendVerificationEmail(unverifiedEmail);
      if (res.status) {
        notification.success({
          message: t('btn_resend_verification'),
          description: t('unverified_account_desc'),
        });
      } else {
        const description =
          res.statusCode === 429
            ? res.data?.message || t('rate_limit_error')
            : res.data?.message || t('error_login_unknown_error');
        notification.error({
          message: t('error_login_title'),
          description,
        });
      }
    } catch {
      notification.error({
        message: t('error_login_title'),
        description: t('error_login_unknown_error'),
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Spin spinning={isLoading} tip="Loading...">
      <div className="auth-form">
        {unverifiedEmail && (
          <Alert
            type="warning"
            showIcon
            closable
            onClose={() => setUnverifiedEmail('')}
            message={t('unverified_account_alert')}
            description={
              <div style={{ marginTop: 8 }}>
                <p style={{ margin: '0 0 10px 0' }}>{t('unverified_account_desc')}</p>
                <Button
                  size="small"
                  type="primary"
                  className="btn-border"
                  icon={<ReloadOutlined spin={isResending} />}
                  loading={isResending}
                  disabled={isResending}
                  onClick={handleResendFromLogin}
                >
                  {t('btn_resend_verification')}
                </Button>
              </div>
            }
            style={{ marginBottom: 20 }}
          />
        )}
        <Form
          form={form}
          name="normal_login"
          className="login-form layout-wrap"
          initialValues={{ remember: true }}
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
              autoComplete="email"
              prefix={<MailOutlined className="site-form-item-icon" />}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: t('error_msg_required_password') },
              {
                pattern: new RegExp(REGEX.PASSWORD),
                message: t('error_msg_incorrect_password'),
              },
            ]}
          >
            <Input.Password
              autoComplete="current-password"
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder={t('input_password')}
            />
          </Form.Item>
          <Form.Item>
            <Flex justify="space-between" align="center" style={{ width: '100%' }}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>{t('remember_me')}</Checkbox>
              </Form.Item>
              <AuthTextLink className="login-form-forgot" onClick={() => onNavigate('forgot')}>
                {t('forgot_password')}
              </AuthTextLink>
            </Flex>
          </Form.Item>
          <Form.Item name="actions" className="actions">
            <Button
              block
              type="primary"
              loading={isLoading}
              htmlType="submit"
              className="login-form-button btn-border"
              disabled={isLoading}
            >
              {t('btn_login')}
            </Button>
            <p className="auth-form-switch">
              <span>{t('text_Or')}&nbsp;</span>
              <AuthTextLink onClick={() => onNavigate('register')}>{t('btn_register')}</AuthTextLink>
            </p>
          </Form.Item>
        </Form>

        <div className="auth-resend-link">
          <AuthTextLink
            onClick={() =>
              onOpenResendVerification(unverifiedEmail || form.getFieldValue('email'))
            }
          >
            {t('resend_verification_link')}
          </AuthTextLink>
        </div>

        <Divider>{t('text_Or')}</Divider>
        <Link
          href={`${process.env.NEXT_PUBLIC_API_URL}/oauth2/authorize/google?redirect_uri=${process.env.NEXT_PUBLIC_URL}/oauth2/redirect`}
          className="google-login-button"
        >
          <Button
            block
            icon={<GoogleOutlined />}
            size="large"
            className="btn-border"
            variant="outlined"
            color="primary"
          >
            {t('btn_google_login')}
          </Button>
        </Link>
      </div>
    </Spin>
  );
};

export default LoginForm;
