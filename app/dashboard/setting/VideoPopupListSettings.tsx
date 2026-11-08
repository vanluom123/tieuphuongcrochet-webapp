'use client'

import { Button, Form, Input, Space, Spin, Switch, Upload } from 'antd'
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DeleteOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { VideoPopupClip, VideoPopupList } from '@/app/lib/definitions'
import {
  createUpdateVideoPopupLists,
  fetchVideoPopupListsAdmin,
} from '@/app/lib/service/videoPopupListService'
import { deleteMultipleFilesToR2, uploadVideoToR2 } from '@/app/lib/service/r2Service'
import { notification } from '@/app/lib/notify'
import { isSafeCtaUrl } from '@/app/components/video-popup/videoPopupUrl'
import '@/app/ui/components/videoPopup.scss'

interface ClipDraft extends VideoPopupClip {
  file?: File
}

interface ListDraft {
  id?: string
  title: string
  active: boolean
  clips: ClipDraft[]
}

const MAX_VIDEO_BYTES = 100 * 1024 * 1024
const VIDEO_TYPES = new Set(['video/mp4', 'video/webm'])

const emptyList = (): ListDraft => ({
  title: '',
  active: true,
  clips: [],
})

function toListDraft(item: VideoPopupList): ListDraft {
  return {
    id: item.id,
    title: item.title,
    active: item.active,
    clips: (item.clips ?? []).map((clip) => ({
      videoUrl: clip.videoUrl,
      videoFileName: clip.videoFileName,
      label: clip.label ?? '',
      ctaUrl: clip.ctaUrl ?? '',
    })),
  }
}

function fileLabel(clip: ClipDraft): string {
  if (clip.file?.name) return clip.file.name
  if (!clip.videoFileName) return ''
  const parts = clip.videoFileName.split('/')
  return parts[parts.length - 1] || clip.videoFileName
}

