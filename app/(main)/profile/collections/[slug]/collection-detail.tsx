'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Breadcrumb, Button, Col, Empty, Row, Spin, Typography } from 'antd'
import { useTranslations } from 'next-intl'
import { HomeOutlined } from '@ant-design/icons'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

import { Collection, initialListParams, IResponseList, Pattern } from '@/app/lib/definitions'
import {
  fetchCollectionById,
  fetchFreePatternsByCollection,
} from '@/app/lib/service/profileService'
import { ROUTE_PATH } from '@/app/lib/constant'
import FreePatternCard from '@/app/components/free-pattern-card'

const { Title, Paragraph } = Typography

interface CollectionDetailProps {
  params: {
    slug: string
  }
}

const CollectionDetail = ({ params }: CollectionDetailProps) => {
  const { data: session } = useSession()
  const router = useRouter()
  const t = useTranslations('Profile')
  const collectionId = params.slug
  const [loading, setLoading] = useState(true)
  // Memoize para object to prevent unnecessary re-renders
  const para = useMemo(() => initialListParams, [])
  const [patterns, setPatterns] = useState<IResponseList<Pattern>>({
    data: [],
    totalRecords: 0,
  })
  const [collection, setCollection] = useState<Collection>()
  const [fetchCount, setFetchCount] = useState(0)
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    const fetchCollectionData = async () => {
      if (!collectionId) {
        return
      }

      if (!session?.user?.id) {
        return
      }

      // Prevent multiple concurrent fetches
      if (hasLoaded && collection) {
        return
      }
      setFetchCount((prev) => prev + 1)
      setLoading(true)

      try {
        const userId = session.user.id

        const [colData, patternsData] = await Promise.all([
          fetchCollectionById(userId, collectionId),
          fetchFreePatternsByCollection(userId, collectionId, para),
        ])

        setCollection(colData.data)
        setPatterns({
          data: (patternsData.data as Pattern[]) || [],
          totalRecords: patternsData.totalRecords || 0,
        })
        setHasLoaded(true)
      } catch (error) {
        console.error('❌ Error loading collection data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCollectionData()
  }, [collectionId, session?.user?.id, para]) // Only depend on stable values

  const onViewPattern = (id: React.Key) => {
    router.push(`${ROUTE_PATH.FREEPATTERNS}/${id}`)
  }

  const resetData = () => {
    setCollection(undefined)
    setPatterns({ data: [], totalRecords: 0 })
    setHasLoaded(false)
    setFetchCount(0)
  }

  return (
    <Spin spinning={loading} size="large">
      <div className="collection-detail-container">
        {/* Breadcrumb */}
        <Breadcrumb
          className="mb-4"
          items={[
            {
              title: (
                <Link href={ROUTE_PATH.HOME}>
                  <HomeOutlined />
                </Link>
              ),
            },
            {
              title: (
                <Link href={`${ROUTE_PATH.PROFILE}/${collection?.userId}`}>
                  {t('breadcrumb.profile')}
                </Link>
              ),
            },
            {
              title: t('breadcrumb.collections'),
            },
            {
              title: collection?.name || t('collections.loading'),
            },
          ]}
        />

        {/* Collection header */}
        {collection && (
          <div className="collection-header mb-6">
            <div
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
            >
              <div style={{ flex: 1 }}>
                <Title level={2}>
                  {collection.name}
                  <span style={{ fontSize: '14px', color: '#666', marginLeft: '10px' }}>
                    (Fetch count: {fetchCount})
                  </span>
                </Title>
                <Paragraph>{collection.description}</Paragraph>
              </div>
              <Button
                type="default"
                size="small"
                onClick={resetData}
                style={{ marginLeft: '20px' }}
              >
                Reset Data
              </Button>
            </div>
          </div>
        )}

        {/* Patterns grid */}
        <div className="patterns-grid">
          {patterns.data.length > 0 ? (
            <Row gutter={[16, 16]}>
              {patterns.data.map((pattern, index) => {
                return (
                  <Col xs={24} sm={12} md={8} lg={6} key={pattern.id}>
                    <FreePatternCard
                      pattern={pattern}
                      onReadDetail={() => onViewPattern(pattern.id || '')}
                    />
                  </Col>
                )
              })}
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
  )
}

export default CollectionDetail
