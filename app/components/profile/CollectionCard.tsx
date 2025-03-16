'use client'

import {Card, Flex, Tooltip, Typography} from 'antd';
import {DeleteOutlined, EditOutlined, FolderOutlined} from '@ant-design/icons';
import {useTranslations} from 'next-intl';
import {Collection} from '@/app/lib/definitions';
import CustomNextImage from '../next-image';
import React from "react";

const {Title, Text} = Typography;

interface CollectionCardProps {
    collection: Collection;
    onViewDetail?: () => void;
    onDelete?: () => void;
    onEdit?: () => void;
    isShowActions?: boolean;
}

const CollectionCard = ({
                            collection,
                            onViewDetail,
                            onDelete,
                            onEdit,
                            isShowActions = false
                        }: CollectionCardProps) => {
    const t = useTranslations('Profile');
    const {name, description, totalPatterns, avatar} = collection;

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onEdit) {
            onEdit();
        }
    }

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onDelete) {
            onDelete();
        }
    }

    return (
        <Card
            hoverable
            className="collection-card"
            onClick={onViewDetail}
            cover={
                avatar ? (
                    <CustomNextImage
                        src={avatar}
                        alt={name}
                        className="collection-thumbnail"
                    />
                ) : (
                    <div className="collection-placeholder">
                        <FolderOutlined/>
                    </div>
                )
            }
            actions={isShowActions ? [
                <Tooltip key="edit-tooltip" color='#fc8282' title={'edit'}>
                	<span key="edit" onClick={handleEdit}>
                		<EditOutlined style={{fontSize: 18}}/>
                	</span>
                </Tooltip>,
                <Tooltip key="delete-tooltip" color='#fc8282' title={'delete'}>
					<span key='delete' onClick={handleDelete}>
						<DeleteOutlined style={{fontSize: 18}}/>
					</span>
                </Tooltip>
            ] : []}
        >
            <Flex vertical gap={8}>
                <Title level={5} ellipsis={{rows: 1}} className="collection-name">
                    {name}
                </Title>

                {description && (
                    <Text type="secondary" ellipsis={{tooltip: true}} className="collection-description">
                        {description}
                    </Text>
                )}

                <Text className="collection-count">
                    {t('collections.itemCount')} ({(totalPatterns)})
                </Text>
            </Flex>
        </Card>
    );
};

export default CollectionCard; 