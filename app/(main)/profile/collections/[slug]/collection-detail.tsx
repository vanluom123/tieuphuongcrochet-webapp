"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Breadcrumb, Col, Empty, Row, Spin, Typography } from "antd";
import { useTranslations } from "next-intl";
import { HomeOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";

import {
  Collection,
  initialListParams,
  IResponseList,
  Pattern,
} from "@/app/lib/definitions";
import {
  fetchCollectionById,
  fetchFreePatternsByCollection,
} from "@/app/lib/service/profileService";
import { ROUTE_PATH } from "@/app/lib/constant";
import FreePatternCard from "@/app/components/free-pattern-card";
import "@/app/ui/components/profile.scss";

const { Title, Paragraph } = Typography;

interface CollectionDetailProps {
  params: {
    slug: string;
  };
}

const CollectionDetail = ({ params }: CollectionDetailProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const t = useTranslations("Profile");
  const collectionId = params.slug;
  const [loading, setLoading] = useState(true);
  const para = useMemo(() => initialListParams, []);
  const [patterns, setPatterns] = useState<IResponseList<Pattern>>({
    data: [],
    totalRecords: 0,
  });
  const [collection, setCollection] = useState<Collection>();
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const fetchCollectionData = async () => {
      if (!collectionId || !session?.user?.id) {
        return;
      }

      if (hasLoaded && collection) {
        return;
      }

      setLoading(true);
      try {
        const userId = session.user.id;

        const [colData, patternsData] = await Promise.all([
          fetchCollectionById(userId, collectionId),
          fetchFreePatternsByCollection(userId, collectionId, para),
        ]);

        setCollection(colData.data);
        setPatterns({
          data: (patternsData.data as Pattern[]) || [],
          totalRecords: patternsData.totalRecords || 0,
        });
        setHasLoaded(true);
      } catch (error) {
        console.error("Error loading collection data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollectionData();
  }, [collectionId, session?.user?.id, para, hasLoaded, collection]);

  const onViewPattern = (id: React.Key) => {
    router.push(`${ROUTE_PATH.FREEPATTERNS}/${id}`);
  };

  return (
    <div className="container" style={{ paddingTop: 28, paddingBottom: 48 }}>
      <Spin spinning={loading} size="large">
        <div className="collection-detail-container">
          <Breadcrumb
            items={[
              {
                title: (
                  <Link href={ROUTE_PATH.HOME} aria-label="Home">
                    <HomeOutlined />
                  </Link>
                ),
              },
              {
                title: (
                  <Link href={`${ROUTE_PATH.PROFILE}/${collection?.userId || session?.user?.id || ""}`}>
                    {t("breadcrumb.profile")}
                  </Link>
                ),
              },
              {
                title: t("breadcrumb.collections"),
              },
              {
                title: collection?.name || t("collections.loading"),
              },
            ]}
          />

          {collection && (
            <div className="collection-header">
              <Title level={2} style={{ marginBottom: 6 }}>
                {collection.name}
              </Title>
              {collection.description && (
                <Paragraph type="secondary" style={{ maxWidth: "60ch", marginBottom: 0 }}>
                  {collection.description}
                </Paragraph>
              )}
            </div>
          )}

          <div className="patterns-grid">
            {patterns.data.length > 0 ? (
              <Row gutter={[{ xs: 12, sm: 16, xl: 24 }, { xs: 20, sm: 24 }]}>
                {patterns.data.map((pattern) => (
                  <Col xs={12} sm={8} lg={6} key={pattern.id}>
                    <FreePatternCard
                      pattern={pattern}
                      onReadDetail={() => onViewPattern(pattern.id || "")}
                    />
                  </Col>
                ))}
              </Row>
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={t("collections.no_patterns")}
              />
            )}
          </div>
        </div>
      </Spin>
    </div>
  );
};

export default CollectionDetail;
