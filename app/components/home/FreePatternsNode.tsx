'use client'

import React from 'react'
import { Col, Empty, Row } from 'antd'
import { map } from 'lodash'

import FreePatternCard from '../free-pattern-card'
import HeaderPart from '../header-part'
import { ROUTE_PATH } from '@/app/lib/constant'
import ReadMoreBtn from '../read-more'
import { Pattern } from '@/app/lib/definitions'
import { useRouter } from 'next/navigation'

const FreePatternsNode = ({ patterns }: { patterns: Pattern[] }) => {
  const router = useRouter()
  const onViewPattern = (id: React.Key) => {
    router.push(`${ROUTE_PATH.FREEPATTERNS}/${id}`)
  }

  return (
    <div className="patterns">
      <HeaderPart
        titleId="Home.FreePattern.title"
        descriptionId="Home.FreePattern.description"
        isShowDivider
      />
      <Row
        gutter={[
          { xs: 8, sm: 16, xl: 24 },
          { xs: 12, sm: 16, xl: 24 },
        ]}
      >
        {map(patterns, (pattern, index) => (
          <Col key={`freepattern_${index}`} xs={12} sm={8} lg={6}>
            <FreePatternCard
              pattern={pattern}
              onReadDetail={() => onViewPattern(pattern.id || '')}
            />
          </Col>
        ))}
      </Row>
      {patterns?.length > 0 ? (
        <div className="read-more">
          <ReadMoreBtn path={ROUTE_PATH.FREEPATTERNS} />
        </div>
      ) : (
        <Empty imageStyle={{ height: 80 }} image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </div>
  )
}

export default FreePatternsNode
