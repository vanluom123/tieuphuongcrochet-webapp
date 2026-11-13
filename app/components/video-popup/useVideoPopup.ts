'use client'

import { useCallback, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { USER_ROLES } from '@/app/lib/constant'
import { VideoPopup } from '@/app/lib/definitions'
import { fetchActiveVideoPopups } from '@/app/lib/service/videoPopupService'
import {
  BLOCKING_MODAL_POLL_MS,
  VIDEO_POPUP_EXCLUDED_PATHS,
  VIDEO_POPUP_MAX_WAIT_MS,
  VIDEO_POPUP_SHOW_DELAY_MS,
} from './videoPopup.constants'
import { hasBlockingModal } from './videoPopupBlocking'
import { isWithinCooldown, recordCompletionTimestamp } from './videoPopupStorage'

function isExemptRole(role?: string | null): boolean {
  return role === USER_ROLES.ADMIN || role === USER_ROLES.PREMIUM_USER
}

// Resolves true when the show delay elapsed, false when cancelled or blocked too long.
// The latest timer id is reported so the caller can clear it immediately on unmount.
function waitForShowDelay(isCancelled: () => boolean, onTimer: (id: number) => void): Promise<boolean> {
  return new Promise((resolve) => {
    const startedAt = Date.now()
    let remaining = VIDEO_POPUP_SHOW_DELAY_MS
    let last = startedAt

    const tick = () => {
      if (isCancelled()) {
        resolve(false)
        return
      }
      const now = Date.now()
      if (now - startedAt >= VIDEO_POPUP_MAX_WAIT_MS) {
        resolve(false)
        return
      }
      const blocked = hasBlockingModal()
      if (!blocked) remaining -= now - last
      last = now
      if (!blocked && remaining <= 0) {
        resolve(true)
        return
      }
      onTimer(window.setTimeout(tick, BLOCKING_MODAL_POLL_MS))
    }

    tick()
  })
}

function pickRandomPopup(lists: VideoPopup[]): VideoPopup | null {
  const eligible = lists.filter((item) => item.id && item.clips?.length > 0)
  if (eligible.length === 0) return null
  return eligible[Math.floor(Math.random() * eligible.length)] ?? null
}

export function useVideoPopup() {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const [popup, setPopup] = useState<VideoPopup | null>(null)
  const [open, setOpen] = useState(false)
  const isExcludedPath = VIDEO_POPUP_EXCLUDED_PATHS.some((path) => pathname.startsWith(path))
  const isExempt = isExemptRole(session?.user?.role)

  useEffect(() => {
    if (isExempt) {
      // A popup may already be visible when the session becomes Premium mid-visit;
      // dismiss it right away instead of leaving it on screen until the next load.
      setPopup(null)
      setOpen(false)
      return
    }
    if (status === 'loading' || isExcludedPath) return
    if (isWithinCooldown()) return

    let cancelled = false
    let timerId: number | null = null

    const run = async () => {
      const lists = await fetchActiveVideoPopups()
      if (cancelled) return
      const picked = pickRandomPopup(lists)
      if (!picked) return

      const ready = await waitForShowDelay(
        () => cancelled,
        (id) => {
          timerId = id
        },
      )
      if (!ready || cancelled) return
      setPopup(picked)
      setOpen(true)
    }

    run()
    return () => {
      cancelled = true
      if (timerId !== null) window.clearTimeout(timerId)
    }
  }, [status, isExempt, isExcludedPath])

  const complete = useCallback(() => {
    setOpen(false)
    recordCompletionTimestamp()
  }, [])

  return { popup, open: open && !isExcludedPath && !isExempt, complete }
}