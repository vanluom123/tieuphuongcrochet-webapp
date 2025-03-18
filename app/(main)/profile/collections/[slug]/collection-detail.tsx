'use client';

import React, { useEffect, useState } from 'react';
import { Breadcrumb, Col, Empty, Row, Spin, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import { HomeOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

import { initialListParams, IResponseList, Pattern } from '@/app/lib/definitions';
import { fetchFreePatternsByCollection } from '@/app/lib/service/profileService';
import { ROUTE_PATH } from '@/app/lib/constant';
import FreePatternCard from '@/app/components/free-pattern-card';

const { Title, Paragraph } = Typography;

interface CollectionDetailProps {
    params: {
        slug: string;
    };
}

const CollectionDetail = ({ params }: CollectionDetailProps) => {
    const t = useTranslations('Profile');
    const router = useRouter();
    const { data: session } = useSession();
    const collectionId = params.slug;
    const [para, setPara] = useState(initialListParams);
    const [loading, setLoading] = useState(true);
    const [patterns, setPatterns] = useState<IResponseList<Pattern>>({
        data: [],
        totalRecords: 0
    });

    useEffect(() => {
        const fetchCollectionData = async () => {
            setLoading(true);
            const userId = session?.user.id || '';
            const patternsData = await fetchFreePatternsByCollection(
                userId,
                collectionId,
                para
            );

            setPatterns({
                data: patternsData.data as Pattern[] || [],
                totalRecords: patternsData.totalRecords || 0
            });

            setLoading(false);
        };

        if (collectionId) {
            fetchCollectionData();
        }
    }, [collectionId]);

    const onViewPattern = (id: React.Key) => {
        router.push(`${ROUTE_PATH.FREEPATTERNS}/${id}`);
    };

    // const isOwner = session?.user?.id === collection?.userId;

    return (
        <Spin spinning={loading} size="large">
            <div className="collection-detail-container">
                {/* Breadcrumb */}
                <Breadcrumb
                    className="mb-4"
                    items={[
                        {
                            title: <Link href={ROUTE_PATH.HOME}><HomeOutlined /></Link>,
                        },
                        // {
                        //     title: <Link href={`${ROUTE_PATH.PROFILE}/${collection?.userId}`}>{t('breadcrumb.profile')}</Link>,
                        // },
                        // {
                        //     title: t('breadcrumb.collections'),
                        // },
                        // {
                        //     title: collection?.name || t('collections.loading'),
                        // },
                    ]}
                />

                {/* Collection header */}
                {/* {collection && (
                    <div className="collection-header mb-6">
                        <Title level={2}>{collection.name}</Title>
                        <Paragraph>{collection.description}</Paragraph>
                    </div>
                )} */}

                {/* Patterns grid */}
                <div className="patterns-grid">
                    {patterns.data.length > 0 ? (
                        <Row gutter={[16, 16]}>
                            {patterns.data.map((pattern) => (
                                <Col xs={24} sm={12} md={8} lg={6} key={pattern.id}>
                                    <FreePatternCard
                                        pattern={pattern}
                                        onReadDetail={() => onViewPattern(pattern.id || '')}
                                        // isShowActions={isOwner}
                                    />
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={t('collections.no_patterns')}
                        />
                    )}
                </div>
            </div>
        </Spin>
    );
};

export default CollectionDetail;