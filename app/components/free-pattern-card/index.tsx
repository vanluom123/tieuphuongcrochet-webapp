'use client'

import { Avatar, Button, Card, Flex, Skeleton, Tag, Tooltip } from 'antd';
import {
    UserOutlined,
    EditFilled,
    DeleteFilled
} from '@ant-design/icons';
import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ROUTE_PATH, TRANSLATION_STATUS } from '@/app/lib/constant';
import { Pattern } from '@/app/lib/definitions';
import { getStatusColor } from '@/app/lib/utils';
import CustomNextImage from '../next-image';
import { useBookmark } from '@/app/hooks/useBookmark';
import '../../ui/components/freePatternCard.scss';
import { useSession } from 'next-auth/react';
import { removePatternFromCollection } from '@/app/lib/service/collectionService';
import whiteBookmark from '@/public/white-bookmark.png';
import primaryBookmark from '@/public/primary-bookmark.png';
import Image from 'next/image';

interface FreePatternCardProps {
    width?: string | number;
    pattern: Pattern;
    onReadDetail?: () => void;
    loading?: boolean;
    isShowActions?: boolean;
    onDelete?: () => void;
    onEdit?: () => void;
    onUnbookmark?: () => void;
}

const FreePatternCard = (
    {
        pattern = { name: '', author: '', src: '' },
        width,
        onReadDetail,
        loading,
        isShowActions = false,
        onDelete,
        onEdit,
        onUnbookmark
    }: FreePatternCardProps) => {

    const { Meta } = Card;
    const { name, src, status, username, userAvatar, userId, id } = pattern;
    const t = useTranslations("FreePattern");
    const profileT = useTranslations("Profile");
    const { data: session } = useSession();
    const { isBookmarked, toggleBookmark, addToGlobalUnbookmarked } = useBookmark(id?.toString());

    // Tạo hàm xử lý bookmark an toàn
    const handleToggleBookmark = (patternId: string) => {
        if (!userId) return;
        if (isBookmarked) {
            try {
                removePatternFromCollection(patternId);
                // Sử dụng function từ useBookmark để cập nhật state global
                addToGlobalUnbookmarked(patternId);
                // Call the onUnbookmark callback if provided
                if (onUnbookmark) {
                    onUnbookmark();
                }
            } catch (error) {
                console.error('Error removing pattern from collection:', error);
            }
        }
        toggleBookmark(patternId);
    };

    return (
        <>
            <Card
                loading={loading}
                hoverable
                className='free-pattern-card card-item'
                style={{ width: width || '100%' }}
                styles={{
                    body: {
                        overflow: 'hidden',
                    },
                }}
                cover={
                    <>
                        {src && loading ? (
                            <Skeleton.Image active />
                        ) : (
                            <div className='card-cover-custom' style={{ position: 'relative' }}>
                                <div className='mark-dark'></div>

                                <Flex className="action-buttons" vertical>
                                    {/* Bookmark button remains unchanged */}
                                    {userId && (
                                        <Tooltip title={!session?.user
                                            ? t('login_to_save')
                                            : (isBookmarked ? t('remove_from_collection') : t('save'))
                                        }>
                                            <Button
                                                type="text"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleToggleBookmark(id?.toString() || '');
                                                }}
                                                className='action-button'
                                            >
                                                <Image width={20} height={20} src={isBookmarked ? primaryBookmark : whiteBookmark} alt='bookmark' />
                                            </Button>
                                        </Tooltip>
                                    )}
                                    {isShowActions && (

                                        <><Tooltip title={profileT('patterns.edit')}>
                                            <Button
                                                type="text"
                                                icon={<EditFilled />}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (onEdit) onEdit();
                                                }}
                                                className="action-button" />
                                        </Tooltip><Tooltip title={profileT('patterns.delete')}>
                                                <Button
                                                    type="text"
                                                    icon={<DeleteFilled />}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (onDelete) onDelete();
                                                    }}
                                                    className="action-button" />
                                            </Tooltip></>
                                    )}
                                </Flex>
                                <CustomNextImage src={src} alt={name} />

                            </div>
                        )}
                    </>
                }
                onClick={onReadDetail}
            >
                <Skeleton loading={!name} active>
                    {name &&
                        <Meta
                            title={<span tabIndex={1} className='card-title' onClick={onReadDetail}>{name}</span>}
                            description={
                                <Flex justify='space-between' align='center'>
                                    <div className='creator'>
                                        {
                                            userAvatar ?
                                                <Avatar
                                                    size='small'
                                                    src={userAvatar}
                                                />
                                                :
                                                <UserOutlined />

                                        }
                                        <Link href={`${ROUTE_PATH.PROFILE}/${userId}`}
                                            onClick={(e) => e.stopPropagation()}
                                            className='creator-link'
                                        >
                                            &nbsp;{username}
                                        </Link>
                                    </div>
                                    {
                                        (status && status !== TRANSLATION_STATUS.NONE) &&
                                        <Tag className='status-tag'
                                            color={getStatusColor(status)}>{t(`status.${status}`)}</Tag>
                                    }
                                </Flex>
                            }
                        />
                    }
                </Skeleton>
            </Card>
        </>
    )
}

export default FreePatternCard;
