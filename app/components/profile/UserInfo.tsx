import { Form, Input, Button, Upload, Avatar, message } from 'antd';
import { UserOutlined, LoadingOutlined } from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import { User } from '@/app/lib/definitions';
import { updateUserProfile } from '@/app/lib/service/profileService';
import { useState } from 'react';
import uploadFile from '@/app/lib/service/uploadFilesSevice';
import { notification } from '@/app/lib/notify';
import { useSession } from 'next-auth/react';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';

interface UserInfoProps {
    user: User;
}

const UserInfo = ({ user }: UserInfoProps) => {
    const t = useTranslations('Profile');
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>(user?.imageUrl || '');
    const { update } = useSession();

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
                imageUrl: imageUrl || user?.imageUrl
            });

            if (updatedUser) {
                await update({
                    ...user,
                    name: values.name,
                    imageUrl: imageUrl || user?.imageUrl
                });

                notification.success({
                    message: t('info.update_success'),
                    description: t('info.profile_updated')
                });
            }
        } catch (error) {
            notification.error({
                message: t('info.update_error'),
                description: t('info.profile_update_failed')
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
                    ...user,
                    imageUrl: imageUrl || user?.imageUrl
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

                <Button type="primary" htmlType="submit">
                    {t('info.save')}
                </Button>
            </Form>
        </div>
    );
};

export default UserInfo; 