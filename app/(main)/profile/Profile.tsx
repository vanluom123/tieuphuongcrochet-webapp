'use client'

import { Button, Flex, Skeleton, Tabs, TabsProps } from 'antd';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { CameraOutlined, LeftOutlined, UserOutlined } from '@ant-design/icons';
import { useSession } from 'next-auth/react';

import { User } from '@/app/lib/definitions';
import { loadUserInfo, updateUserProfile } from '@/app/lib/service/profileService';
import { notification } from '@/app/lib/notify';
import SingleUpload from '@/app/components/upload-files/SingleUpload';
import { GENDER } from '@/app/lib/constant';
import UserInfo from '../../components/profile/UserInfo';
import defaultUser from '../../../public/default-user.png';
import defaultBackground from '../../../public/default-background.jpg';
import '../../ui/components/profile.scss';
// import Collections from "@/app/components/profile/Collections";

const FreePatterns = dynamic(() => import('../../components/profile/FreePatterns'), { ssr: false });

interface ProfileDetailProps {
    params: {
        slug: string;
    }
}

interface ProfileDetailProps {
    params: {
        slug: string;
    }
}

const ProfileDetail = ({ params }: ProfileDetailProps) => {
    const [loading, setLoading] = useState({
        avatar: false,
        cover: false
    });
    const [userData, setUserData] = useState<User | null>(null);

    const t = useTranslations('Profile');
    const router = useRouter();
    const { data: session } = useSession();
    const userId = params?.slug;

    const isCreator = useMemo(() => {
        return params?.slug === session?.user?.id;
    }, [session?.user?.id, params?.slug]);

    const fetchUserData = useCallback(async () => {
        setLoading({ avatar: true, cover: true });
        try {
            const data = await loadUserInfo(userId);
            if (data?.email) {
                setUserData(data);
            }
        } catch (error) {
            console.error('Profile - Error loading user data:', error);
        } finally {
            setLoading({ avatar: false, cover: false });
        }
    }, [userId]);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    const items: TabsProps['items'] = isCreator ? [
        {
            key: 'patterns',
            label: t('tabs.patterns'),
            children: <FreePatterns userId={userId} isCreator={isCreator} />,
        },
        // {
        //     key: 'collections',
        //     label: t('tabs.collections'),
        //     children: <Collections userId={userId} isCreator={isCreator} />,
        // },
        {
            key: 'info',
            label: t('tabs.info'),
            children: <UserInfo userData={userData} setUserData={setUserData} />,
        },
    ] : [
        {
            key: 'patterns',
            label: t('tabs.patterns'),
            children: <FreePatterns userId={userId} isCreator={isCreator} />,
        },
    ];

    const onUploadAvatar = async (file: string) => {
        if (file) {
            setLoading({ ...loading, avatar: true });
            const updatedUser = await updateUserProfile({
                imageUrl: file
            });

            setUserData(updatedUser);
            setLoading({ ...loading, avatar: false });
            notification.success({
                message: t('message.upload_avatar_success')
            });
        }
    }

    const onUploadCover = async (file: string) => {
        if (file) {
            setLoading({ ...loading, cover: true });
            const updatedUser = await updateUserProfile({
                backgroundImageUrl: file
            });
            setUserData(updatedUser);
            setLoading({ ...loading, cover: false });
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
                    {
                        loading.cover ? <Skeleton.Node className='skeleton-cover' style={{ width: '100%', height: '100%' }} active={loading.cover} /> :
                            <Image
                                src={userData?.backgroundImageUrl || defaultBackground}
                                alt="User cover image"
                                layout="fill"
                                style={{ objectFit: 'cover' }} 
                            />
                    }

                    <Flex className="profile-avatar container" align="center" justify="start" gap="10px">
                        <span className="profile-avatar-image">
                            {
                                loading.avatar ? <Skeleton.Image
                                    active
                                    style={{ width: 120, height: 120, lineHeight: '120px', borderRadius: '50%' }}
                                    className='skeleton-avatar'
                                /> :
                                    <Image
                                        src={userData?.imageUrl || defaultUser}
                                        alt="User Avatar"
                                        width={120}
                                        height={120}
                                        priority
                                    />
                            }
                            {
                                isCreator && (
                                    <SingleUpload
                                        className="profile-avatar-image-upload"
                                        onUpload={onUploadAvatar}
                                        icon={<CameraOutlined />}
                                    />
                                )
                            }
                        </span>
                        <span className="profile-info">
                            {
                                !userData?.name ? <Skeleton active title={{ width: '240px' }} paragraph={{ rows: 1 }} /> :

                                    <>
                                        <div className="profile-info-name">{userData?.name}</div>

                                        {
                                            userData?.gender &&
                                            <div className="profile-info-gender">
                                                <UserOutlined />:&nbsp;
                                                <span>{userData?.gender === GENDER.male ? t('info.gender_male') : t('info.gender_female')}</span>
                                            </div>
                                        }
                                    </>
                            }
                        </span>
                    </Flex>
                    {
                        isCreator && (
                            <SingleUpload
                                className="profile-cover-image-upload"
                                onUpload={onUploadCover}
                                icon={<CameraOutlined />}
                            />
                        )
                    }
                </div>
                <div className='profile-dark'></div>
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

export default ProfileDetail;