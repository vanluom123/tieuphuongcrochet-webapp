'use client'

import { useEffect } from 'react'

interface ReportViewProps {
  id: string
  type?: string
  onViewCounted?: () => void
}

export const ReportView = ({ id, type = 'FREE_PATTERN', onViewCounted }: ReportViewProps) => {
  useEffect(() => {
    // Don't track if not in browser or document is hidden
    if (typeof window === 'undefined' || document.visibilityState === 'hidden') {
      return
    }

    const controller = new AbortController()

    fetch('/api/views', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, type }),
      signal: controller.signal,
      keepalive: true,
    })
      .then((res) => {
        if (!res.ok) return null
        return res.json()
      })
      .then((data) => {
        if (data?.success && !data?.dedup && !data?.bot) {
          onViewCounted?.()
        }
      })
      .catch(() => {
        // Silent fail - don't affect UX
      })

    return () => {
      controller.abort()
    }
  }, [id, type, onViewCounted])

  return null
}
