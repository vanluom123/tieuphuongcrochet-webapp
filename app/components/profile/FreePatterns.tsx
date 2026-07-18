'use client';
import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {Col, Empty, FloatButton, Pagination, Row, Spin, Checkbox, Button, Flex} from 'antd';
import {useTranslations} from 'next-intl';
import {useRouter} from 'next/navigation';

import {ExclamationCircleFilled, PlusOutlined, FilePdfOutlined} from '@ant-design/icons';
import {initialListParams, IResponseList, Pattern} from '@/app/lib/definitions';
import {deleteUserPattern, fetchUserPatterns} from '@/app/lib/service/profileService';
import {ROUTE_PATH, USER_ROLES} from '@/app/lib/constant';
import FreePatternCard from '../free-pattern-card';
import FreePatternFormModal from './FreePatternFormModal';
import {modal, notification} from '@/app/lib/notify';
import {useSession} from 'next-auth/react';
import {handleTokenRefresh} from '@/app/lib/service/apiJwtService';
import PremiumUpgradeModal from '../premium/PremiumUpgradeModal';

interface FreePatternsProps {
    isCreator: boolean;
    userId: string;
}

const FreePatterns = ({ isCreator, userId }: FreePatternsProps) => {
    const t = useTranslations('Profile');
    const freePatternT = useTranslations('FreePattern');
    const { data: session } = useSession();
    const [patterns, setPatterns] = useState<IResponseList<Pattern>>({
        data: [],
        totalRecords: 0
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [modalData, setModalData] = useState({
        open: false,
        id: ''
    });
    const [params, setParams] = useState(initialListParams);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isExporting, setIsExporting] = useState(false);
    const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

    const handleBulkExport = async () => {
        const isPremium = session?.user?.role === USER_ROLES.PREMIUM_USER || session?.user?.role === USER_ROLES.ADMIN;
        if (!isPremium) {
            setIsPremiumModalOpen(true);
            return;
        }

        setIsExporting(true);
        try {
            const token = await handleTokenRefresh();
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/v1/free-pattern/export`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify(selectedIds)
            });

            if (!response.ok) throw new Error('Export failed');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'my-crochet-charts.zip';
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            notification.success({
                message: t('patterns.export_success') || 'Tải file zip thành công!'
            });
        } catch (error: any) {
            notification.error({
                message: t('patterns.export_error') || 'Xuất file PDF thất bại',
                description: error.message
            });
        } finally {
            setIsExporting(false);
        }
    };

    const onRefreshData = useCallback(() => {
        setLoading(true);
        fetchUserPatterns(userId, params)
            .then(({ data, totalRecords }) => setPatterns({
                data: data,
                totalRecords
            }))
            .catch(error => {
                notification.error({
                    message: t('patterns.load_error'),
                    description: error.message
                });
            })
            .finally(() => setLoading(false));
    }, [userId, params]);  // ✅ Chỉ thay đổi khi userId thay đổi

    useEffect(() => {
        onRefreshData();
    }, [onRefreshData]);  // ✅ Chỉ thay đổi khi onRefreshData

    const onViewPattern = (id: React.Key) => {
        router.push(`${ROUTE_PATH.FREEPATTERNS}/${id}`);
    };

    const showDeleteConfirm = (id: React.Key) => {
        modal.confirm({
            title: t('patterns.delete_confirm_title'),
            icon: <ExclamationCircleFilled />,
            content: t('patterns.delete_confirm_content'),
            okText: t('patterns.yes'),
            okType: 'danger',
            cancelText: t('patterns.no'),
            onOk() {
                onDeletePattern(id);
            },
        });
    };

    const onDeletePattern = (id: React.Key) => {
        deleteUserPattern(id.toString())
            .then(() => {
                notification
                    .success({
                        message: t('patterns.delete_success')
                    });
                onRefreshData();
            })
            .catch((error) => {
                notification.error({
                    message: t('patterns.delete_error'),
                    description: error.message
                });
            });
    };

    const onAddPattern = () => {
        setModalData({ open: true, id: '' })
    };

    const onEditPattern = (id: React.Key) => {
        setModalData({ open: true, id: `${id}` })
    };

    const onChange = (page: number, pageSize: number) => {
        setParams(prevParams => ({
            ...prevParams,
            pageNo: page - 1,  // Update the page number (assuming page is 1-based)
            pageSize: pageSize
        }));
    };

    const displayPlusButton = useMemo(() => {
        if (isCreator) {
            return (
                <FloatButton type='primary'
                    className='float-btn-center-bottom'
                    tooltip={<div>{t('patterns.add')}</div>}
                    icon={<PlusOutlined />}
                    onClick={() => onAddPattern()} />
            )
        }
        return null;
    }, [isCreator]);


    return (
        <Spin spinning={loading} size="large">
            <div className="patterns-tab">
                {isCreator && patterns.totalRecords > 0 && (
                    <Flex gap="small" align="center" style={{ marginBottom: 16 }}>
                        <Checkbox
                            checked={selectedIds.length === patterns.data.length && patterns.data.length > 0}
                            indeterminate={selectedIds.length > 0 && selectedIds.length < patterns.data.length}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    setSelectedIds(patterns.data.map(p => p.id?.toString() || ''));
                                } else {
                                    setSelectedIds([]);
                                }
                            }}
                        >
                            {t('patterns.select_all') || 'Chọn tất cả'}
                        </Checkbox>
                        <Button
                            type="primary"
                            icon={<FilePdfOutlined />}
                            disabled={selectedIds.length === 0}
                            loading={isExporting}
                            onClick={handleBulkExport}
                        >
                            {t('patterns.export_pdf_selected') || 'Xuất PDF các mục chọn (Premium)'}
                        </Button>
                    </Flex>
                )}

                {patterns.totalRecords > 0 ? (
                    <div >
                        <Row gutter={[{ xs: 8, sm: 16, xl: 24 }, { xs: 12, sm: 16, xl: 24 }]}>
                            {patterns.data.map((pattern, index) => (
                                <Col xs={12} sm={8} lg={6} key={index}>                                    
                                    <div style={{ position: 'relative' }}>
                                        {isCreator && (
                                            <Checkbox
                                                checked={selectedIds.includes(pattern.id?.toString() || '')}
                                                onChange={(e) => {
                                                    const idStr = pattern.id?.toString() || '';
                                                    if (e.target.checked) {
                                                        setSelectedIds(prev => [...prev, idStr]);
                                                    } else {
                                                        setSelectedIds(prev => prev.filter(id => id !== idStr));
                                                    }
                                                }}
                                                style={{
                                                    position: 'absolute',
                                                    top: 10,
                                                    left: 10,
                                                    zIndex: 11,
                                                    transform: 'scale(1.3)'
                                                }}
                                            />
                                        )}
                                        <FreePatternCard
                                            isShowActions={isCreator}
                                            pattern={{ ...pattern, src: pattern.fileContent || '' }}
                                            onReadDetail={() => onViewPattern(pattern.id || '')}
                                            onDelete={() => showDeleteConfirm(pattern.id || '')}
                                            onEdit={() => onEditPattern(pattern.id || '')}
                                        />
                                    </div>
                                </Col>
                            ))}
                        </Row>
                        <Pagination
                            className='pagination'
                            responsive
                            total={patterns.totalRecords}
                            // if not use value = -1}
                            {
                            ...(params.pageNo !== - 1 ? { current: params.pageNo + 1 } : {})
                            }
                            pageSize={params.pageSize}
                            showSizeChanger
                            showQuickJumper
                            showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                            onChange={onChange}
                        />
                    </div>
                ) : (
                    (
                        <>
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        </>
                    )
                )}
            </div>
            {displayPlusButton}
            <FreePatternFormModal
                modalData={modalData}
                setModalData={setModalData}
                onRefreshData={onRefreshData}
            />
            <PremiumUpgradeModal 
                open={isPremiumModalOpen} 
                onClose={() => setIsPremiumModalOpen(false)} 
            />
        </Spin>
    );
};

export default memo(FreePatterns);
