import React, { memo, useCallback, useEffect, useState } from 'react';
import { Button, Col, FloatButton, Row, Spin } from 'antd';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { ExclamationCircleFilled, PlusOutlined } from '@ant-design/icons';
import { Pattern } from '@/app/lib/definitions';
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
    const [patterns, setPatterns] = useState<Pattern[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [modalData, setModalData] = useState({
        open: false,
        id: ''
    });

    const onRefreshData = useCallback(() => {
        setLoading(true);
        fetchUserPatterns(userId)
            .then(data => setPatterns(data))
            .finally(() => setLoading(false));
    }, [userId]);  // ✅ Chỉ thay đổi khi userId thay đổi

    useEffect(() => {
        onRefreshData();
    }, [onRefreshData]);

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

    return (
        <Spin spinning={loading} size="large">
            <div className="patterns-tab">
                {patterns.length > 0 ? (
                    <>
                        <Row gutter={[16, 16]}>
                            {patterns.map((pattern, index) => (
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
                        {isCreator && (
                            <FloatButton type='primary'
                                tooltip={<div>{t('patterns.add')}</div>}
                                icon={<PlusOutlined />}
                                onClick={() => onAddPattern()} />
                        )}
                    </>
                ) : (
                    isCreator && (
                        <Button type="primary" shape="circle" icon={<PlusOutlined />} size='large'
                            onClick={() => onAddPattern()} />
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
