import { Form, Input, Button, Upload, Avatar, DatePicker, Select, message } from 'antd';
import { UserOutlined, LoadingOutlined } from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import { User } from '@/app/lib/definitions';
import { updateUserProfile } from '@/app/lib/service/profileService';
import { useState, useEffect } from 'react';
import uploadFile from '@/app/lib/service/uploadFilesSevice';
import { notification } from '@/app/lib/notify';
import { useSession } from 'next-auth/react';
import type { RcFile } from 'antd/es/upload/interface';
import dayjs from 'dayjs';

const UserInfo = () => {
    const t = useTranslations('Profile');
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { data: session, update } = useSession();
    const [imageUrl, setImageUrl] = useState<string>('');

    useEffect(() => {
        if (session?.user) {
            setImageUrl(session.user.imageUrl || '');
            form.setFieldsValue({
                name: session.user.name,
                email: session.user.email,
                avatar: session.user.imageUrl,
                phone: session.user.phone,
                birthDate: session.user.birthDate ? dayjs(session.user.birthDate) : null,
                gender: session.user.gender
            });
        }
    }, [session, form]);

    const beforeUpload = (file: RcFile) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    const customUpload = async ({ file, onSuccess, onError }: any) => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('files', file);

            const res = await uploadFile.upload(formData);

            if (res && res.length > 0) {
                const avatarUrl = res[0].fileContent;
                setImageUrl(avatarUrl);
                form.setFieldValue('avatar', avatarUrl);
                onSuccess('ok');
                notification.success({
                    message: 'Success',
                    description: 'Avatar uploaded successfully!'
                });
            } else {
                throw new Error('Upload failed');
            }
        } catch (error) {
            onError('Upload failed');
            notification.error({
                message: 'Error',
                description: 'Failed to upload avatar'
            });
        } finally {
            setLoading(false);
        }
    };
    const onFinish = async (values: User) => {
        try {
            const updatedUser = await updateUserProfile({
                ...values,
                imageUrl: imageUrl || session?.user?.imageUrl,
                birthDate: typeof values.birthDate === 'string' ? values.birthDate : dayjs(values.birthDate).format('YYYY-MM-DD')
            });

            if (updatedUser && session?.user) {
                await update({
                    ...session.user,
                    ...values,
                    imageUrl: imageUrl || session?.user?.imageUrl
                });

                notification.success({
                    message: t('info.update_success')
                });
            }
        } catch (error) {
            notification.error({
                message: t('info.update_error')
            });
        }
    };

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <UserOutlined />}
            <div style={{ marginTop: 8 }}>{t('info.change_avatar')}</div>
        </div>
    );

    return (
        <div className="user-info-tab">
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    ...session?.user,
                    imageUrl: imageUrl || session?.user?.imageUrl,
                    birthDate: session?.user?.birthDate ? dayjs(session.user.birthDate) : null
                }}
                onFinish={onFinish}
            >
                <Form.Item name="avatar" className="avatar-section">
                    <Upload
                        name="avatar"
                        listType="picture-circle"
                        showUploadList={false}
                        customRequest={customUpload}
                        beforeUpload={beforeUpload}
                    >
                        {imageUrl ? (
                            <Avatar
                                size={100}
                                src={imageUrl}
                                alt="avatar"
                            />
                        ) : (
                            uploadButton
                        )}
                    </Upload>
                </Form.Item>

                <Form.Item
                    name="name"
                    label={t('info.name')}
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="email"
                    label={t('info.email')}
                    rules={[{ required: true, type: 'email' }]}
                >
                    <Input disabled />
                </Form.Item>

                <Form.Item
                    name="phone"
                    label={t('info.phone')}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="birthDate"
                    label={t('info.birthDate')}
                >
                    <DatePicker style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    name="gender"
                    label={t('info.gender')}
                >
                    <Select>
                        <Select.Option value="male">{t('info.gender_male')}</Select.Option>
                        <Select.Option value="female">{t('info.gender_female')}</Select.Option>
                        <Select.Option value="other">{t('info.gender_other')}</Select.Option>
                    </Select>
                </Form.Item>

                <Button type="primary" htmlType="submit">
                    {t('info.save')}
                </Button>
            </Form>
        </div>
    );
};

export default UserInfo;