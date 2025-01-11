'use client'

import { Card, Typography, Flex } from 'antd';
import { FolderOutlined } from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import { Collection } from '@/app/lib/definitions';
import CustomNextImage from '../next-image';

const { Title, Text } = Typography;

interface CollectionCardProps {
    collection: Collection;
    onViewDetail?: () => void;
}

const CollectionCard = ({ collection, onViewDetail }: CollectionCardProps) => {
    const t = useTranslations('Profile');
    const { name, description, itemCount, avatar } = collection;

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
                        <FolderOutlined />
                    </div>
                )
            }
        >
            <Flex vertical gap={8}>
                <Title level={5} ellipsis={{ rows: 1 }} className="collection-name">
                    {name}
                </Title>

                {description && (
                    <Text type="secondary" ellipsis={{ tooltip: true }} className="collection-description">
                        {description}
                    </Text>
                )}

                <Text className="collection-count">
                    {t('collections.itemCount', { count: itemCount })}
                </Text>
            </Flex>
        </Card>
    );
};

export default CollectionCard; 