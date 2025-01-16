'use client'

import React from 'react';
import { Card, Flex, Skeleton, Tag, Tooltip } from 'antd';
import { UserOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useTranslations } from 'next-intl';

import { TRANSLATION_STATUS } from '@/app/lib/constant';
import { Pattern } from '@/app/lib/definitions';
import { getStatusColor } from '@/app/lib/utils';
import CustomNextImage from '../next-image';

import '../../ui/components/freePatternCard.scss';

interface FreePatternCardProps {
	width?: string | number;
	pattern: Pattern;
	onReadDetail?: () => void;
	onSave?: () => void;
	showSaveButton?: boolean;
	loading?: boolean;
	isShowActions?: boolean;
	onDelete?: () => void;
	onEdit?: () => void;
};

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
	const { name, src, author, status, id } = pattern;
	const t = useTranslations("Profile");

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
						<CustomNextImage src={src} alt={name} />
					}
				</>
			}
			actions={isShowActions ? [
				<Tooltip key="edit-tooltip" color='#fc8282' title={t('patterns.edit')}>
					<span key="edit" onClick={onEdit}>
						<EditOutlined style={{ fontSize: 18 }} />
					</span>
				</Tooltip>,
				<Tooltip key="delete-tooltip" color='#fc8282' title={t('patterns.delete')}>
					<span key='delete' onClick={onDelete}>
						<DeleteOutlined style={{ fontSize: 18 }} />
					</span>
				</Tooltip>
			] : []}
		>
			<Skeleton loading={!name} active>
				{name &&
					<Meta
						title={<span tabIndex={1} className='card-title' onClick={onReadDetail}>{name}</span>}
						description={
							<Flex justify='space-between' align='center'>
								{
									(status && status !== TRANSLATION_STATUS.NONE) &&
									<Tag className='status-tag' color={getStatusColor(status)}>{t(`patterns.status.${status.toLowerCase()}`)}</Tag>
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
