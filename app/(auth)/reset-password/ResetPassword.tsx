'use client'

import React, { useState } from 'react';
import { LockOutlined, LeftOutlined } from '@ant-design/icons';
import { Button, Col, Flex, Form, Input, Row, Spin } from 'antd';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import logo from '@/public/logo.png';
import { ROUTE_PATH, REGEX } from '@/app/lib/constant';
import { resetPassword } from '@/app/lib/service/registerService';
import { notification } from '@/app/lib/notify';
import '../../ui/components/login.scss';

interface ResetPasswordProps {
    token: string;
}

const ResetPassword = ({ token }: ResetPasswordProps) => {
    const [form] = Form.useForm();
    const router = useRouter();
    const t = useTranslations('ResetPassword');
    const [isLoading, setIsLoading] = useState(false);

    const onFinish = async (values: any) => {
        if (!token) {
            notification.error({
                message: t('error_title'),
                description: t('token_missing')
            });
            return;
        }

        setIsLoading(true);
        try {
            const res = await resetPassword(token, values.newPassword);
            if (res.status) {
                notification.success({
                    message: t('success_title'),
                    description: t('success_description')
                });
                setTimeout(() => {
                    router.push(ROUTE_PATH.LOGIN);
                }, 2000);
            } else {
                notification.error({
                    message: t('error_title'),
                    description: res.data?.message || t('error_description')
                });
            }
        } catch (error: any) {
            notification.error({
                message: t('error_title'),
                description: error?.message || t('error_description')
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='auth-page login-page'>
            <Flex justify='center' className='logo'>
                <Link href={ROUTE_PATH.HOME}>
                    <Image priority src={logo} alt='Tiệm len Tiểu Phương' width={150} height={150} />
                </Link>
            </Flex>
            <Flex className="header-title" justify='center'>
                <h3 className="title">{t('title')}</h3>
            </Flex>
            <Spin spinning={isLoading} tip="Loading...">
                <Row>
                    <Col xs={20} sm={18} md={10}>
                        <Form
                            form={form}
                            name="reset_password"
                            className="login-form layout-wrap"
                            onFinish={onFinish}
                            disabled={isLoading}
                        >
                            {!token && (
                                <p className="error-text" style={{ color: 'red', textAlign: 'center', marginBottom: 24 }}>
                                    {t('token_invalid_or_missing')}
                                </p>
                            )}
                            <Form.Item
                                name="newPassword"
                                rules={[
                                    {
                                        required: true,
                                        message: t('error_msg_required_password')
                                    },
                                    {
                                        pattern: REGEX.PASSWORD,
                                        message: t('password_pattern_msg')
                                    }
                                ]}
                            >
                                <Input.Password
                                    placeholder={t('input_new_password')}
                                    prefix={<LockOutlined className="site-form-item-icon" />}
                                />
                            </Form.Item>

                            <Form.Item
                                name="confirmPassword"
                                dependencies={['newPassword']}
                                rules={[
                                    {
                                        required: true,
                                        message: t('error_msg_required_confirm_password')
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('newPassword') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error(t('passwords_do_not_match')));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password
                                    placeholder={t('input_confirm_password')}
                                    prefix={<LockOutlined className="site-form-item-icon" />}
                                />
                            </Form.Item>
                            
                            <Form.Item className='actions'>
                                <Row gutter={[10, 20]} align='middle'>
                                    <Col xs={24}>
                                        <Button
                                            block
                                            type="primary"
                                            loading={isLoading}
                                            htmlType="submit"
                                            className="login-form-button btn-border"
                                            disabled={isLoading || !token}
                                        >
                                            {t('btn_submit')}
                                        </Button>
                                    </Col>
                                    <Col xs={24} style={{ textAlign: 'center', marginTop: 12 }}>
                                        <Link href={ROUTE_PATH.LOGIN} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                                            <LeftOutlined style={{ fontSize: 12 }} /> {t('back_to_login')}
                                        </Link>
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

export default ResetPassword;
