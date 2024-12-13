import {useEffect, useState} from 'react';
import {Col, FloatButton, Row} from 'antd';
import {useTranslations} from 'next-intl';
import {PlusOutlined} from '@ant-design/icons';
import CollectionCard from './CollectionCard';
import {useRouter} from 'next/navigation';
import {Collection} from '@/app/lib/definitions';
import {fetchUserCollections} from '@/app/lib/service/profileService';
import {ROUTE_PATH} from '@/app/lib/constant';
import CollectionFormModal from './CollectionFormModal';

const Collections = () => {
    const t = useTranslations('Profile');
    const router = useRouter();

    const [collections, setCollections] = useState<Collection[]>([]);

    const [modalData, setModalData] = useState({
        open: false,
        id: ''
    });

    const onViewCollection = (id: string) => {
        router.push(`${ROUTE_PATH.COLLECTIONS}/${id}`);
    };

    useEffect(() => {
        fetchUserCollections().then(data => {
            setCollections(data);
        });
    }, []);

    const onAddCollection = () => {
        setModalData({open: true, id: ''})
    };

    return (
        <>
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
                    <FloatButton
                        type="primary"
                        tooltip={<div>{t('collections.add')}</div>}
                        shape="circle"
                        icon={<PlusOutlined/>}
                        onClick={onAddCollection}
                    />
                )}
            </div>
            <CollectionFormModal modalData={modalData} setModalData={setModalData}/>
        </>
    );
};

export default Collections; 