'use client';

import React, { useEffect, useState } from 'react';
import { MailOutlined, LeftOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Col, Flex, Form, Input, Row, Spin } from 'antd';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import logo from '@/public/logo.png';
import { ROUTE_PATH, REGEX } from '@/app/lib/constant';
import { resendVerificationEmail } from '@/app/lib/service/registerService';
import { useResendCooldown } from '@/app/hooks/useResendCooldown';
import { notification } from '@/app/lib/notify';
import '../../ui/components/login.scss';

const ResendVerification = () => {
  const [form] = Form.useForm();
  const searchParams = useSearchParams();
  const t = useTranslations('ResendVerification');
  const [isLoading, setIsLoading] = useState(false);
  const { secondsLeft, isCooldownActive, startCooldown } = useResendCooldown('page_resend_verification');

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      form.setFieldsValue({ email: emailParam });
    }
  }, [searchParams, form]);

  const onFinish = async (values: { email: string }) => {
    setIsLoading(true);
    try {
      const res = await resendVerificationEmail(values.email);
      if (res.status) {
        notification.success({
          message: t('success_title'),
          description: t('success_description'),
        });
        startCooldown(60);
      } else {
        const errorDesc =
          res.statusCode === 429 || res.data?.message?.includes?.('limit')
            ? res.data?.message || t('rate_limit_error')
            : res.data?.message || t('error_description');

        notification.error({
          message: t('error_title'),
          description: errorDesc,
        });

        if (res.statusCode === 429 || res.data?.message?.includes?.('limit')) {
          startCooldown(60);
        }
      }
    } catch {
      notification.error({
        message: t('error_title'),
        description: t('error_description'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page login-page">
      <Flex justify="center" className="logo">
        <Link href={ROUTE_PATH.HOME}>
          <Image priority src={logo} alt="Tiệm len Tiểu Phương" width={150} height={150} />
        </Link>
      </Flex>
      <Flex className="header-title" justify="center">
        <h3 className="title">{t('title')}</h3>
      </Flex>
      <Spin spinning={isLoading} tip="Loading...">
        <Row>
          <Col xs={20} sm={18} md={10}>
            <Form
              form={form}
              name="resend_verification"
              className="login-form layout-wrap"
              onFinish={onFinish}
              disabled={isLoading}
            >
              <p className="description-text" style={{ marginBottom: 24, textAlign: 'center' }}>
                {t('instruction')}
              </p>
              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                    message: t('error_msg_required_email'),
                  },
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
                <Row gutter={[10, 20]} align="middle">
                  <Col xs={24}>
                    <Button
                      block
                      type="primary"
                      loading={isLoading}
                      htmlType="submit"
                      className="login-form-button btn-border"
                      disabled={isLoading || isCooldownActive}
                      icon={<ReloadOutlined spin={isLoading} />}
                    >
                      {isCooldownActive
                        ? t('btn_resend_cooldown', { seconds: secondsLeft })
                        : t('btn_submit')}
                    </Button>
                  </Col>
                  <Col xs={24} style={{ textAlign: 'center', marginTop: 12 }}>
                    <Flex justify="space-between" align="center" style={{ width: '100%' }}>
                      <Link
                        href={ROUTE_PATH.LOGIN}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                      >
                        <LeftOutlined style={{ fontSize: 12 }} /> {t('back_to_login')}
                      </Link>
                      <Link href={ROUTE_PATH.REGISTER}>
                        {t('back_to_register')}
                      </Link>
                    </Flex>
                  </Col>
                </Row>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default ResendVerification;
