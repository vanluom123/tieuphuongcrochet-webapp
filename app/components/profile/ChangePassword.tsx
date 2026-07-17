import { Form, Input, Button } from 'antd';
import { useTranslations } from 'next-intl';
import { changeUserPassword } from '@/app/lib/service/profileService';
import { notification } from '@/app/lib/notify';
import { REGEX } from '@/app/lib/constant';
import { useState } from 'react';

const ChangePassword = () => {
    const t = useTranslations('Profile');
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const res = await changeUserPassword({
                oldPassword: values.oldPassword,
                newPassword: values.newPassword
            });

            if (res.success) {
                notification.success({
                    message: t('change_password.success_msg')
                });
                form.resetFields();
            } else {
                notification.error({
                    message: res.message || t('change_password.error_msg')
                });
            }
        } catch (error: any) {
            console.error('Error changing password:', error);
            notification.error({
                message: error?.response?.data?.message || t('change_password.error_msg')
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="user-info-tab">
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                style={{ maxWidth: 600 }}
            >
                <Form.Item
                    name="oldPassword"
                    label={t('change_password.old_password')}
                    rules={[{ required: true, message: t('change_password.old_password_required') }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="newPassword"
                    label={t('change_password.new_password')}
                    rules={[
                        { required: true, message: t('change_password.new_password_required') },
                        {
                            pattern: REGEX.PASSWORD,
                            message: t('change_password.password_pattern_msg')
                        }
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="confirmPassword"
                    label={t('change_password.confirm_password')}
                    dependencies={['newPassword']}
                    rules={[
                        { required: true, message: t('change_password.confirm_password_required') },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('newPassword') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error(t('change_password.passwords_do_not_match')));
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Button className='btn-border' type="primary" htmlType="submit" loading={loading}>
                    {t('change_password.submit')}
                </Button>
            </Form>
        </div>
    );
};

export default ChangePassword;
