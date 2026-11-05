'use client'

import { Button, Form, Input, Space, Switch, Upload } from 'antd'
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
import '@/app/ui/components/videoPopup.scss'

interface ClipDraft extends VideoPopupClip {
  file?: File
}

interface ListDraft {
  id?: string
  title: string
  ctaUrl?: string
  ctaLabel?: string
  active: boolean
  clips: ClipDraft[]
}

const emptyList = (): ListDraft => ({
  title: '',
  active: true,
  clips: [],
})

function fileLabel(clip: ClipDraft): string {
  if (clip.file?.name) return clip.file.name
  if (!clip.videoFileName) return ''
  const parts = clip.videoFileName.split('/')
  return parts[parts.length - 1] || clip.videoFileName
}

export default function VideoPopupListSettings() {
  const t = useTranslations('VideoPopupList')
  const [lists, setLists] = useState<ListDraft[]>([])
  const [saving, setSaving] = useState(false)
  const [showErrors, setShowErrors] = useState(false)
  const [removedKeys, setRemovedKeys] = useState<string[]>([])

  useEffect(() => {
    fetchVideoPopupListsAdmin().then((data) => {
      setLists(
        data.map((item) => ({
          id: item.id,
          title: item.title,
          ctaUrl: item.ctaUrl,
          ctaLabel: item.ctaLabel,
          active: item.active,
          clips: item.clips ?? [],
        })),
      )
    })
  }, [])

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

  const titleMissing = (list: ListDraft) => !list.title.trim()
  const videoMissing = (list: ListDraft) =>
    list.clips.length === 0 || list.clips.some((clip) => !clip.file && !clip.videoUrl)

  const onSave = async () => {
    if (lists.length === 0) return
    if (lists.some((list) => titleMissing(list) || videoMissing(list))) {
      setShowErrors(true)
      return
    }
    setShowErrors(false)

    setSaving(true)
    try {
      const payload: VideoPopupList[] = []
      for (const list of lists) {
        const clips: VideoPopupClip[] = []
        for (const clip of list.clips) {
          if (clip.file) {
            const uploaded = await uploadVideoToR2(clip.file)
            if (!uploaded?.fileContent || !uploaded.fileName) return
            if (clip.videoFileName) await deleteMultipleFilesToR2([clip.videoFileName])
            clips.push({
              videoUrl: uploaded.fileContent,
              videoFileName: uploaded.fileName,
              label: clip.label,
            })
          } else {
            clips.push({
              videoUrl: clip.videoUrl,
              videoFileName: clip.videoFileName,
              label: clip.label,
            })
          }
        }
        payload.push({
          id: list.id,
          title: list.title,
          ctaUrl: list.ctaUrl,
          ctaLabel: list.ctaLabel,
          active: list.active,
          clips,
        })
      }
      const keys = removedKeys.filter(Boolean)
      if (keys.length > 0) {
        await deleteMultipleFilesToR2(keys)
        setRemovedKeys([])
      }
      const ok = await createUpdateVideoPopupLists(payload)
      if (ok) {
        const fresh = await fetchVideoPopupListsAdmin()
        setLists(fresh)
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="video-popup-settings">
      <div className="video-popup-settings__bar">
        <Button icon={<PlusOutlined />} onClick={() => setLists((current) => [...current, emptyList()])}>
          {t('add')}
        </Button>
        <Button
          type="primary"
          className="btn-form"
          loading={saving}
          disabled={lists.length === 0}
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
              <Switch checked={item.active} onChange={(active) => updateList(index, { active })} />
              <Button
                type="text"
                danger
                aria-label={t('remove_list')}
                icon={<DeleteOutlined />}
                onClick={() => setLists((current) => current.filter((_, i) => i !== index))}
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
            <Space size={12} style={{ display: 'flex' }} align="start">
              <Form.Item label={t('cta_url')} style={{ flex: 1 }}>
                <Input
                  value={item.ctaUrl}
                  onChange={(event) => updateList(index, { ctaUrl: event.target.value })}
                />
              </Form.Item>
              <Form.Item label={t('cta_label')} style={{ flex: 1 }}>
                <Input
                  value={item.ctaLabel}
                  onChange={(event) => updateList(index, { ctaLabel: event.target.value })}
                />
              </Form.Item>
            </Space>

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
                    clips: [...item.clips, { videoUrl: '', videoFileName: '', label: '' }],
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
  )
}
