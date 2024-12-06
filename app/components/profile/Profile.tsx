import { Tabs, TabsProps } from 'antd';
import { useTranslations } from 'next-intl';
import Collections from './Collections';
import FreePatterns from './FreePatterns';
import UserInfo from './UserInfo';
import { User } from '@/app/lib/definitions';
import '../../ui/components/profile.scss';

interface ProfileProps {
    user: User;
}

const Profile = ({ user }: ProfileProps) => {
    const t = useTranslations('Profile');

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
        <div className="profile-page">
            <Tabs
                defaultActiveKey="info"
                items={items}
                className="profile-tabs"
            />
        </div>
    );
};

export default Profile; 