'use client'
import React, { useState } from 'react';
import { Modal, Form, Input, Button, Spin } from 'antd';
import { useTranslations } from 'next-intl';
import { REGEX } from '@/app/lib/constant';
import { registerService } from "@/app/lib/service/registerService";
import { notification } from "@/app/lib/notify";
import ActiveAccountModal from '@/app/(auth)/register/ActiveAccountModal';

interface RegisterModalProps {
    isOpen: boolean;
    onCancel: () => void;
    onLoginClick: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({
    isOpen,
    onCancel,
    onLoginClick
}) => {
    const [form] = Form.useForm();
    const t = useTranslations('Register');
    const [formState, setFormState] = useState({ 
        isDisable: false, 
        isModalVisible: false, 
        isLoading: false 
    });

    const onSubmitRegister = async (values: any) => {
        setFormState({ ...formState, isDisable: true, isLoading: true });
        const res = await registerService(values);
        if (res?.status) {
            setFormState({ ...formState, isModalVisible: true });
            form.resetFields();
        } else if (res?.statusCode) {
            notification.error({ 
                message: t('error_register_title'), 
                description: t(`error_register_${res.statusCode}`) 
            });
        }
        setFormState({ ...formState, isDisable: false, isLoading: false });
    }

    return (
        <>
            <Modal
                title={t('title')}
                open={isOpen}
                onCancel={onCancel}
                footer={null}
                width={420}
            >
                <Spin spinning={formState.isLoading}>
                    <Form
                        form={form}
                        onFinish={onSubmitRegister}
                        disabled={formState.isDisable}
                    >
                        <Form.Item
                            name="email"
                            rules={[
                                { required: true, message: t('error_msg_required_email') },
                                { pattern: new RegExp(REGEX.EMAIL), message: t('error_msg_incorrect_email') }
                            ]}
                        >
                            <Input placeholder={t('input_email')} />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[
                                { required: true, message: t('error_msg_required_password') },
                                { pattern: new RegExp(REGEX.PASSWORD), message: t('error_msg_incorrect_password') }
                            ]}
                        >
                            <Input.Password placeholder={t('input_password')} />
                        </Form.Item>

                        <Form.Item
                            name="confirmPassword"
                            dependencies={['password']}
                            rules={[
                                { required: true, message: t('error_msg_required_confirm_password') },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error(t('error_msg_incorrect_confirm_password')));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder={t('input_confirm_password')} />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" block>
                                {t('btn_register')}
                            </Button>
                        </Form.Item>

                        <div className="login-option">
                            {t('account_exist')} <Button type="link" onClick={onLoginClick}>{t('btn_sign_in')}</Button>
                        </div>
                    </Form>
                </Spin>
            </Modal>

            <ActiveAccountModal
                isOpen={formState.isModalVisible}
                onCancel={() => {
                    setFormState({ ...formState, isModalVisible: false });
                    onCancel();
                }}
                onClick={onLoginClick}
            />
        </>
    );
};

export default RegisterModal;