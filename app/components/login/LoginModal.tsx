'use client'
import React, { useState } from 'react';
import { Modal, Form, Input, Button, Checkbox, Row, Divider } from 'antd';
import { LockOutlined, MailOutlined, GoogleOutlined } from '@ant-design/icons';
import { signIn } from "next-auth/react";
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { REGEX } from '@/app/lib/constant';
import { notification } from '@/app/lib/notify';
import ResendVerificationModal from './ResendVerificationModal';
import RegisterModal from './RegisterModal';

interface LoginModalProps {
    isOpen: boolean;
    onCancel: () => void;
    onSuccess?: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({
    isOpen,
    onCancel,
    onSuccess
}) => {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [isResendModalVisible, setIsResendModalVisible] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const t = useTranslations('Login');

    const onFinish = async (values: { email: string; password: string; remember: boolean }) => {
        setIsLoading(true);
        try {
            const res = await signIn('credentials', {
                redirect: false,
                email: values.email,
                password: values.password
            });

            if (!res?.error) {
                form.resetFields();
                onSuccess?.();
                onCancel();
            } else {
                notification.error({
                    message: t('error_login_title'),
                    description: t('error_login_401_description')
                });
            }
        } catch (error) {
            notification.error({
                message: t('error_login_title'),
                description: t('error_login_unknown_error')
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Modal
                title={t('title')}
                open={isOpen && !showRegister}
                onCancel={onCancel}
                footer={null}
                width={420}
            >
                <Form
                    form={form}
                    name="login_modal"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: t('error_msg_required_email') },
                            { pattern: new RegExp(REGEX.EMAIL), message: t('error_msg_incorrect_email') }
                        ]}
                    >
                        <Input
                            prefix={<MailOutlined />}
                            placeholder={t('input_email')}
                            suffix={<span className="red-dot" />}
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                            { required: true, message: t('error_msg_required_password') },
                            { pattern: new RegExp(REGEX.PASSWORD), message: t('error_msg_incorrect_password') }
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder={t('input_password')}
                            suffix={<span className="red-dot" />}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Row justify="space-between" align="middle">
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                <Checkbox>{t('remember_me')}</Checkbox>
                            </Form.Item>
                            <Link className="login-form-forgot" href="#">
                                {t('forgot_password')}
                            </Link>
                        </Row>
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="login-form-button"
                            loading={isLoading}
                            block
                        >
                            {t('btn_login')}
                        </Button>
                    </Form.Item>

                    <div className="alternative-options">
                        <div className="register-option">
                            {t('text_Or')} <Button
                                type="link"
                                onClick={() => setShowRegister(true)}
                            >
                                {t('btn_register')}
                            </Button>
                        </div>
                        <div className="resend-email-option">
                            <Button
                                type="link"
                                onClick={() => setIsResendModalVisible(true)}
                            >
                                {t('resend_verification_email')}
                            </Button>
                        </div>
                    </div>

                    <Divider />

                    <Button
                        block
                        icon={<GoogleOutlined />}
                        onClick={() => signIn('google')}
                        className="google-login-button"
                    >
                        {t('btn_google_login')}
                    </Button>
                </Form>
            </Modal>

            <RegisterModal
                isOpen={isOpen && showRegister}
                onCancel={onCancel}
                onLoginClick={() => setShowRegister(false)}
            />

            <ResendVerificationModal
                isOpen={isResendModalVisible}
                onCancel={() => setIsResendModalVisible(false)}
            />
        </>
    );
};

export default LoginModal;