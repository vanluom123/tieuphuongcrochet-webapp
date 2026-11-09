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
import { isInCooldown, markCompleted } from './videoPopupStorage'

function isExemptRole(role?: string | null): boolean {
  return role === USER_ROLES.ADMIN || role === USER_ROLES.PREMIUM_USER
}

// Resolves true when the delay elapsed and false when it gave up on a blocking modal.
function wait(ms: number, isCancelled: () => boolean): Promise<boolean> {
  return new Promise((resolve) => {
    const startedAt = Date.now()
    let remaining = ms
    let last = startedAt
    const tick = () => {
      if (isCancelled()) {
        resolve(false)
        return
      }
      const now = Date.now()
      const blocked = hasBlockingModal()
      if (now - startedAt >= VIDEO_POPUP_MAX_WAIT_MS) {
        resolve(false)
        return
      }
      if (!blocked) {
        remaining -= now - last
      }
      last = now
      if (remaining <= 0 && !blocked) {
        resolve(true)
        return
      }
      window.setTimeout(tick, BLOCKING_MODAL_POLL_MS)
    }
    tick()
  })
}

export function useVideoPopup() {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const [popup, setPopup] = useState<VideoPopup | null>(null)
  const [open, setOpen] = useState(false)
  const isExcludedPath = VIDEO_POPUP_EXCLUDED_PATHS.some((path) => pathname.startsWith(path))

  useEffect(() => {
    if (status === 'loading' || isExcludedPath) return
    if (isExemptRole(session?.user?.role)) return
    if (isInCooldown()) return

    let cancelled = false
    const isCancelled = () => cancelled

    const run = async () => {
      const lists = await fetchActiveVideoPopups()
      if (cancelled) return
      const eligible = lists.filter((item) => item.id && item.clips?.length > 0)
      if (eligible.length === 0) return
      const picked = eligible[Math.floor(Math.random() * eligible.length)]
      if (!picked?.id) return

      const ready = await wait(VIDEO_POPUP_SHOW_DELAY_MS, isCancelled)
      if (!ready || cancelled) return
      setPopup(picked)
      setOpen(true)
    }

    run()
    return () => {
      cancelled = true
    }
  }, [status, session?.user?.role, isExcludedPath])

  useEffect(() => {
    if (isExcludedPath) setOpen(false)
  }, [isExcludedPath])

  const complete = useCallback(() => {
    setOpen(false)
    markCompleted()
  }, [])

  return { popup, open, complete }
}
