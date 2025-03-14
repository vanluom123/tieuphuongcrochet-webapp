'use client'

import {Card, Flex, Tooltip, Typography} from 'antd';
import {DeleteOutlined, FolderOutlined} from '@ant-design/icons';
import {useTranslations} from 'next-intl';
import {Collection} from '@/app/lib/definitions';
import CustomNextImage from '../next-image';
import React from "react";

const {Title, Text} = Typography;

interface CollectionCardProps {
    collection: Collection;
    onViewDetail?: () => void;
    onDelete?: () => void;
    isShowActions?: boolean;
}

const CollectionCard = ({
                            collection,
                            onViewDetail,
                            onDelete,
                            isShowActions = false
                        }: CollectionCardProps) => {
    const t = useTranslations('Profile');
    const {name, description, itemCount, avatar} = collection;

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
                // <Tooltip key="edit-tooltip" color='#fc8282' title={t('patterns.edit')}>
                // 	<span key="edit" onClick={onEdit}>
                // 		<EditOutlined style={{fontSize: 18}}/>
                // 	</span>
                // </Tooltip>,
                <Tooltip key="delete-tooltip" color='#fc8282' title={'delete'}>
					<span key='delete' onClick={onDelete}>
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
                    {t('collections.itemCount', {count: itemCount})}
                </Text>
            </Flex>
        </Card>
    );
};

export default CollectionCard; 