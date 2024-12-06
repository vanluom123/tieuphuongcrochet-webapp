import { useEffect, useState } from 'react';
import { Row, Col, Empty } from 'antd';
import { useTranslations } from 'next-intl';
import FreePatternCard from '../free-pattern-card';
import { Pattern } from '@/app/lib/definitions';
import { fetchUserPatterns } from '@/app/lib/service/profileService';
import { ROUTE_PATH } from '@/app/lib/constant';
import { useRouter } from 'next/navigation';

const FreePatterns = () => {
    const t = useTranslations('Profile');
    const [patterns, setPatterns] = useState<Pattern[]>([]);
    const router = useRouter();

    useEffect(() => {
        fetchUserPatterns().then(data => {
            setPatterns(data);
        });
    }, []);

	const onViewPattern = (id: React.Key) => {
		router.push(`${ROUTE_PATH.FREEPATTERNS}/${id}`);
	};

    return (
        <div className="patterns-tab">
            {patterns.length > 0 ? (
                <Row gutter={[16, 16]}>
                    {patterns.map((pattern, index) => (
                        <Col xs={24} sm={12} lg={8} key={index}>
                                <FreePatternCard pattern={pattern} onReadDetail={() => onViewPattern(pattern.id || '')}/>
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
