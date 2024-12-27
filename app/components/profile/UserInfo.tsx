import {Form, Input, Button, DatePicker, Select} from 'antd';
import {useTranslations} from 'next-intl';
import {User} from '@/app/lib/definitions';
import {updateUserProfile} from '@/app/lib/service/profileService';
import {useEffect} from 'react';
import {notification} from '@/app/lib/notify';
import dayjs from 'dayjs';

interface UserInfoProps {
    userData: User | null;
    setUserData: (user: User) => void;
}

const UserInfo = ({userData, setUserData}: UserInfoProps) => {
    const t = useTranslations('Profile');
    const [form] = Form.useForm();

    useEffect(() => {
        if (userData) {
            form.setFieldsValue({
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                birthDate: userData.birthDate ? dayjs(userData.birthDate) : null,
                gender: userData.gender
            });
        }
    }, [userData, form]);

    const onFinish = async (values: User) => {
        try {
            const updatedUser = await updateUserProfile({
                name: values.name,
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


    return (
        <div className="user-info-tab">
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    ...userData,
                    imageUrl: userData?.imageUrl,
                    birthDate: userData?.birthDate ? dayjs(userData.birthDate) : null
                }}
                onFinish={onFinish}
            >
                <Form.Item
                    name="name"
                    label={t('info.name')}
                    rules={[{required: true}]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    name="email"
                    label={t('info.email')}
                    rules={[{required: true, type: 'email'}]}
                >
                    <Input disabled/>
                </Form.Item>

                <Form.Item
                    name="phone"
                    label={t('info.phone')}
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    name="birthDate"
                    label={t('info.birthDate')}
                >
                    <DatePicker style={{width: '100%'}}/>
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