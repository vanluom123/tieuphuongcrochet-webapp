'use client'

import { Avatar, Button, Card, Flex, Skeleton, Tag, Tooltip, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { BookFilled, BookOutlined, UserOutlined, EditOutlined, DeleteOutlined, MoreOutlined } from '@ant-design/icons';
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

interface FreePatternCardProps {
    width?: string | number;
    pattern: Pattern;
    onReadDetail?: () => void;
    loading?: boolean;
    isShowActions?: boolean;
    onDelete?: () => void;
    onEdit?: () => void;
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
    }: FreePatternCardProps) => {

    const { Meta } = Card;
    const { name, src, status, username, userAvatar, userId, id } = pattern;
    const t = useTranslations("FreePattern");
    const profileT = useTranslations("Profile");
    const { data: session } = useSession();
    const { isBookmarked, toggleBookmark } = useBookmark(id?.toString());

    // Tạo hàm xử lý bookmark an toàn
    const handleToggleBookmark = (patternId: string) => {
        if (!userId) return; // Không làm gì nếu không có userId
        toggleBookmark(patternId);
    };

    // Tạo menu cho nút 3 chấm
    const actionItems: MenuProps['items'] = [
        {
            key: 'edit',
            label: profileT('patterns.edit'),
            icon: <EditOutlined />,
            onClick: (e) => {
                e.domEvent.stopPropagation();
                if (onEdit) onEdit();
            },
        },
        {
            key: 'delete',
            label: profileT('patterns.delete'),
            icon: <DeleteOutlined />,
            onClick: (e) => {
                e.domEvent.stopPropagation();
                if (onDelete) onDelete();
            },
        },
    ];

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
                        {src && loading ?
                            <Skeleton.Image active /> :
                            <CustomNextImage src={src} alt={name} />
                        }
                    </>
                }
                onClick={onReadDetail}
                actions={[
                    userId ? (
                        <Tooltip key="bookmark" title={!session?.user ? t('login_to_save') : (isBookmarked ? t('remove_from_collection') : t('save'))}>
                            <Button
                                type="text"
                                icon={isBookmarked ? <BookFilled /> : <BookOutlined />}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleBookmark(id?.toString() || '');
                                }}
                            />
                        </Tooltip>
                    ) : null,
                    // Hiển thị menu 3 chấm khi isShowActions = true
                    isShowActions && (
                        <Dropdown key="more" menu={{ items: actionItems }} trigger={['click']}>
                            <Button
                                type="text"
                                icon={<MoreOutlined />}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </Dropdown>
                    ),
                ].filter(Boolean)}
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
