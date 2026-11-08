'use client'

import { useEffect, useState } from 'react'
import { Button, Modal } from 'antd'
import { useTranslations } from 'next-intl'
import { VideoPopupList } from '@/app/lib/definitions'
import { VIDEO_POPUP_CLOSE_COUNTDOWN_SEC, VIDEO_POPUP_MODAL_CLASS } from './videoPopup.constants'
import { isSafeCtaUrl } from './videoPopupUrl'
import '@/app/ui/components/videoPopup.scss'

interface VideoPopupModalProps {
  open: boolean
  popup: VideoPopupList
  onCompleted: () => void
}

export default function VideoPopupModal({ open, popup, onCompleted }: VideoPopupModalProps) {
  const t = useTranslations('VideoPopupList')
  const [clipIndex, setClipIndex] = useState(0)
  const [secondsLeft, setSecondsLeft] = useState(VIDEO_POPUP_CLOSE_COUNTDOWN_SEC)
  const clips = popup.clips ?? []
  const clip = clips[clipIndex]
  const ctaUrl = clip?.ctaUrl?.trim()
  const showCta = ctaUrl && isSafeCtaUrl(ctaUrl)
  const canClose = secondsLeft <= 0

  useEffect(() => {
    setClipIndex(0)
    setSecondsLeft(VIDEO_POPUP_CLOSE_COUNTDOWN_SEC)
  }, [popup.id, open])

  useEffect(() => {
    if (!open || secondsLeft <= 0) return
    const timer = window.setTimeout(() => setSecondsLeft((value) => value - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [open, secondsLeft])

  const advance = () => {
    setClipIndex((index) => (index + 1 < clips.length ? index + 1 : index))
  }

  return (
    <Modal
      open={open}
      title={popup.title}
      wrapClassName={VIDEO_POPUP_MODAL_CLASS}
      closable={canClose}
      keyboard={canClose}
      maskClosable={false}
      footer={null}
      onCancel={canClose ? onCompleted : undefined}
      destroyOnClose
    >
      <div className="video-popup__meta">
        <span>{t('clip_progress', { current: clipIndex + 1, total: clips.length })}</span>
        {!canClose ? <span>{t('close_in', { seconds: secondsLeft })}</span> : null}
      </div>
      {clip ? (
        <video
          key={`${popup.id}-${clipIndex}`}
          className="video-popup__player"
          src={clip.videoUrl}
          aria-label={clip.label || popup.title}
          autoPlay
          playsInline
          controls
          muted
          preload="metadata"
          onEnded={advance}
          onError={() => setSecondsLeft(0)}
        />
      ) : null}
      {showCta ? (
        <Button type="primary" href={ctaUrl} target="_blank" rel="noopener noreferrer">
          {clip.label || t('cta_fallback')}
        </Button>
      ) : null}
    </Modal>
  )
}
