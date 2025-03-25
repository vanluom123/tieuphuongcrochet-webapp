import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Col, Empty, FloatButton, Row, Spin, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import { ExclamationCircleFilled, LeftOutlined, PlusOutlined } from '@ant-design/icons';
import CollectionCard from './CollectionCard';
import { Collection, initialListParams, IResponseList, Pattern } from '@/app/lib/definitions';
import { deleteCollection, fetchCollectionById, fetchFreePatternsByCollection, fetchUserCollections } from '@/app/lib/service/profileService';
import { ROUTE_PATH } from '@/app/lib/constant';
import CollectionFormModal from './CollectionFormModal';
import { modal, notification } from "@/app/lib/notify";
import FreePatternCard from '@/app/components/free-pattern-card';
import { useBookmarkModal } from '@/app/context/BookmarkModalContext';

const { Title, Paragraph } = Typography;

interface CollectionProps {
    isCreator: boolean;
    userId: string;
}

const Collections = ({ isCreator, userId }: CollectionProps) => {
    const t = useTranslations('Profile');
    const [collections, setCollections] = useState<Collection[]>([]);
    const [modalData, setModalData] = useState({
        open: false,
        id: ''
    });
    const [loading, setLoading] = useState(false);

    // New states for collection detail view
    const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
    const [collectionDetail, setCollectionDetail] = useState<Collection | null>(null);
    const [patterns, setPatterns] = useState<IResponseList<Pattern>>({
        data: [],
        totalRecords: 0
    });
    const [patternParams] = useState(initialListParams);
    // Add a refresh trigger
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const { collectionChanged, globalUnbookmarkedPatterns, addToGlobalUnbookmarked } = useBookmarkModal();

    const onViewCollection = (id: string) => {
        setSelectedCollection(id);
        loadCollectionDetail(id);
    };

    const loadCollectionDetail = useCallback(async (collectionId: string) => {
        setLoading(true);
        try {
            const [colData, patternsData] = await Promise.all([
                fetchCollectionById(userId, collectionId),
                fetchFreePatternsByCollection(userId, collectionId, patternParams)
            ]);

            const collectionData = colData.data;
            const patternsResult = {
                data: patternsData.data as Pattern[] || [],
                totalRecords: patternsData.totalRecords || 0
            };

            setCollectionDetail(collectionData);
            setPatterns(patternsResult);
        } catch (error) {
            console.error('Error loading collection detail:', error);
        } finally {
            setLoading(false);
        }
    }, [userId, patternParams]);

    const loadCollections = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchUserCollections(userId);
            setCollections(data);
        } catch (error) {
            console.error('Error loading collections:', error);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    // Function to refresh both collection list and detail data
    const refreshAllData = useCallback(() => {
        // Refresh collections list
        loadCollections();

        // If collection detail is open, refresh it too
        if (selectedCollection) {
            loadCollectionDetail(selectedCollection);
        }
    }, [loadCollections, loadCollectionDetail, selectedCollection]);

    // Handle pattern unbookmarked/removed event
    const handlePatternRemoved = () => {
        if (selectedCollection) {
            loadCollectionDetail(selectedCollection);
            // Cập nhật danh sách collections để đảm bảo số lượng pattern được cập nhật kịp thời
            loadCollections();
        }
    };

    // Load collections on mount and when triggers change
    useEffect(() => {
        loadCollections();
    }, [loadCollections]);

    // Reload when collection changes are detected
    useEffect(() => {
        if (collectionChanged) {
            loadCollections();
        }
    }, [collectionChanged, loadCollections]);

    // Add effect to refresh data when trigger changes
    useEffect(() => {
        if (refreshTrigger > 0) {
            refreshAllData();
        }
    }, [refreshTrigger, refreshAllData]);

    // Thêm hàm để làm mới danh sách collections sau khi quay lại từ collection detail
    const handleBackToCollections = () => {
        // Làm mới danh sách collections để cập nhật số lượng mẫu
        loadCollections();
        setSelectedCollection(null);
        setCollectionDetail(null);
    };

    // Sửa hàm loadCollectionDetail để theo dõi những pattern đã bị unbookmark
    useEffect(() => {
        if (selectedCollection && globalUnbookmarkedPatterns.size > 0) {
            loadCollectionDetail(selectedCollection);
        }
    }, [globalUnbookmarkedPatterns, selectedCollection, loadCollectionDetail]);

    const onAddCollection = () => {
        setModalData({ open: true, id: '' })
    };

    const onRefreshData = () => {
        loadCollections();
    }

    const onDeleteCollection = (id: string) => {
        // Trước khi xóa collection, lấy danh sách các pattern trong collection để cập nhật globalUnbookmarkedPatterns
        if (id) {
            fetchFreePatternsByCollection(userId, id, initialListParams).then(patternsData => {
                const patterns = patternsData.data as Pattern[] || [];
                
                // Tiến hành xóa collection
                deleteCollection(id).then(res => {
                    if (res.success) {
                        notification.success({
                            message: 'Success',
                            description: 'Delete collection successfully'
                        });

                        // Cập nhật globalUnbookmarkedPatterns để đánh dấu tất cả pattern trong collection bị xóa đã unbookmark
                        patterns.forEach(pattern => {
                            if (pattern.id) {
                                addToGlobalUnbookmarked(pattern.id.toString());
                            }
                        });

                        onRefreshData();
                    } else {
                        notification.error({
                            message: 'Error',
                            description: 'Delete collection failed'
                        });
                    }
                });
            }).catch(error => {
                console.error('Error fetching patterns before delete collection:', error);
                // Nếu có lỗi khi lấy patterns, vẫn tiếp tục xóa collection
                deleteCollection(id).then(res => {
                    if (res.success) {
                        notification.success({
                            message: 'Success',
                            description: 'Delete collection successfully'
                        });
                        onRefreshData();
                    } else {
                        notification.error({
                            message: 'Error',
                            description: 'Delete collection failed'
                        });
                    }
                });
            });
        }
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
        if (isCreator && !selectedCollection) {
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
    }, [isCreator, selectedCollection, t]);

    const onEdit = (id: string) => {
        setModalData({ open: true, id: `${id}` })
    }

    const onViewPattern = (id: React.Key) => {
        window.location.href = `${ROUTE_PATH.FREEPATTERNS}/${id}`;
    };

    return (
        <Spin spinning={loading} size={"large"}>
            <div className="collections-tab">
                {selectedCollection ? (
                    // Collection detail view
                    <div className="collection-detail-container">
                        <button
                            className="profile-back-button"
                            onClick={handleBackToCollections}
                        >
                            <LeftOutlined /> {t('back')}
                        </button>

                        {/* Collection header */}
                        {collectionDetail && (
                            <div className="collection-header mb-6">
                                <Title level={2}>{collectionDetail.name}</Title>
                                <Paragraph>{collectionDetail.description}</Paragraph>
                            </div>
                        )}

                        {/* Patterns grid */}
                        <div className="patterns-grid">
                            {patterns.data.length > 0 ? (
                                <Row gutter={[16, 16]}>
                                    {patterns.data.map((pattern) => (
                                        <Col xs={24} sm={12} md={8} lg={6} key={pattern.id}>
                                            <FreePatternCard
                                                pattern={pattern}
                                                onReadDetail={() => onViewPattern(pattern.id || '')}
                                                onUnbookmark={handlePatternRemoved}
                                            />
                                        </Col>
                                    ))}
                                </Row>
                            ) : (
                                <Empty description={t('collections.no_patterns')} />
                            )}
                        </div>
                    </div>
                ) : (
                    // Collections list view
                    <Row gutter={[16, 16]}>
                        {collections.length > 0 ? (
                            collections.map((collection) => (
                                <Col xs={24} sm={12} lg={8} key={collection.id}>
                                    <CollectionCard
                                        isShowActions={isCreator}
                                        collection={collection}
                                        onViewDetail={() => onViewCollection(collection.id)}
                                        onDelete={() => showDeleteConfirm(collection.id || '')}
                                        onEdit={() => onEdit(collection.id || '')}
                                    />
                                </Col>
                            ))
                        ) : (
                            <Col span={24} className="text-center">
                                <Empty description={t('collections.no_collections')} />
                            </Col>
                        )}
                    </Row>
                )}
                {displayPlusButton}
            </div>
            <CollectionFormModal
                modalData={modalData}
                setModalData={setModalData}
                onRefreshData={onRefreshData}
                userId={userId}
            />
        </Spin>
    );
};

export default Collections;