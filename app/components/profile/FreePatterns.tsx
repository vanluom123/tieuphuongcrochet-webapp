import { useEffect, useState } from 'react';
import { Row, Col, Empty } from 'antd';
import { useTranslations } from 'next-intl';
import FreePatternCard from '../free-pattern-card';
import { Pattern } from '@/app/lib/definitions';
import { fetchUserPatterns } from '@/app/lib/service/profileService';

const FreePatterns = () => {
    const t = useTranslations('Profile');
    const [patterns, setPatterns] = useState<Pattern[]>([]);

    useEffect(() => {
        fetchUserPatterns().then(data => {
            setPatterns(data);
        });
    }, []);

    return (
        <div className="patterns-tab">
            {patterns.length > 0 ? (
                <Row gutter={[16, 16]}>
                    {patterns.map((pattern, index) => (
                        <Col xs={24} sm={12} lg={8} key={index}>
                            <FreePatternCard pattern={pattern} />
                        </Col>
                    ))}
                </Row>
            ) : (
                <Empty description={t('patterns.empty')} />
            )}
        </div>
    );
};

export default FreePatterns;
