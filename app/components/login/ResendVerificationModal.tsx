'use client'
import React, { useState } from 'react';
import { Modal, Form, Input, Button, Spin } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import { REGEX } from '@/app/lib/constant';
import { resendVerificationEmail } from '@/app/lib/service/resendVerificationEmailService';
import { notification } from '@/app/lib/notify';

interface ResendVerificationModalProps {
    isOpen: boolean;
    onCancel: () => void;
}

const ResendVerificationModal: React.FC<ResendVerificationModalProps> = ({
    isOpen,
    onCancel
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const t = useTranslations('VerificationEmail');

    const handleSubmit = async (values: { email: string }) => {
        try {
            setLoading(true);
            const response = await resendVerificationEmail(values.email);

            if (response.success) {
                notification.success({
                    message: t('success_resend_title'),
                    description: t('success_resend_description')
                });
                form.resetFields();
                onCancel();
            } else {
                notification.error({
                    message: t('error_resend_title'),
                    description: response.message || t('error_resend_unknown')
                });
            }
        } catch (error) {
            notification.error({
                message: t('error_resend_title'),
                description: error instanceof Error ? error.message : t('error_resend_unknown')
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={t('title')}
            open={isOpen}
            onCancel={onCancel}
            footer={null}
        >
            <Spin spinning={loading}>
                <p>{t('description')}</p>
                <Form form={form} onFinish={handleSubmit}>
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
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            block
                        >
                            {t('btn_resend')}
                        </Button>
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    );
};

export default ResendVerificationModal;