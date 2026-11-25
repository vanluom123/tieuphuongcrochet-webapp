'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useAuthModal } from '@/app/context/AuthModalProvider'
import { USER_ROLES } from '@/app/lib/constant'
import { VideoPopup as VideoPopupItem } from '@/app/lib/definitions'
import { fetchActiveVideoPopups } from '@/app/lib/service/videoPopupService'
import {
  hasBlockingOverlay,
  isWithinCooldown,
  recordVideoPopupCompleted,
  VIDEO_POPUP_EXCLUDED_PATHS,
  VIDEO_POPUP_MAX_RETRIES,
  VIDEO_POPUP_RETRY_MS,
  VIDEO_POPUP_SHOW_DELAY_MS,
} from './videoPopup.utils'

const VideoPopupModal = dynamic(() => import('./VideoPopupModal'), { ssr: false })

function isExemptRole(role?: string | null): boolean {
  return role === USER_ROLES.ADMIN || role === USER_ROLES.PREMIUM_USER
}

function pickRandomPopup(lists: VideoPopupItem[]): VideoPopupItem | null {
  const eligible = lists.filter((item) => item.id && item.clips?.length > 0)
  if (eligible.length === 0) return null
  return eligible[Math.floor(Math.random() * eligible.length)] ?? null
}

export default function VideoPopup() {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const { open: authModalOpen } = useAuthModal()
  const [popup, setPopup] = useState<VideoPopupItem | null>(null)

  const authModalOpenRef = useRef(authModalOpen)
  authModalOpenRef.current = authModalOpen

  const isExcludedPath = VIDEO_POPUP_EXCLUDED_PATHS.some((path) => pathname.startsWith(path))
  const isExempt = isExemptRole(session?.user?.role)

  useEffect(() => {
    if (isExempt || isExcludedPath) {
      setPopup(null)
      return
    }
    if (status === 'loading' || popup !== null || isWithinCooldown()) return

    let cancelled = false
    let timerId: number | null = null

    const tryShow = (picked: VideoPopupItem, retriesLeft: number) => {
      if (cancelled) return
      if (!authModalOpenRef.current && !hasBlockingOverlay()) {
        setPopup(picked)
        return
      }
      if (retriesLeft <= 0) return
      timerId = window.setTimeout(() => tryShow(picked, retriesLeft - 1), VIDEO_POPUP_RETRY_MS)
    }

    timerId = window.setTimeout(async () => {
      const lists = await fetchActiveVideoPopups()
      if (cancelled) return
      const picked = pickRandomPopup(lists)
      if (!picked) return
      tryShow(picked, VIDEO_POPUP_MAX_RETRIES)
    }, VIDEO_POPUP_SHOW_DELAY_MS)

    return () => {
      cancelled = true
      if (timerId !== null) window.clearTimeout(timerId)
    }
  }, [status, isExempt, isExcludedPath, popup])

  const handleCompleted = useCallback(() => {
    setPopup(null)
    recordVideoPopupCompleted()
  }, [])

  if (!popup || isExempt || isExcludedPath) return null

  return <VideoPopupModal key={popup.id ?? popup.title} popup={popup} onCompleted={handleCompleted} />
}
