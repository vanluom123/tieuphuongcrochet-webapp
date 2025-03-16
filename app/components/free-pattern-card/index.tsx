'use client'

import { Avatar, Button, Card, Flex, Skeleton, Tag, Tooltip } from 'antd';
import { BookFilled, BookOutlined, UserOutlined } from '@ant-design/icons';
import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ROUTE_PATH, TRANSLATION_STATUS } from '@/app/lib/constant';
import { Pattern } from '@/app/lib/definitions';
import { getStatusColor } from '@/app/lib/utils';
import CustomNextImage from '../next-image';
import { useBookmark } from '@/app/hooks/useBookmark';
import '../../ui/components/freePatternCard.scss';

interface FreePatternCardProps {
    width?: string | number;
    pattern: Pattern;
    onReadDetail?: () => void;
    loading?: boolean;
}

const FreePatternCard = (
    {
        pattern = { name: '', author: '', src: '' },
        width,
        onReadDetail,
        loading,
    }: FreePatternCardProps) => {

    const { Meta } = Card;
    const { name, src, status, username, userAvatar, userId, id } = pattern;
    const t = useTranslations("FreePattern");
    const { isBookmarked, openBookmarkModal } = useBookmark(id?.toString());

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
                    <Tooltip key="bookmark" title={isBookmarked ? 'Đã lưu' : 'Lưu'}>
                        <Button
                            type="text"
                            icon={isBookmarked ? <BookFilled /> : <BookOutlined />}
                            onClick={(e) => {
                                e.stopPropagation();
                                openBookmarkModal(id?.toString() || '');
                            }}
                        />
                    </Tooltip>
                ]}
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
