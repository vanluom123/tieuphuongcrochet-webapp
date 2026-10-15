'use client'

import { Flex, theme } from 'antd'
import { ReactNode } from 'react'

interface StatBadgeProps {
  icon?: ReactNode
  count?: number
  suffix?: ReactNode
  gap?: number
}

const StatBadge = ({ icon, count, suffix, gap = 4 }: StatBadgeProps) => {
  const { token } = theme.useToken()
  return (
    <Flex align="center" gap={gap} style={{ color: token.colorTextSecondary }}>
      {icon}
      {typeof count === 'number' && (
        <span style={{ fontSize: token.fontSizeSM, lineHeight: 1 }}>
          {count}
          {suffix != null && <>&nbsp;{suffix}</>}
        </span>
      )}
    </Flex>
  )
}

export default StatBadge
