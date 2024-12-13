'use client'

import {Button, Tabs, TabsProps} from 'antd';
import {useTranslations} from 'next-intl';
import dynamic from 'next/dynamic';
import UserInfo from '../../components/profile/UserInfo';
import '../../ui/components/profile.scss';
import {useRouter} from 'next/navigation';
import {LeftOutlined} from '@ant-design/icons';
import Image from 'next/image';

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
        <div className="profile-container">
            <div className="profile-header">
                <Button type="text"
                        onClick={() => router.back()}
                        icon={<LeftOutlined/>}
                        className="profile-back-button"
                >
                    {t('back')}
                </Button>
                <div className="profile-cover-image">
                    <Image 
                        src="https://thumbs.dreamstime.com/z/gentle-nature-background-butterfly-blurred-324410107.jpg?ct=jpeg"
                        alt="Cover"
                        layout="fill"
                        objectFit="cover"
                    />
                </div>
            </div>

            <div className="profile-page">
                <div className="profile-avatar">
                    <Image 
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLZzaI3evVeum8z-v96EK2iW4WpyDHfGR0Mg&s"
                        alt="Avatar"
                        width={120}
                        height={120}
                    />
                </div>

                <Tabs
                    defaultActiveKey="info"
                    items={items}
                    className="profile-tabs"
                />
            </div>
        </div>
    );
};

export default Profile; 