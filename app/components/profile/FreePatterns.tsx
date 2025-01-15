import { useEffect, useState } from 'react';
import { Row, Col, FloatButton, Button, Spin } from 'antd';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { PlusOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { Pattern } from '@/app/lib/definitions';
import { deleteUserPattern, fetchUserPatterns } from '@/app/lib/service/profileService';
import { ROUTE_PATH } from '@/app/lib/constant';
import FreePatternCard from './FreePatternCard';
import FreePatternFormModal from './FreePatternFormModal';
import { modal, notification } from '@/app/lib/notify';
import { useSession } from 'next-auth/react';

const FreePatterns = () => {
    const t = useTranslations('Profile');
    const [patterns, setPatterns] = useState<Pattern[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [modalData, setModalData] = useState({
        open: false,
        id: ''
    });
    const {data: session} = useSession();

    const onRefreshData = () => {
        setLoading(true);
        const userId = session?.user?.id;
        if (!userId) {
            throw new Error('Profile - User ID not found');
        }
        fetchUserPatterns(userId).then(data => {
            setPatterns(data);
        }).finally(() => {
            setLoading(false);
        });
    };

    useEffect(() => {
        onRefreshData();
    }, []);

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
                                        isShowActions
                                        pattern={{ ...pattern, src: pattern.fileContent || '' }}
                                        onReadDetail={() => onViewPattern(pattern.id || '')}
                                        onDelete={() => showDeleteConfirm(pattern.id || '')}
                                        onEdit={() => onEditPattern(pattern.id || '')}
                                    />
                                </Col>
                            ))}
                        </Row>
                        <FloatButton type='primary'
                            tooltip={<div>{t('patterns.add')}</div>}
                            icon={<PlusOutlined />}
                            onClick={() => onAddPattern()} />
                    </>
                ) : (
                    <Button type="primary" shape="circle" icon={<PlusOutlined />} size='large' onClick={() => onAddPattern()} />
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

export default FreePatterns;