export default function VideoPopupListSettings() {
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
        const data = await fetchVideoPopupListsAdmin()
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

  const removeList = (index: number) => {
    const target = lists[index]
    if (!target) return
    const keys = target.clips.map((clip) => clip.videoFileName).filter(Boolean)
    if (keys.length > 0) {
      setRemovedKeys((current) => [...current, ...keys])
    }
    setLists((current) => current.filter((_, i) => i !== index))
  }

  const titleMissing = (list: ListDraft) => !list.title.trim()
  const videoMissing = (list: ListDraft) =>
    list.clips.length === 0 || list.clips.some((clip) => !clip.file && !clip.videoUrl)

  const onSave = async () => {
    if ((lists.length === 0 && removedKeys.length === 0) || loading || saving) return
    if (lists.some((list) => titleMissing(list) || videoMissing(list))) {
      setShowErrors(true)
      return
    }

    const hasInvalidCta = lists.some((list) =>
      list.clips.some((clip) => {
        const ctaUrl = clip.ctaUrl?.trim()
        return ctaUrl && !isSafeCtaUrl(ctaUrl)
      }),
    )
    if (hasInvalidCta) {
      notification.error({ message: t('cta_url_invalid') })
      return
    }

    setShowErrors(false)
    setSaving(true)
    const uploadedKeys: string[] = []
    const keysToDelete = new Set(removedKeys.filter(Boolean))
    let saveStarted = false

    try {
      const payload: VideoPopupList[] = []
      for (const list of lists) {
        const clips: VideoPopupClip[] = []
        for (const clip of list.clips) {
          if (clip.file) {
            const uploaded = await uploadVideoToR2(clip.file)
            uploadedKeys.push(uploaded.fileName)
            if (clip.videoFileName) keysToDelete.add(clip.videoFileName)
            clips.push({
              videoUrl: uploaded.fileContent,
              videoFileName: uploaded.fileName,
              label: clip.label?.trim() || undefined,
              ctaUrl: clip.ctaUrl?.trim() || undefined,
            })
          } else {
            clips.push({
              videoUrl: clip.videoUrl,
              videoFileName: clip.videoFileName,
              label: clip.label?.trim() || undefined,
              ctaUrl: clip.ctaUrl?.trim() || undefined,
            })
          }
        }
        payload.push({
          id: list.id,
          title: list.title,
          active: list.active,
          clips,
        })
      }

      saveStarted = true
      const savedLists = await createUpdateVideoPopupLists(payload)
      setLists(savedLists.map(toListDraft))
      setRemovedKeys([])
      notification.success({ message: t('save_success') })

      const retainedKeys = new Set(
        savedLists.flatMap((list) => (list.clips ?? []).map((clip) => clip.videoFileName)),
      )
      const keys = [...keysToDelete].filter((key) => !retainedKeys.has(key))
      if (keys.length > 0) await deleteMultipleFilesToR2(keys)
    } catch (error) {
      if (!saveStarted && uploadedKeys.length > 0) {
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

  return (
    <Spin spinning={loading}>
      <div className="video-popup-settings">
        <div className="video-popup-settings__bar">
          <Button
            icon={<PlusOutlined />}
            disabled={loading || saving}
            onClick={() => setLists((current) => [...current, emptyList()])}
          >
            {t('add')}
          </Button>
          <Button
            type="primary"
            className="btn-form"
            loading={saving}
            disabled={(lists.length === 0 && removedKeys.length === 0) || loading || saving}
            onClick={onSave}
          >
            {t('save')}
          </Button>
        </div>

        {lists.length === 0 ? <p className="video-popup-settings__empty">{t('empty')}</p> : null}

        {lists.map((item, index) => (
          <section className="video-popup-settings__card" key={item.id ?? `draft-${index}`}>
            <div className="video-popup-settings__head">
              <h3 className="video-popup-settings__head-title">
                {item.title.trim() || `${t('title')} ${index + 1}`}
              </h3>
              <div className="video-popup-settings__head-actions">
                <span>{t('active')}</span>
                <Switch
                  checked={item.active}
                  onChange={(active) => updateList(index, { active })}
                />
                <Button
                  type="text"
                  danger
                  aria-label={t('remove_list')}
                  icon={<DeleteOutlined />}
                  onClick={() => removeList(index)}
                />
              </div>
            </div>

            <Form layout="vertical">
              <Form.Item
                label={t('name')}
                required
                validateStatus={showErrors && titleMissing(item) ? 'error' : undefined}
                help={showErrors && titleMissing(item) ? t('title_required') : undefined}
              >
                <Input
                  value={item.title}
                  onChange={(event) => updateList(index, { title: event.target.value })}
                />
              </Form.Item>

              <Form.Item
                label={t('clips')}
                required
                validateStatus={showErrors && videoMissing(item) ? 'error' : undefined}
                help={showErrors && videoMissing(item) ? t('video_required') : undefined}
              >
                <p className="video-popup-settings__hint">{t('order_hint')}</p>
                {item.clips.map((clip, clipIndex) => {
                  const name = fileLabel(clip)
                  return (
                    <div className="video-popup-settings__clip" key={`${index}-${clipIndex}`}>
                      <span className="video-popup-settings__index">
                        {String(clipIndex + 1).padStart(2, '0')}
                      </span>
                      <div className="video-popup-settings__file">
                        <Upload
                          maxCount={1}
                          showUploadList={false}
                          accept="video/mp4,video/webm"
                          beforeUpload={(file) => {
                            if (!VIDEO_TYPES.has(file.type) || file.size > MAX_VIDEO_BYTES) {
                              notification.error({ message: t('video_invalid') })
                              return false
                            }
                            const clips = [...item.clips]
                            clips[clipIndex] = { ...clips[clipIndex], file }
                            updateList(index, { clips })
                            return false
                          }}
                        >
                          <Button icon={<UploadOutlined />}>{t('choose_file')}</Button>
                        </Upload>
                        <span className="video-popup-settings__filename" title={name}>
                          {name}
                        </span>
                      </div>
                      <Input
                        placeholder={t('cta_url')}
                        value={clip.ctaUrl}
                        onChange={(event) => {
                          const clips = [...item.clips]
                          clips[clipIndex] = { ...clips[clipIndex], ctaUrl: event.target.value }
                          updateList(index, { clips })
                        }}
                      />
                      <Input
                        placeholder={t('clip_label')}
                        value={clip.label}
                        onChange={(event) => {
                          const clips = [...item.clips]
                          clips[clipIndex] = { ...clips[clipIndex], label: event.target.value }
                          updateList(index, { clips })
                        }}
                      />
                      <Space>
                        <Button
                          aria-label={t('move_up')}
                          icon={<ArrowUpOutlined />}
                          disabled={clipIndex === 0}
                          onClick={() => moveClip(index, clipIndex, -1)}
                        />
                        <Button
                          aria-label={t('move_down')}
                          icon={<ArrowDownOutlined />}
                          disabled={clipIndex === item.clips.length - 1}
                          onClick={() => moveClip(index, clipIndex, 1)}
                        />
                        <Button
                          danger
                          aria-label={t('remove_clip')}
                          icon={<DeleteOutlined />}
                          onClick={() => {
                            if (clip.videoFileName) {
                              setRemovedKeys((keys) => [...keys, clip.videoFileName])
                            }
                            updateList(index, {
                              clips: item.clips.filter((_, i) => i !== clipIndex),
                            })
                          }}
                        />
                      </Space>
                    </div>
                  )
                })}
                <Button
                  icon={<PlusOutlined />}
                  onClick={() =>
                    updateList(index, {
                      clips: [
                        ...item.clips,
                        { videoUrl: '', videoFileName: '', label: '', ctaUrl: '' },
                      ],
                    })
                  }
                >
                  {t('add_clip')}
                </Button>
              </Form.Item>
            </Form>
          </section>
        ))}
      </div>
    </Spin>
  )
}
