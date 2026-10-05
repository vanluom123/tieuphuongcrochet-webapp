'use client'

import { useEffect } from 'react'

interface ReportViewProps {
  id: string
  type?: string
  onViewCounted?: () => void
}

// Tracks the views already reported in this browser session so that React
// StrictMode's double-invoked effects (and component re-renders) never fire
// duplicate requests for the same pattern.
const reportedViews = new Set<string>()

export const ReportView = ({ id, type = 'FREE_PATTERN', onViewCounted }: ReportViewProps) => {
  useEffect(() => {
    // Don't track if not in browser or document is hidden
    if (typeof window === 'undefined' || document.visibilityState === 'hidden') {
      return
    }

    const key = `${type}:${id}`
    if (reportedViews.has(key)) {
      return
    }
    reportedViews.add(key)

    // Fire-and-forget request: `keepalive` lets it finish even if the user
    // navigates away, so we intentionally do NOT abort it on cleanup. Aborting
    // caused a request storm where the request whose response was read always
    // hit the server-side dedup, so onViewCounted never fired and the count
    // stayed stale.
    fetch('/api/views', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, type }),
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
  }, [id, type, onViewCounted])

  return null
}
