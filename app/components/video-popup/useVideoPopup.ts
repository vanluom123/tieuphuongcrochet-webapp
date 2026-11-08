'use client'

import { useCallback, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { USER_ROLES } from '@/app/lib/constant'
import { VideoPopupList } from '@/app/lib/definitions'
import { fetchActiveVideoPopupLists } from '@/app/lib/service/videoPopupListService'
import {
  BLOCKING_MODAL_POLL_MS,
  VIDEO_POPUP_EXCLUDED_PATHS,
  VIDEO_POPUP_SHOW_DELAY_MS,
} from './videoPopup.constants'
import { hasBlockingModal } from './videoPopupBlocking'
import { isInCooldown, markCompleted } from './videoPopupStorage'

function isExemptRole(role?: string | null): boolean {
  return role === USER_ROLES.ADMIN || role === USER_ROLES.PREMIUM_USER
}

function wait(ms: number, isCancelled: () => boolean): Promise<void> {
  return new Promise((resolve) => {
    let remaining = ms
    let last = Date.now()
    const tick = () => {
      if (isCancelled()) {
        resolve()
        return
      }
      const now = Date.now()
      if (!hasBlockingModal()) {
        remaining -= now - last
      }
      last = now
      if (remaining <= 0 && !hasBlockingModal()) {
        resolve()
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
  const [popup, setPopup] = useState<VideoPopupList | null>(null)
  const [open, setOpen] = useState(false)
  const isExcludedPath = VIDEO_POPUP_EXCLUDED_PATHS.some((path) => pathname.startsWith(path))

  useEffect(() => {
    if (status === 'loading' || isExcludedPath) return
    if (isExemptRole(session?.user?.role)) return
    if (isInCooldown()) return

    let cancelled = false
    const isCancelled = () => cancelled

    const run = async () => {
      const lists = await fetchActiveVideoPopupLists()
      if (cancelled) return
      const eligible = lists.filter((item) => item.id && item.clips?.length > 0)
      if (eligible.length === 0) return
      const picked = eligible[Math.floor(Math.random() * eligible.length)]
      if (!picked?.id) return

      await wait(VIDEO_POPUP_SHOW_DELAY_MS, isCancelled)
      if (cancelled || hasBlockingModal()) return
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
