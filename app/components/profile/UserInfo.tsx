import { Form, Input, Button, Upload, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import { User } from '@/app/lib/definitions';
import { updateUserProfile } from '@/app/lib/service/profileService';

interface UserInfoProps {
    user: User;
}

const UserInfo = ({ user }: UserInfoProps) => {
    const t = useTranslations('Profile');
    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        updateUserProfile(values).then(data => {
        });
    };

    return (
        <div className="user-info-tab">
            <Form
                form={form}
                layout="vertical"
                initialValues={user}
                onFinish={onFinish}
            >
                <div className="avatar-section">
                    <Avatar size={100} icon={<UserOutlined />} />
                    <Upload showUploadList={false}>
                        <Button>{t('info.change_avatar')}</Button>
                    </Upload>
                </div>

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