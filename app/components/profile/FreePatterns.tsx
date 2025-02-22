'use client';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { Col, Empty, FloatButton, Pagination, Row, Spin } from 'antd';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { ExclamationCircleFilled, PlusOutlined } from '@ant-design/icons';
import { initialListParams, IResponseList, Pattern } from '@/app/lib/definitions';
import { deleteUserPattern, fetchUserPatterns } from '@/app/lib/service/profileService';
import { ROUTE_PATH } from '@/app/lib/constant';
import FreePatternCard from './FreePatternCard';
import FreePatternFormModal from './FreePatternFormModal';
import { modal, notification } from '@/app/lib/notify';

interface FreePatternsProps {
    isCreator: boolean;
    userId: string;
}

const FreePatterns = ({ isCreator, userId }: FreePatternsProps) => {
    const t = useTranslations('Profile');
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


    return (
        <Spin spinning={loading} size="large">
            <div className="patterns-tab">
                {patterns.totalRecords > 0 ? (
                    <div >
                        <Row gutter={[16, 16]}>
                            {patterns.data.map((pattern, index) => (
                                <Col xs={12} sm={12} lg={6} key={index}>
                                    <FreePatternCard
                                        isShowActions={isCreator}
                                        pattern={{ ...pattern, src: pattern.fileContent || '' }}
                                        onReadDetail={() => onViewPattern(pattern.id || '')}
                                        onDelete={() => showDeleteConfirm(pattern.id || '')}
                                        onEdit={() => onEditPattern(pattern.id || '')}
                                    />
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
                        {isCreator && (
                            <FloatButton type='primary'
                                className='float-btn-center-bottom'
                                tooltip={<div>{t('patterns.add')}</div>}
                                icon={<PlusOutlined />}
                                onClick={() => onAddPattern()} />
                        )}
                    </div>
                ) : (
                    (
                        <>
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        </>
                    )
                )}
            </div>
            <FreePatternFormModal
                modalData={modalData}
                setModalData={setModalData}
                onRefreshData={onRefreshData}
            />
        </Spin>
    );
};

export default memo(FreePatterns);
