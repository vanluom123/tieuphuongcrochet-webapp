'use client'

import { Tabs, TabsProps, Spin, Flex, Button } from 'antd';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { LeftOutlined, CameraOutlined, UserOutlined } from '@ant-design/icons';

import { User } from '@/app/lib/definitions';
import { loadUserInfo, updateUserProfile } from '@/app/lib/service/profileService';
import { notification } from '@/app/lib/notify';
import SingleUpload from '@/app/components/upload-files/SingleUpload';
import { GENDER } from '@/app/lib/constant';
import UserInfo from '../../components/profile/UserInfo';
import defaultUser from '../../../public/default-user.png';
import defaultBackground from '../../../public/default-background.jpg';
import '../../ui/components/profile.scss';
import { useSession } from 'next-auth/react';

const FreePatterns = dynamic(() => import('../../components/profile/FreePatterns'), { ssr: false });

const Profile = () => {
    const t = useTranslations('Profile');
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<User | null>(null);
    const router = useRouter();
    const { data: session } = useSession();

    useEffect(() => {
        setLoading(true);
        const fetchUserData = async () => {
            try {
                const userId = session?.user?.id;
                if (!userId) {
                    throw new Error('Profile - User ID not found');
                }
                const data = await loadUserInfo(userId);
                if (data.email) {
                    setUserData(data);
                }
            } catch (error) {
                console.error('Profile - Error loading user data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    const items: TabsProps['items'] = [
        {
            key: 'patterns',
            label: t('tabs.patterns'),
            children: <FreePatterns />,
        },
        //  {
        //     key: 'collections',
        //     label: t('tabs.collections'),
        //     children: <Collections />,
        // },
        {
            key: 'info',
            label: t('tabs.info'),
            children: <UserInfo userData={userData} setUserData={setUserData} />,
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spin size="large" />
            </div>
        );
    }

    const onUploadAvatar = async (file: string) => {
        if (file) {
            const updatedUser = await updateUserProfile({
                imageUrl: file
            });

            setUserData(updatedUser);
            notification.success({
                message: t('message.upload_avatar_success')
            });
        }
    }

    const onUploadCover = async (file: string) => {
        if (file) {
            const updatedUser = await updateUserProfile({
                backgroundImageUrl: file
            });
            setUserData(updatedUser);
            notification.success({
                message: t('message.upload_cover_success')
            });
        }
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="profile-cover-image">
                    <Button
                        type='primary'
                        shape='circle'
                        onClick={() => router.back()}
                        icon={<LeftOutlined />}
                        className="profile-back-button"
                    />
                    <Image
                        src={userData?.backgroundImageUrl || defaultBackground}
                        alt="Cover"
                        layout="fill"
                        objectFit="cover"
                    />
                    <Flex className="profile-avatar container" align="center" justify="start" gap="10px">
                        <span className="profile-avatar-image">
                            <Image
                                src={userData?.imageUrl || defaultUser}
                                alt="Avatar"
                                width={120}
                                height={120}
                            />
                            <SingleUpload
                                isCrop
                                className="profile-avatar-image-upload"
                                onUpload={(file) => onUploadAvatar(file)}
                                icon={<CameraOutlined />}
                            />
                        </span>
                        <span className="profile-info">
                            <div className="profile-info-name">{userData?.name}</div>
                            <div className="profile-info-gender">
                                <UserOutlined />:&nbsp;
                                <span>{userData?.gender === GENDER.male ? t('info.gender_male') : t('info.gender_female')}</span>
                            </div>
                        </span>
                    </Flex>
                    <SingleUpload
                        className="profile-cover-image-upload"
                        onUpload={onUploadCover}
                        icon={<CameraOutlined />}
                    />
                </div>
            </div>

            <div className="profile-page container">
                <Tabs
                    defaultActiveKey="patterns"
                    items={items}
                    className="profile-tabs"
                />
            </div>
        </div>
    );
};

export default Profile; 