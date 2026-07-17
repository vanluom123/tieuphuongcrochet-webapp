'use client';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { Col, Empty, Pagination, Row, Spin } from 'antd';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { initialListParams, IResponseList, Pattern } from '@/app/lib/definitions';
import { fetchLikedFreePatterns } from '@/app/lib/service/profileService';
import { ROUTE_PATH } from '@/app/lib/constant';
import FreePatternCard from '../free-pattern-card';

interface LikedPatternsProps {
    userId: string;
}

const LikedPatterns = ({ userId }: LikedPatternsProps) => {
    const t = useTranslations('Profile');
    const [patterns, setPatterns] = useState<IResponseList<Pattern>>({
        data: [],
        totalRecords: 0
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [params, setParams] = useState(initialListParams);

    const onRefreshData = useCallback(() => {
        setLoading(true);
        fetchLikedFreePatterns(userId, params)
            .then(({ data, totalRecords }) => setPatterns({
                data: data,
                totalRecords
            }))
            .catch(error => {
                console.error('Error fetching liked patterns:', error);
            })
            .finally(() => setLoading(false));
    }, [userId, params]);

    useEffect(() => {
        onRefreshData();
    }, [onRefreshData]);

    const onViewPattern = (id: React.Key) => {
        router.push(`${ROUTE_PATH.FREEPATTERNS}/${id}`);
    };

    const onChange = (page: number, pageSize: number) => {
        setParams(prevParams => ({
            ...prevParams,
            pageNo: page - 1,
            pageSize: pageSize
        }));
    };

    return (
        <Spin spinning={loading} size="large">
            <div className="patterns-tab">
                {patterns.totalRecords > 0 ? (
                    <div>
                        <Row gutter={[{ xs: 8, sm: 16, xl: 24 }, { xs: 12, sm: 16, xl: 24 }]}>
                            {patterns.data.map((pattern, index) => (
                                <Col xs={12} sm={8} lg={6} key={index}>
                                    <FreePatternCard
                                        pattern={{ ...pattern, src: pattern.fileContent || '' }}
                                        onReadDetail={() => onViewPattern(pattern.id || '')}
                                    />
                                </Col>
                            ))}
                        </Row>
                        <Pagination
                            className='pagination'
                            responsive
                            total={patterns.totalRecords}
                            {
                                ...(params.pageNo !== -1 ? { current: params.pageNo + 1 } : {})
                            }
                            pageSize={params.pageSize}
                            showSizeChanger
                            showQuickJumper
                            showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                            onChange={onChange}
                        />
                    </div>
                ) : (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
            </div>
        </Spin>
    );
};

export default memo(LikedPatterns);
