'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Modal } from 'antd'
import { useTranslations } from 'next-intl'
import { VideoPopup } from '@/app/lib/definitions'
import { VIDEO_POPUP_CLOSE_COUNTDOWN_SEC, VIDEO_POPUP_MODAL_CLASS } from './videoPopup.constants'
import { formatCtaLink, isSafeCtaUrl } from './videoPopupUrl'
import '@/app/ui/components/videoPopup.scss'

interface VideoPopupModalProps {
  open: boolean
  popup: VideoPopup
  onCompleted: () => void
}

export default function VideoPopupModal({ open, popup, onCompleted }: VideoPopupModalProps) {
  const t = useTranslations('VideoPopupList')
  const router = useRouter()
  const [clipIndex, setClipIndex] = useState(0)
  const [secondsLeft, setSecondsLeft] = useState(VIDEO_POPUP_CLOSE_COUNTDOWN_SEC)
  const clips = popup.clips ?? []
  const clip = clips[clipIndex]
  const ctaUrl = formatCtaLink(clip?.ctaUrl ?? '')
  const showCta = isSafeCtaUrl(ctaUrl)
  const isInternalCta = ctaUrl.startsWith('/')
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

  const ctaLabel = clip?.label || t('cta_fallback')
  const ctaButton =
    showCta &&
    (isInternalCta ? (
      <Button
        type="primary"
        onClick={() => {
          onCompleted()
          router.push(ctaUrl)
        }}
      >
        {ctaLabel}
      </Button>
    ) : (
      <Button type="primary" href={ctaUrl} target="_blank" rel="noopener noreferrer">
        {ctaLabel}
      </Button>
    ))

  return (
    <Modal
      open={open}
      title={popup.title}
      wrapClassName={VIDEO_POPUP_MODAL_CLASS}
      closable={canClose}
      keyboard={canClose}
      maskClosable={false}
      footer={canClose ? (
        <Button onClick={onCompleted} aria-label={t('close')}>
          {t('close')}
        </Button>
      ) : null}
      onCancel={canClose ? onCompleted : undefined}
      destroyOnClose
    >
      {clips.length > 0 ? (
        <div className="video-popup__meta">
          <span>{t('clip_progress', { current: clipIndex + 1, total: clips.length })}</span>
          {!canClose ? <span aria-live="polite">{t('close_in', { seconds: secondsLeft })}</span> : null}
        </div>
      ) : null}
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
      {ctaButton}
    </Modal>
  )
}