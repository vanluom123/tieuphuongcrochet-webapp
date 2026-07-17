'use client'

import React, { useState } from 'react';
import { MailOutlined, LeftOutlined } from '@ant-design/icons';
import { Button, Col, Flex, Form, Input, Row, Spin } from 'antd';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

import logo from '@/public/logo.png';
import { ROUTE_PATH, REGEX } from '@/app/lib/constant';
import { passwordResetRequest } from '@/app/lib/service/registerService';
import { notification } from '@/app/lib/notify';
import '../../ui/components/login.scss';

const ForgotPassword = () => {
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
                    description: t('success_description')
                });
                form.resetFields();
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
                            name="forgot_password"
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
                                    prefix={<MailOutlined className="site-form-item-icon" />}
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
                                            disabled={isLoading}
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

export default ForgotPassword;
