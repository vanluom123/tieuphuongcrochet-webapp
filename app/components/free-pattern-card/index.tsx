'use client'

import React from 'react';
import {Avatar, Card, Flex, Skeleton, Tag} from 'antd';
import {UserOutlined} from '@ant-design/icons';
import {useTranslations} from 'next-intl';
import Link from 'next/link';

import {ROUTE_PATH, TRANSLATION_STATUS} from '@/app/lib/constant';
import {Pattern} from '@/app/lib/definitions';
import {getStatusColor} from '@/app/lib/utils';
import CustomNextImage from '../next-image';

import '../../ui/components/freePatternCard.scss';

interface FreePatternCardProps {
    width?: string | number;
    pattern: Pattern;
    onReadDetail?: () => void;
    onSave?: () => void;
    showSaveButton?: boolean;
    loading?: boolean;
}

const FreePatternCard = (
    {
        pattern = {name: '', author: '', src: ''},
        width,
        onReadDetail,
        loading,
    }: FreePatternCardProps) => {

    const {Meta} = Card;
    const {name, src, status, username, userAvatar, userId} = pattern;
    const t = useTranslations("FreePattern");

    const stopPropagation = (e: React.MouseEvent) => {
        e.stopPropagation();
    }

    return (
        <Card
            loading={loading}
            hoverable
            className='free-pattern-card card-item'
            style={{width: width || '100%'}}
            styles={{
                body: {
                    overflow: 'hidden',
                },
            }}
            cover={
                <>
                    {src && loading ?
                        <Skeleton.Image active/> :
                        <CustomNextImage src={src} alt={name}/>
                    }
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
                                            <UserOutlined/>

                                    }
                                    <Link href={`${ROUTE_PATH.PROFILE}/${userId}`}
                                          onClick={stopPropagation}
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
    )

}

export default FreePatternCard;
