'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Modal } from 'antd'
import { ExportOutlined, FieldTimeOutlined, LinkOutlined } from '@ant-design/icons'
import { useTranslations } from 'next-intl'
import { VideoPopup } from '@/app/lib/definitions'
import { formatCtaLink, isSafeCtaUrl, VIDEO_POPUP_CLOSE_COUNTDOWN_SEC } from './videoPopup.utils'
import styles from './VideoPopupModal.module.scss'

interface VideoPopupModalProps {
  popup: VideoPopup
  onCompleted: () => void
}

export default function VideoPopupModal({ popup, onCompleted }: VideoPopupModalProps) {
  const t = useTranslations('VideoPopupList')
  const router = useRouter()
  const [clipIndex, setClipIndex] = useState(0)
  const [secondsLeft, setSecondsLeft] = useState(VIDEO_POPUP_CLOSE_COUNTDOWN_SEC)
  const [isTabVisible, setIsTabVisible] = useState(
    () => typeof document === 'undefined' || document.visibilityState === 'visible',
  )

  const clips = popup.clips ?? []
  const clip = clips[clipIndex]
  const ctaUrl = formatCtaLink(clip?.ctaUrl ?? '')
  const showCta = isSafeCtaUrl(ctaUrl)
  const isInternalCta = ctaUrl.startsWith('/')
  const canClose = secondsLeft <= 0

  useEffect(() => {
    const onVisibilityChange = () => {
      setIsTabVisible(document.visibilityState === 'visible')
    }
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => document.removeEventListener('visibilitychange', onVisibilityChange)
  }, [])

  useEffect(() => {
    if (!isTabVisible || secondsLeft <= 0) return
    const timer = window.setTimeout(() => setSecondsLeft((value) => Math.max(0, value - 1)), 1000)
    return () => window.clearTimeout(timer)
  }, [isTabVisible, secondsLeft])

  const handleClipEnded = () => {
    if (clipIndex + 1 < clips.length) {
      setClipIndex((index) => index + 1)
    } else {
      setSecondsLeft(0)
    }
  }

  const ctaLabel = clip?.label || t('cta_fallback')
  const ctaContent = (
    <>
      <LinkOutlined aria-hidden="true" />
      <span>{ctaLabel}</span>
      {!isInternalCta ? <ExportOutlined aria-hidden="true" /> : null}
    </>
  )

  const ctaButton =
    showCta &&
    (isInternalCta ? (
      <Button
        type="primary"
        className={styles.cta}
        onClick={() => {
          onCompleted()
          router.push(ctaUrl)
        }}
      >
        {ctaContent}
      </Button>
    ) : (
      <Button
        type="primary"
        className={styles.cta}
        href={ctaUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onCompleted}
      >
        {ctaContent}
      </Button>
    ))

  return (
    <Modal
      open
      title={popup.title}
      closable={canClose}
      keyboard={canClose}
      maskClosable={false}
      footer={null}
      onCancel={canClose ? onCompleted : undefined}
      destroyOnClose
    >
      {clips.length > 0 ? (
        <div className={styles.meta}>
          <span>{t('clip_progress', { current: clipIndex + 1, total: clips.length })}</span>
          {!canClose ? (
            <span className={styles.countdown} aria-live="polite">
              <FieldTimeOutlined aria-hidden="true" />
              <span>{t('close_in', { seconds: secondsLeft })}</span>
            </span>
          ) : null}
        </div>
      ) : null}
      {clip ? (
        <video
          key={`${popup.id ?? popup.title}-${clipIndex}`}
          className={styles.player}
          src={clip.videoUrl}
          aria-label={clip.label || popup.title}
          autoPlay
          playsInline
          controls
          muted
          preload="metadata"
          onEnded={handleClipEnded}
          onError={() => setSecondsLeft(0)}
        />
      ) : null}
      {ctaButton}
    </Modal>
  )
}
