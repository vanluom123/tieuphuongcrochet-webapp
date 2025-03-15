import React, { useEffect, useMemo, useState } from 'react';
import { Col, FloatButton, Row, Spin } from 'antd';
import { useTranslations } from 'next-intl';
import { ExclamationCircleFilled, PlusOutlined } from '@ant-design/icons';
import CollectionCard from './CollectionCard';
import { useRouter } from 'next/navigation';
import { Collection } from '@/app/lib/definitions';
import { deleteCollection, fetchUserCollections } from '@/app/lib/service/profileService';
import { ROUTE_PATH } from '@/app/lib/constant';
import CollectionFormModal from './CollectionFormModal';
import { modal, notification } from "@/app/lib/notify";

interface CollectionProps {
    isCreator: boolean;
    userId: string;
}

const Collections = ({ isCreator, userId }: CollectionProps) => {
    const t = useTranslations('Profile');
    const router = useRouter();
    const [collections, setCollections] = useState<Collection[]>([]);
    const [modalData, setModalData] = useState({
        open: false,
        id: ''
    });
    const [loading, setLoading] = useState(false);

    const onViewCollection = (id: string) => {
        router.push(`${ROUTE_PATH.COLLECTIONS}/${id}`);
    };

    useEffect(() => {
        fetchUserCollections(userId)
            .then(data => {
                setCollections(data);
            });
    }, [userId]);

    const onAddCollection = () => {
        setModalData({ open: true, id: '' })
    };

    const onRefreshData = () => {
        setLoading(true);
        fetchUserCollections(userId)
            .then(data => {
                setCollections(data);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    const onDeleteCollection = (id: string) => {
        deleteCollection(id).then(res => {
            if (res.success) {
                notification.success({
                    message: 'Success',
                    description: 'Delete collection successfully'
                })
                onRefreshData();
            } else {
                notification.error({
                    message: 'Error',
                    description: 'Delete collection failed'
                })
            }
        });
    }

    const showDeleteConfirm = (id: string) => {
        modal.confirm({
            title: t('patterns.delete_confirm_title'),
            icon: <ExclamationCircleFilled />,
            content: t('patterns.delete_confirm_content'),
            okText: t('patterns.yes'),
            okType: 'danger',
            cancelText: t('patterns.no'),
            onOk() {
                onDeleteCollection(id);
            },
        });
    }

    const displayPlusButton = useMemo(() => {
        if (isCreator) {
            return (
                <FloatButton
                    type="primary"
                    tooltip={<div>{t('collections.add')}</div>}
                    shape="circle"
                    icon={<PlusOutlined />}
                    onClick={onAddCollection}
                />
            )
        }
        return null;
    }, [isCreator]);

    const onEdit = (id: string) => {
        setModalData({ open: true, id: `${id}` })
    }

    return (
        <Spin spinning={loading} size={"large"}>
            <div className="collections-tab">
                <Row gutter={[16, 16]}>
                    {collections.map((collection) => (
                        <Col xs={24} sm={12} lg={8} key={collection.id}>
                            <CollectionCard
                                isShowActions={isCreator}
                                collection={collection}
                                onViewDetail={() => onViewCollection(collection.id)}
                                onDelete={() => showDeleteConfirm(collection.id || '')}
                                onEdit={() => onEdit(collection.id || '')}
                            />
                        </Col>
                    ))}
                </Row>
                {displayPlusButton}
            </div>
            <CollectionFormModal
                modalData={modalData}
                setModalData={setModalData}
                onRefreshData={onRefreshData}
            />
        </Spin>
    );
};

export default Collections; 