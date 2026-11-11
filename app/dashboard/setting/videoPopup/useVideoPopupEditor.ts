'use client'

import { useCallback, useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { fetchVideoPopupsAdmin } from '@/app/lib/service/videoPopupService'
import { notification } from '@/app/lib/notify'
import {
  ClipDraft,
  ListDraft,
  appendClip,
  appendList,
  moveClipAt,
  patchClipAt,
  patchListAt,
  removeClipAt,
  removeListAt,
  toDraftList,
  validateDraftList,
} from './videoPopupEditor.helpers'
import { syncVideoPopupDrafts } from './videoPopupEditorSync'

export function useVideoPopupEditor() {
  const t = useTranslations('VideoPopupList')
  const [lists, setLists] = useState<ListDraft[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showErrors, setShowErrors] = useState(false)
  const [hasRemovedLists, setHasRemovedLists] = useState(false)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const data = await fetchVideoPopupsAdmin()
        if (!cancelled) setLists(data.map(toDraftList))
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

  const updateList = useCallback((index: number, patch: Partial<ListDraft>) => {
    setLists((current) => patchListAt(current, index, patch))
  }, [])

  const updateClip = useCallback((listIndex: number, clipIndex: number, patch: Partial<ClipDraft>) => {
    setLists((current) => patchClipAt(current, listIndex, clipIndex, patch))
  }, [])

  const addList = useCallback(() => setLists(appendList), [])

  const addClip = useCallback((listIndex: number) => {
    setLists((current) => appendClip(current, listIndex))
  }, [])

  const moveClip = useCallback((listIndex: number, clipIndex: number, direction: -1 | 1) => {
    setLists((current) => moveClipAt(current, listIndex, clipIndex, direction))
  }, [])

  const removeClip = useCallback(
    (listIndex: number, clipIndex: number) => {
      setLists((current) => removeClipAt(current, listIndex, clipIndex))
    },
    [],
  )

  const removeList = useCallback(
    (index: number) => {
      setLists((current) => removeListAt(current, index))
      setHasRemovedLists(true)
    },
    [],
  )

  const onSave = useCallback(async () => {
    if (loading || saving) return
    if (lists.length === 0 && !hasRemovedLists) return

    const errors = lists.map(validateDraftList)
    if (errors.some((error) => error.titleMissing || error.videoMissing)) {
      setShowErrors(true)
      return
    }
    if (errors.some((error) => error.invalidCta)) {
      notification.error({ message: t('cta_url_invalid') })
      return
    }

    setShowErrors(false)
    setSaving(true)
    try {
      const savedLists = await syncVideoPopupDrafts(lists, t('video_upload_failed'))
      setLists(savedLists.map(toDraftList))
      setHasRemovedLists(false)
      notification.success({ message: t('save_success') })
    } catch (error) {
      notification.error({
        message: t('save_error'),
        description: error instanceof Error ? error.message : undefined,
      })
    } finally {
      setSaving(false)
    }
  }, [loading, saving, lists, hasRemovedLists, t])

  return {
    lists,
    loading,
    saving,
    showErrors,
    canSave: !loading && !saving && (lists.length > 0 || hasRemovedLists),
    onSave,
    addList,
    removeList,
    addClip,
    updateList,
    updateClip,
    moveClip,
    removeClip,
  }
}
