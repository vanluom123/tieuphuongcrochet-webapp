'use client'

import {Button, Tabs, TabsProps} from 'antd';
import {useTranslations} from 'next-intl';
import dynamic from 'next/dynamic';
import UserInfo from '../../components/profile/UserInfo';
import '../../ui/components/profile.scss';
import {useRouter} from 'next/navigation';
import {LeftOutlined} from '@ant-design/icons';

const Collections = dynamic(() => import('../../components/profile/Collections'), { ssr: false });
const FreePatterns = dynamic(() => import('../../components/profile/FreePatterns'), { ssr: false });

const Profile = () => {
    const t = useTranslations('Profile');
    const router = useRouter();

    const items: TabsProps['items'] = [
        {
            key: 'info',
            label: t('tabs.info'),
            children: <UserInfo/>,
        },
        {
            key: 'collections',
            label: t('tabs.collections'),
            children: <Collections/>,
        },
        {
            key: 'patterns',
            label: t('tabs.patterns'),
            children: <FreePatterns/>,
        },
    ];

    return (
        <>
            <Button type="text"
                    onClick={() => router.back()}
                    icon={<LeftOutlined/>}
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