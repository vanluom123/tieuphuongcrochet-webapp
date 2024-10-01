'use client'

import React from 'react';
import { Card, Flex, Image, Skeleton, Tag } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useTranslations } from 'next-intl';

import { IMAGE_FALLBACK, TRANSLATION_STATUS } from '@/app/lib/constant';
import { Pattern } from '@/app/lib/definitions';
import { getStatusColor } from '@/app/lib/utils';

import '../../ui/components/freePatternCard.scss';

interface FreePatternCardProps {
	width?: string | number;
	pattern: Pattern;
	onReadDetail?: () => void;
	onSave?: () => void;
	showSaveButton?: boolean;
	loading?: boolean;
};

const FreePatternCard = (
	{
		pattern = { name: '', author: '', src: '' },
		width,
		onReadDetail,
		loading,
	}: FreePatternCardProps) => {

	const { Meta } = Card;
	const { name, src, author, imagesPreview, status } = pattern;
	const t = useTranslations("FreePattern");

	return (
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
						<Image.PreviewGroup
							items={imagesPreview}
						>
							<Image
								alt={name}
								src={src}
								fallback={IMAGE_FALLBACK}
							/>
						</Image.PreviewGroup>
					}
				</>
			}
		>
			<Skeleton loading={!name} active>
				{name &&
					<Meta
						title={<span tabIndex={1} className='card-title' onClick={onReadDetail}>{name}</span>}
						description={
							<Flex justify='space-between' align='center'>
								<div className='author'>
									<UserOutlined />&nbsp;{author}
								</div>
								{
									(status && status !== TRANSLATION_STATUS.NONE) &&
									<Tag className='status-tag' color={getStatusColor(status)}>{t(`status.${status}`)}</Tag>
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
