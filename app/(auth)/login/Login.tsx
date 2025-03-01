'use client'

import React, { useEffect, useState } from 'react';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Divider, Flex, Form, Input, Row, Space, Spin } from 'antd';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from "next-auth/react";
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { User } from '@/app/lib/definitions';
import logo from '@/public/logo.png';
import { ROUTE_PATH, REGEX } from '@/app/lib/constant';
import { notification } from '@/app/lib/notify';
import '../../ui/components/login.scss';

const Login = () => {
    const [form] = Form.useForm();
    const router = useRouter();
    const { data: session, status } = useSession({ required: false });
    const t = useTranslations('Login');

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (session?.user?.email && status === 'authenticated') {
            router.push(ROUTE_PATH.DASHBOARD);
        }
    }, [session, router, status]);

    const onFinish = async (values: User) => {
        setIsLoading(true);
        try {
            const result = await signIn('credentials', {
                email: values.email,
                password: values.password,
                redirect: false,
            });
            // Handle successful login
            if (result?.error) {
                const description = result.status === 401 ? t('error_login_401_description') : result.error;
                notification.error({ message: t('error_login_title'), description });
            }
            setIsLoading(false);
        } catch (error) {
            if (error instanceof Error) {
                notification.error({ message: t('error_login_title'), description: error.message });
            } else {
                notification.error({ message: t('error_login_title'), description: t('error_login_unknown_error') });
            }
            setIsLoading(false);
        }
    };

    return (
        <div className='auth-page'>
            <Flex justify='center' className='logo'>
                <Link href={ROUTE_PATH.HOME} >
                    <Image priority src={logo} alt='Tiệm len Tiểu Phương' width={150} height={150} />
                </Link>
            </Flex>
            <Flex
                className="header-title"
                justify='center'>
                <h3 className="title">{t('title')}</h3>
            </Flex>
            <Spin spinning={isLoading} tip="Loading...">
                <Row >
                    <Col xs={20} sm={18} md={10}>
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
                                    {
                                        required: true,
                                        message: t('error_msg_required_email')
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
                                    autoComplete='email'
                                    prefix={<MailOutlined className="site-form-item-icon" />}
                                />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: t('error_msg_required_password')
                                    },
                                    {
                                        pattern: new RegExp(REGEX.PASSWORD),
                                        message: t('error_msg_incorrect_password'),
                                    },
                                ]}
                            >
                                <Input.Password
                                    autoComplete="new-password"
                                    prefix={<LockOutlined className="site-form-item-icon" />}
                                    placeholder={t('input_password')} />
                            </Form.Item>
                            <Form.Item>
                                <Form.Item name="remember" valuePropName="checked" noStyle>
                                    <Checkbox>{t('remember_me')}</Checkbox>
                                </Form.Item>

                                <Link className="login-form-forgot" href="#">
                                    {t('forgot_password')}
                                </Link>
                            </Form.Item>
                            <Form.Item name='actions' className='actions'>
                                <Space size='small' direction="horizontal" style={{ width: '100%' }}>
                                    <Button
                                        type="primary"
                                        loading={isLoading}
                                        htmlType="submit"
                                        className="login-form-button btn-border"
                                        disabled={isLoading}
                                    >
                                        {t('btn_login')}
                                    </Button> Or <Link href={ROUTE_PATH.REGISTER}>{t('btn_register')}</Link>
                                </Space>
                            </Form.Item>
                        </Form>
                        <Divider>Or</Divider>
                        <Link href={`${process.env.NEXT_PUBLIC_API_URL}/oauth2/authorize/google?redirect_uri=${process.env.NEXT_PUBLIC_URL}/oauth2/redirect`}>
                            {t('btn_google_login')}
                        </Link>
                    </Col>
                </Row>
            </Spin>
        </div>
    );
};

export default Login;

