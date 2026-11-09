'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { VideoPopup, VideoPopupClip } from '@/app/lib/definitions'
import { deleteMultipleFilesToR2, uploadVideoToR2 } from '@/app/lib/service/r2Service'
import { fetchVideoPopupsAdmin, saveVideoPopups } from '@/app/lib/service/videoPopupService'
import { notification } from '@/app/lib/notify'
import { isSafeCtaUrl } from '@/app/components/video-popup/videoPopupUrl'
import { uid } from '@/app/lib/utils'

export interface ClipDraft extends VideoPopupClip {
  key: string
  file?: File
}

export interface ListDraft {
  key: string
  id?: string
  title: string
  active: boolean
  clips: ClipDraft[]
}

const emptyClip = (): ClipDraft => ({
  key: uid(),
  videoUrl: '',
  videoFileName: '',
  label: '',
  ctaUrl: '',
})

const emptyList = (): ListDraft => ({
  key: uid(),
  title: '',
  active: true,
  clips: [],
})

function toListDraft(item: VideoPopup): ListDraft {
  return {
    key: item.id ?? uid(),
    id: item.id,
    title: item.title,
    active: item.active,
    clips: (item.clips ?? []).map((clip) => ({
      key: uid(),
      videoUrl: clip.videoUrl,
      videoFileName: clip.videoFileName,
      label: clip.label ?? '',
      ctaUrl: clip.ctaUrl ?? '',
    })),
  }
}

function titleMissing(list: ListDraft): boolean {
  return !list.title.trim()
}

function videoMissing(list: ListDraft): boolean {
  return list.clips.length === 0 || list.clips.some((clip) => !clip.file && !clip.videoUrl)
}

function hasInvalidCta(list: ListDraft): boolean {
  return list.clips.some((clip) => {
    const ctaUrl = clip.ctaUrl?.trim() ?? ''
    return ctaUrl !== '' && !isSafeCtaUrl(ctaUrl)
  })
}

function toClipPayload(clip: ClipDraft, videoUrl: string, videoFileName: string): VideoPopupClip {
  return {
    videoUrl,
    videoFileName,
    label: clip.label?.trim() || undefined,
    ctaUrl: clip.ctaUrl?.trim() || undefined,
  }
}

export function useVideoPopupEditor() {
  const t = useTranslations('VideoPopupList')
  const [lists, setLists] = useState<ListDraft[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showErrors, setShowErrors] = useState(false)
  const [removedKeys, setRemovedKeys] = useState<string[]>([])

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const data = await fetchVideoPopupsAdmin()
        if (!cancelled) setLists(data.map(toListDraft))
      } catch (error) {
        if (!cancelled) {
          notification.error({
            message: t('load_error'),
            description: error instanceof Error ? error.message : undefined,
          })
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [t])

  const updateList = (index: number, patch: Partial<ListDraft>) => {
    setLists((current) => current.map((item, i) => (i === index ? { ...item, ...patch } : item)))
  }

  const updateClip = (listIndex: number, clipIndex: number, patch: Partial<ClipDraft>) => {
    setLists((current) =>
      current.map((item, i) => {
        if (i !== listIndex) return item
        return {
          ...item,
          clips: item.clips.map((clip, j) => (j === clipIndex ? { ...clip, ...patch } : clip)),
        }
      }),
    )
  }

  const addList = () => setLists((current) => [...current, emptyList()])

  const addClip = (listIndex: number) => {
    setLists((current) =>
      current.map((item, i) => (i === listIndex ? { ...item, clips: [...item.clips, emptyClip()] } : item)),
    )
  }

  const moveClip = (listIndex: number, clipIndex: number, direction: -1 | 1) => {
    setLists((current) =>
      current.map((item, i) => {
        if (i !== listIndex) return item
        const next = [...item.clips]
        const target = clipIndex + direction
        if (target < 0 || target >= next.length) return item
        const [clip] = next.splice(clipIndex, 1)
        next.splice(target, 0, clip)
        return { ...item, clips: next }
      }),
    )
  }

  const removeClip = (listIndex: number, clipIndex: number) => {
    const target = lists[listIndex]?.clips[clipIndex]
    if (target?.videoFileName) {
      setRemovedKeys((keys) => [...keys, target.videoFileName])
    }
    setLists((current) =>
      current.map((item, i) =>
        i === listIndex ? { ...item, clips: item.clips.filter((_, j) => j !== clipIndex) } : item,
      ),
    )
  }

  const removeList = (index: number) => {
    const target = lists[index]
    if (!target) return
    const keys = target.clips.map((clip) => clip.videoFileName).filter(Boolean)
    if (keys.length > 0) {
      setRemovedKeys((current) => [...current, ...keys])
    }
    setLists((current) => current.filter((_, i) => i !== index))
  }

  const onSave = async () => {
    if (loading || saving) return
    if (lists.length === 0 && removedKeys.length === 0) return
    if (lists.some((list) => titleMissing(list) || videoMissing(list))) {
      setShowErrors(true)
      return
    }
    if (lists.some((list) => hasInvalidCta(list))) {
      notification.error({ message: t('cta_url_invalid') })
      return
    }

    setShowErrors(false)
    setSaving(true)
    const uploadedKeys: string[] = []
    const keysToDelete = new Set(removedKeys.filter(Boolean))
    let committed = false

    try {
      const payload: VideoPopup[] = []
      for (const list of lists) {
        const clips: VideoPopupClip[] = []
        for (const clip of list.clips) {
          if (!clip.file) {
            clips.push(toClipPayload(clip, clip.videoUrl, clip.videoFileName))
            continue
          }
          let uploaded
          try {
            uploaded = await uploadVideoToR2(clip.file)
          } catch (error) {
            const detail = error instanceof Error ? error.message : ''
            throw new Error(detail ? `${t('video_upload_failed')}: ${detail}` : t('video_upload_failed'))
          }
          uploadedKeys.push(uploaded.fileName)
          if (clip.videoFileName) keysToDelete.add(clip.videoFileName)
          clips.push(toClipPayload(clip, uploaded.fileContent, uploaded.fileName))
        }
        payload.push({
          id: list.id,
          title: list.title.trim(),
          active: list.active,
          clips,
        })
      }

      const savedLists = await saveVideoPopups(payload)
      committed = true
      setLists(savedLists.map(toListDraft))
      setRemovedKeys([])
      notification.success({ message: t('save_success') })

      const retainedKeys = new Set(
        savedLists.flatMap((list) => (list.clips ?? []).map((clip) => clip.videoFileName)),
      )
      const keys = [...keysToDelete].filter((key) => !retainedKeys.has(key))
      if (keys.length > 0) await deleteMultipleFilesToR2(keys)
    } catch (error) {
      if (!committed && uploadedKeys.length > 0) {
        await deleteMultipleFilesToR2(uploadedKeys)
      }
      notification.error({
        message: t('save_error'),
        description: error instanceof Error ? error.message : undefined,
      })
    } finally {
      setSaving(false)
    }
  }

  return {
    lists,
    loading,
    saving,
    showErrors,
    canSave: !loading && !saving && (lists.length > 0 || removedKeys.length > 0),
    onSave,
    addList,
    removeList,
    addClip,
    updateList,
    updateClip,
    moveClip,
    removeClip,
    titleMissing,
    videoMissing,
  }
}
