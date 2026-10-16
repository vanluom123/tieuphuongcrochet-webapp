'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Form, Input, Button, Spin } from 'antd';

import { User } from '@/app/lib/definitions';
import { REGEX } from '@/app/lib/constant';
import { registerService } from '@/app/lib/service/registerService';
import { notification } from '@/app/lib/notify';
import ActiveAccountModal from '@/app/(auth)/register/ActiveAccountModal';
import AuthTextLink from '../primitives/AuthTextLink';

interface RegisterFormProps {
  onNavigateLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onNavigateLogin }) => {
  const [formState, setFormState] = useState({
    isDisable: false,
    isModalVisible: false,
    isLoading: false,
  });
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [form] = Form.useForm();
  const t = useTranslations('Register');

  const onSubmitRegister = async (values: User) => {
    setFormState((prev) => ({ ...prev, isDisable: true, isLoading: true }));
    setRegisteredEmail(values.email);
    const res = await registerService(values);
    if (res?.status) {
      setFormState((prev) => ({ ...prev, isModalVisible: true, isLoading: false, isDisable: false }));
    } else {
      const hasStatusCodeKey =
        res?.statusCode && (res.statusCode === 400 || res.statusCode === 500);
      const description = hasStatusCodeKey
        ? t(`error_register_${res.statusCode}`)
        : t('error_register_default');
      notification.error({
        message: t('error_register_title'),
        description,
      });
      setFormState((prev) => ({ ...prev, isDisable: false, isLoading: false }));
    }
  };

  const onSignIn = () => {
    setFormState((prev) => ({ ...prev, isModalVisible: false }));
    form.resetFields();
    onNavigateLogin();
  };

  return (
    <>
      <Spin spinning={formState.isLoading}>
        <div className="auth-form auth-form-register">
          <p className="auth-form-switch">
            {t('account_exist')}{' '}
            <AuthTextLink onClick={onNavigateLogin}>{t('btn_sign_in')}</AuthTextLink>
          </p>
          <Form
            form={form}
            name="register"
            layout="vertical"
            autoComplete="off"
            onFinish={onSubmitRegister}
          >
            <Form.Item
              label={t('input_fullname')}
              name="name"
              rules={[{ required: true, message: t('error_msg_required_fullname') }]}
            >
              <Input maxLength={100} placeholder={t('input_fullname')} />
            </Form.Item>
            <Form.Item
              name="email"
              label={t('input_email')}
              rules={[
                { required: true, message: t('error_msg_required_email') },
                {
                  pattern: new RegExp(REGEX.EMAIL),
                  message: t('error_msg_incorrect_email'),
                },
              ]}
            >
              <Input maxLength={100} placeholder={t('input_email')} />
            </Form.Item>
            <Form.Item
              name="password"
              label={t('input_password')}
              rules={[
                { required: true, message: t('error_msg_required_password') },
                {
                  pattern: new RegExp(REGEX.PASSWORD),
                  message: t('error_msg_incorrect_password'),
                },
              ]}
            >
              <Input.Password placeholder={t('input_password')} autoComplete="new-password" />
            </Form.Item>
            <Form.Item
              name="rePassword"
              label={t('input_confirm_password')}
              rules={[
                { required: true, message: t('error_msg_required_confirm_password') },
                {
                  validator: async (_, value) => {
                    if (!value || form.getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    throw new Error(t('error_msg_not_match_confirm_password'));
                  },
                },
              ]}
            >
              <Input.Password autoComplete="new-password" />
            </Form.Item>
            <div className="note">
              <p>
                <strong>{t('note_title')}:</strong>
              </p>
              <div>
                <p>
                  - <span style={{ color: '#ff4d4f' }}>(*)</span>: {t('note_content_1')}
                </p>
                <p>- {t('note_content_2')}</p>
              </div>
            </div>
            <Button
              className="btn-border"
              type="primary"
              htmlType="submit"
              block
              disabled={formState.isDisable}
            >
              {t('btn_register')}
            </Button>
          </Form>
        </div>
      </Spin>
      <ActiveAccountModal
        isOpen={formState.isModalVisible}
        email={registeredEmail}
        onClick={onSignIn}
        onCancel={() => setFormState((prev) => ({ ...prev, isModalVisible: false }))}
        onEditEmail={() => setFormState((prev) => ({ ...prev, isModalVisible: false }))}
      />
    </>
  );
};

export default RegisterForm;
