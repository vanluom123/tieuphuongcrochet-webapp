import { useEffect, useState } from 'react';
import { Row, Col, FloatButton, Button, Modal } from 'antd';
import { useTranslations } from 'next-intl';
import { PlusOutlined } from '@ant-design/icons';
import { Pattern } from '@/app/lib/definitions';
import { fetchUserPatterns } from '@/app/lib/service/profileService';
import { ROUTE_PATH } from '@/app/lib/constant';
import { useRouter } from 'next/navigation';
import FreePatternCard from './FreePatternCard';
import FreePatternFormModal from './FreePatternFormModal';

const FreePatterns = () => {
    const t = useTranslations('Profile');
    const [patterns, setPatterns] = useState<Pattern[]>([]);
    const router = useRouter();
    const [modalData, setModalData] = useState({
        open: false,
        id: ''
    });

    useEffect(() => {
        fetchUserPatterns().then(data => {
            setPatterns(data);
        });
    }, []);

    const onViewPattern = (id: React.Key) => {
        router.push(`${ROUTE_PATH.FREEPATTERNS}/${id}`);
    };

    const onDeletePattern = (id: React.Key) => {
        console.log('delete', id);
    };

    const onAddPattern = () => {
        setModalData({ open: true, id: '' })
    };

    const onEditPattern = (id: React.Key) => {
        setModalData({ open: true, id: `${id}` })
    };

    return (
        <><div className="patterns-tab">
            {patterns.length > 0 ? (
                <>
                    <Row gutter={[16, 16]}>
                        {patterns.map((pattern, index) => (
                            <Col xs={24} sm={12} lg={6} key={index}>
                                <FreePatternCard
                                    isShowActions pattern={{ ...pattern, src: pattern.fileContent || '' }}
                                    onReadDetail={() => onViewPattern(pattern.id || '')}
                                    onDelete={() => onDeletePattern(pattern.id || '')}
                                    onEdit={() => onEditPattern(pattern.id || '')} />
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
            <FreePatternFormModal modalData={modalData} setModalData={setModalData} />
        </>
    );
};

export default FreePatterns;
