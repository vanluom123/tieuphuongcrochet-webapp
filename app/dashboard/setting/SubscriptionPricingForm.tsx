'use client'
import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, Spin } from 'antd';
import { fetchSettings, updateSetting } from '@/app/lib/service/settingService';

const SubscriptionPricingForm: React.FC = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const loadSettings = async () => {
            setLoading(true);
            try {
                const settings = await fetchSettings();
                const monthly = settings?.find(s => s.key === 'PAYMENT_MONTHLY_PRICE')?.value || '9.99';
                const yearly = settings?.find(s => s.key === 'PAYMENT_YEARLY_PRICE')?.value || '99.99';
                form.setFieldsValue({
                    PAYMENT_MONTHLY_PRICE: monthly,
                    PAYMENT_YEARLY_PRICE: yearly
                });
            } catch (error) {
                console.error('Failed to fetch settings:', error);
            } finally {
                setLoading(false);
            }
        };
        loadSettings();
    }, [form]);

    const onFinish = async (values: any) => {
        setSubmitting(true);
        try {
            await updateSetting({ key: 'PAYMENT_MONTHLY_PRICE', value: values.PAYMENT_MONTHLY_PRICE.toString() });
            await updateSetting({ key: 'PAYMENT_YEARLY_PRICE', value: values.PAYMENT_YEARLY_PRICE.toString() });
        } catch (error) {
            console.error('Failed to update settings:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Card title="Cấu hình giá Subscription" style={{ marginBottom: 20 }}>
            <Spin spinning={loading}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="PAYMENT_MONTHLY_PRICE"
                        label="Giá hàng tháng (USD)"
                        rules={[{ required: true, message: 'Vui lòng nhập giá hàng tháng' }]}
                    >
                        <Input type="number" step="0.01" placeholder="9.99" />
                    </Form.Item>
                    <Form.Item
                        name="PAYMENT_YEARLY_PRICE"
                        label="Giá hàng năm (USD)"
                        rules={[{ required: true, message: 'Vui lòng nhập giá hàng năm' }]}
                    >
                        <Input type="number" step="0.01" placeholder="99.99" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={submitting}>
                            Lưu cấu hình giá
                        </Button>
                    </Form.Item>
                </Form>
            </Spin>
        </Card>
    );
};

export default SubscriptionPricingForm;
