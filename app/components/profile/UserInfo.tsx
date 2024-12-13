import { Form, Input, Button, Upload, Avatar, DatePicker, Select, message } from 'antd';
import { UserOutlined, LoadingOutlined } from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import { User } from '@/app/lib/definitions';
import { updateUserProfile, loadUserInfo } from '@/app/lib/service/profileService';
import { useState, useEffect } from 'react';
import uploadFile from '@/app/lib/service/uploadFilesSevice';
import { notification } from '@/app/lib/notify';
import dayjs from 'dayjs';
import { RcFile } from 'antd/es/upload';

interface UserState {
    loading: boolean;
    error: string | null;
    imageUrl: string | null;
    data: User | null;
}

const UserInfo = () => {
    const t = useTranslations('Profile');
    const [form] = Form.useForm();
    const [userData, setUserData] = useState<UserState>({
        loading: false,
        error: null,
        imageUrl: null,
        data: null
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await loadUserInfo();
                console.log('data', data);
                setUserData({
                    loading: false,
                    error: null,
                    imageUrl: data.imageUrl,
                    data: data
                });
                form.setFieldsValue({
                    name: data.name,
                    email: data.email,
                    avatar: data.imageUrl,
                    phone: data.phone,
                    birthDate: data.birthDate ? dayjs(data.birthDate) : null,
                    gender: data.gender
                });
            } catch (error) {
                notification.error({
                    message: t('info.load_error')
                });
            }
        };
        fetchUserData();
    }, [form]);

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
            setUserData(prev => ({ ...prev, loading: true }));
            const formData = new FormData();
            formData.append('files', file);

            const res = await uploadFile.upload(formData);

            if (res && res.length > 0) {
                const avatarUrl = res[0].fileContent;
                setUserData(prev => ({ ...prev, imageUrl: avatarUrl }));
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
            setUserData(prev => ({ ...prev, loading: false }));
        }
    };
    const onFinish = async (values: User) => {
        try {
            const updatedUser = await updateUserProfile({
                name: values.name,
                imageUrl: userData?.imageUrl,
                phone: values.phone,
                birthDate: typeof values.birthDate === 'string' ? values.birthDate : dayjs(values.birthDate).format('YYYY-MM-DD'),
                gender: values.gender,
                backgroundImageUrl: values.backgroundImageUrl
            });

            if (updatedUser) {
                setUserData(updatedUser);
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
            {userData.loading ? <LoadingOutlined /> : <UserOutlined />}
            <div style={{ marginTop: 8 }}>{t('info.change_avatar')}</div>
        </div>
    );

    return (
        <div className="user-info-tab">
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    ...userData,
                    imageUrl: userData?.imageUrl,
                    birthDate: userData?.data?.birthDate ? dayjs(userData.data.birthDate) : null
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
                        {userData.imageUrl ? (
                            <Avatar
                                size={100}
                                src={userData.imageUrl}
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