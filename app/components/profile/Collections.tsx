import { useState, useEffect } from 'react';
import { Row, Col, Empty } from 'antd';
import { useTranslations } from 'next-intl';
import CollectionCard from './CollectionCard';
import { useRouter } from 'next/navigation';
import { Collection } from '@/app/lib/definitions';
import { fetchUserCollections } from '@/app/lib/service/profileService';

const Collections = () => {
    const t = useTranslations('Profile');
    const [collections, setCollections] = useState<Collection[]>([]);
    const router = useRouter();

    const onViewCollection = (id: string) => {
        router.push(`/profile/collections/${id}`);
    };

    useEffect(() => {
        fetchUserCollections().then(data => {
            setCollections(data);
        });
    }, []);

    return (
        <div className="collections-tab">
            {collections.length > 0 ? (
                <Row gutter={[16, 16]}>
                    {collections.map((collection) => (
                        <Col xs={24} sm={12} lg={8} key={collection.id}>
                            <CollectionCard
                                collection={collection}
                                onViewDetail={() => onViewCollection(collection.id)}
                            />
                        </Col>
                    ))}
                </Row>
            ) : (
                <Empty description={t('collections.empty')} />
            )}
        </div>
    );
};

export default Collections; 