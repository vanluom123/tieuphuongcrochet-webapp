'use client'

import { useEffect } from 'react'

export const ReportView = ({ id, type = 'FREE_PATTERN' }: { id: string; type?: string }) => {
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
    }).catch(() => {
      // Silent fail - don't affect UX
    })

    return () => {
      controller.abort()
    }
  }, [id, type])

  return null
}
