import { Button, Tabs, TabsProps } from 'antd';
import { useTranslations } from 'next-intl';
import Collections from '../../components/profile/Collections';
import FreePatterns from '../../components/profile/FreePatterns';
import UserInfo from '../../components/profile/UserInfo';
import { User } from '@/app/lib/definitions';
import '../../ui/components/profile.scss';
import { useRouter } from 'next/navigation';
import { LeftOutlined } from '@ant-design/icons';

interface ProfileProps {
    user: User;
}

const Profile = ({ user }: ProfileProps) => {
    const t = useTranslations('Profile');
    const router = useRouter();

    const items: TabsProps['items'] = [
        {
            key: 'info',
            label: t('tabs.info'),
            children: <UserInfo user={user} />,
        },
        {
            key: 'collections',
            label: t('tabs.collections'),
            children: <Collections />,
        },
        {
            key: 'patterns',
            label: t('tabs.patterns'),
            children: <FreePatterns />,
        },
    ];

    return (
        <>
            <Button type="text" 
                onClick={() => router.back()}
                icon={<LeftOutlined />}
                className="profile-back-button"
            >
                {t('back')}
            </Button>
            <div className="profile-page">
                <Tabs
                    defaultActiveKey="info"
                    items={items}
                    className="profile-tabs"
                />
            </div>
        </>
    );
};

export default Profile; 