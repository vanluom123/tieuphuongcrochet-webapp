'use client'

import { useEffect, useState } from 'react'
import { Button, Form, Input, Modal, Popconfirm, Segmented, Space, Spin, Switch, Tag, Upload } from 'antd'
import type { FormInstance } from 'antd'
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import { useTranslations } from 'next-intl'
import {
  isSafeCtaUrl,
  isSafeVideoUrl,
  resolveVideoEmbedUrl,
} from '@/app/components/video-popup/videoPopup.utils'
import { VIDEO_UPLOAD } from '@/app/lib/constant'
import { VideoPopup, VideoPopupClip } from '@/app/lib/definitions'
import { notification } from '@/app/lib/notify'
import { uploadVideoToR2 } from '@/app/lib/service/r2Service'
import {
  createVideoPopup,
  deleteVideoPopup,
  fetchVideoPopupsAdmin,
  updateVideoPopup,
} from '@/app/lib/service/videoPopupService'
import styles from './VideoPopupListSettings.module.scss'

type ClipSourceType = 'upload' | 'url'

interface ClipFormValue {
  sourceType: ClipSourceType
  videoUrl: string
  videoFileName?: string
  label?: string
  ctaUrl?: string
  file?: File
}

interface PopupFormValues {
  title: string
  active: boolean
  clips: ClipFormValue[]
}

function createEmptyClip(): ClipFormValue {
  return {
    sourceType: 'upload',
    videoUrl: '',
    videoFileName: '',
    label: '',
    ctaUrl: '',
  }
}

function resolveFileDisplayName(clip?: ClipFormValue): string {
  if (clip?.file?.name) return clip.file.name
  if (!clip?.videoFileName) return ''
  const parts = clip.videoFileName.split('/')
  return parts[parts.length - 1] || clip.videoFileName
}

function ClipPreview({ file, videoUrl }: { file?: File; videoUrl?: string }) {
  const [objectUrl, setObjectUrl] = useState('')

  useEffect(() => {
    if (!file) {
      setObjectUrl('')
      return
    }
    const url = URL.createObjectURL(file)
    setObjectUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const embedUrl = !file && videoUrl ? resolveVideoEmbedUrl(videoUrl) : null
  if (embedUrl) {
    return (
      <iframe
        className={styles.previewIframe}
        src={embedUrl}
        title="Video preview"
        allow="fullscreen; picture-in-picture"
        allowFullScreen
      />
    )
  }

  const src = objectUrl || videoUrl
  if (!src) return null

  return <video className={styles.preview} src={src} controls preload="metadata" />
}

interface ClipRowProps {
  fieldName: number
  index: number
  total: number
  form: FormInstance<PopupFormValues>
  onMove: (from: number, to: number) => void
  onRemove: (index: number) => void
}

function ClipRow({ fieldName, index, total, form, onMove, onRemove }: ClipRowProps) {
  const t = useTranslations('VideoPopupList')
  const clip = Form.useWatch(['clips', fieldName], form)
  const sourceType: ClipSourceType = clip?.sourceType ?? 'upload'
  const fileName = resolveFileDisplayName(clip)
  const safePreviewUrl = isSafeVideoUrl(clip?.videoUrl ?? '') ? clip?.videoUrl?.trim() : undefined

  const handleSourceChange = (nextValue: string | number) => {
    if (nextValue === 'url') {
      form.setFieldValue(['clips', fieldName, 'file'], undefined)
      form.setFieldValue(['clips', fieldName, 'videoFileName'], undefined)
      return
    }
    form.setFieldValue(['clips', fieldName, 'videoUrl'], '')
  }

  return (
    <div className={styles.clip}>
      <div className={styles.clipBar}>
        <span className={styles.clipIndex}>#{String(index + 1).padStart(2, '0')}</span>
        <Form.Item name={[fieldName, 'sourceType']} noStyle>
          <Segmented
            size="small"
            className={styles.sourceSegmented}
            aria-label={t('clips')}
            options={[
              { label: t('source_upload'), value: 'upload' },
              { label: t('source_url'), value: 'url' },
            ]}
            onChange={handleSourceChange}
          />
        </Form.Item>
        <Space className={styles.clipActions}>
          <Button
            aria-label={t('move_up')}
            title={t('move_up')}
            icon={<ArrowUpOutlined />}
            disabled={index === 0}
            onClick={() => onMove(index, index - 1)}
          />
          <Button
            aria-label={t('move_down')}
            title={t('move_down')}
            icon={<ArrowDownOutlined />}
            disabled={index === total - 1}
            onClick={() => onMove(index, index + 1)}
          />
          <Button
            danger
            aria-label={t('remove_clip')}
            title={t('remove_clip')}
            icon={<DeleteOutlined />}
            onClick={() => onRemove(index)}
          />
        </Space>
      </div>

      {sourceType === 'upload' ? (
        <>
          <div className={styles.uploadRow}>
            <Upload
              maxCount={1}
              showUploadList={false}
              accept={VIDEO_UPLOAD.MIME_TYPES.join(',')}
              beforeUpload={(file) => {
                if (!VIDEO_UPLOAD.MIME_TYPES.includes(file.type) || file.size > VIDEO_UPLOAD.MAX_BYTES) {
                  notification.error({ message: t('video_invalid') })
                  return false
                }
                form.setFieldValue(['clips', fieldName, 'file'], file)
                form.validateFields([['clips', fieldName, 'videoFileName']]).catch(() => undefined)
                return false
              }}
            >
              <Button icon={<UploadOutlined />}>{t('choose_file')}</Button>
            </Upload>
            {fileName ? (
              <span className={styles.fileBadge} title={fileName}>
                <span className={styles.fileName}>{fileName}</span>
              </span>
            ) : null}
          </div>

          <Form.Item
            name={[fieldName, 'videoFileName']}
            className={styles.fieldItem}
            rules={[
              {
                validator: async () => {
                  const current = form.getFieldValue(['clips', fieldName]) as ClipFormValue | undefined
                  if (!current?.file && !current?.videoUrl) {
                    return Promise.reject(new Error(t('video_required')))
                  }
                },
              },
            ]}
          >
            <input type="hidden" />
          </Form.Item>
        </>
      ) : (
        <Form.Item
          name={[fieldName, 'videoUrl']}
          className={styles.fieldItem}
          rules={[
            {
              validator: async (_, value: string | undefined) => {
                const trimmed = (value ?? '').trim()
                if (!trimmed) {
                  return Promise.reject(new Error(t('video_required')))
                }
                if (!isSafeVideoUrl(trimmed)) {
                  return Promise.reject(new Error(t('video_url_invalid')))
                }
              },
            },
          ]}
        >
          <Input placeholder={t('video_url_placeholder')} aria-label={t('video_url')} />
        </Form.Item>
      )}

      <ClipPreview file={clip?.file} videoUrl={safePreviewUrl} />

      <div className={styles.metaFields}>
        <Form.Item
          name={[fieldName, 'ctaUrl']}
          className={styles.fieldItem}
          rules={[
            {
              validator: async (_, value: string | undefined) => {
                const trimmed = (value ?? '').trim()
                if (trimmed && !isSafeCtaUrl(trimmed)) {
                  return Promise.reject(new Error(t('cta_url_invalid')))
                }
              },
            },
          ]}
        >
          <Input placeholder={t('cta_url')} aria-label={t('cta_url')} />
        </Form.Item>

        <Form.Item name={[fieldName, 'label']} className={styles.fieldItem}>
          <Input placeholder={t('clip_label')} aria-label={t('clip_label')} />
        </Form.Item>
      </div>
    </div>
  )
}

export default function VideoPopupListSettings() {
  const t = useTranslations('VideoPopupList')
  const [form] = Form.useForm<PopupFormValues>()
  const [lists, setLists] = useState<VideoPopup[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<VideoPopup | null>(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const data = await fetchVideoPopupsAdmin()
        if (!cancelled) setLists(data)
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

  const openCreate = () => {
    setEditingItem(null)
    form.setFieldsValue({
      title: '',
      active: true,
      clips: [createEmptyClip()],
    })
    setModalOpen(true)
  }

  const openEdit = (item: VideoPopup) => {
    setEditingItem(item)
    form.setFieldsValue({
      title: item.title,
      active: item.active,
      clips: (item.clips ?? []).map((clip) => ({
        sourceType: clip.videoFileName ? 'upload' : 'url',
        videoUrl: clip.videoUrl,
        videoFileName: clip.videoFileName ?? '',
        label: clip.label ?? '',
        ctaUrl: clip.ctaUrl ?? '',
      })),
    })
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingItem(null)
    form.resetFields()
  }

  const handleToggleActive = async (item: VideoPopup, active: boolean) => {
    if (!item.id) return
    setTogglingId(item.id)
    try {
      const updated = await updateVideoPopup(item.id, {
        title: item.title,
        active,
        clips: item.clips,
      })
      setLists((current) => current.map((entry) => (entry.id === updated.id ? updated : entry)))
      notification.success({ message: t('update_success') })
    } catch (error) {
      notification.error({
        message: t('save_error'),
        description: error instanceof Error ? error.message : undefined,
      })
    } finally {
      setTogglingId(null)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteVideoPopup(id)
      setLists((current) => current.filter((item) => item.id !== id))
      notification.success({ message: t('delete_success') })
    } catch (error) {
      notification.error({
        message: t('delete_error'),
        description: error instanceof Error ? error.message : undefined,
      })
    }
  }

  const handleFinish = async (values: PopupFormValues) => {
    setSaving(true)
    try {
      const clips: VideoPopupClip[] = []
      for (const clip of values.clips) {
        const label = clip.label?.trim() || undefined
        const ctaUrl = clip.ctaUrl?.trim() || undefined

        if (clip.sourceType === 'url') {
          clips.push({
            videoUrl: clip.videoUrl.trim(),
            label,
            ctaUrl,
          })
          continue
        }

        let videoUrl = clip.videoUrl
        let videoFileName = clip.videoFileName
        if (clip.file) {
          try {
            const uploaded = await uploadVideoToR2(clip.file)
            videoUrl = uploaded.fileContent
            videoFileName = uploaded.fileName
          } catch (error) {
            const detail = error instanceof Error ? error.message : ''
            throw new Error(detail ? `${t('video_upload_failed')}: ${detail}` : t('video_upload_failed'))
          }
        }
        clips.push({
          videoUrl,
          videoFileName,
          label,
          ctaUrl,
        })
      }

      const payload: Omit<VideoPopup, 'id'> = {
        title: values.title.trim(),
        active: Boolean(values.active),
        clips,
      }

      if (editingItem?.id) {
        const updated = await updateVideoPopup(editingItem.id, payload)
        setLists((current) => current.map((item) => (item.id === updated.id ? updated : item)))
        notification.success({ message: t('update_success') })
      } else {
        const created = await createVideoPopup(payload)
        setLists((current) => [created, ...current])
        notification.success({ message: t('create_success') })
      }
      closeModal()
    } catch (error) {
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
      <div className={styles.settings}>
        <div className={styles.toolbar}>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            {t('add')}
          </Button>
        </div>

        {lists.length === 0 ? (
          <p className={styles.empty}>{t('empty')}</p>
        ) : (
          <div className={styles.list}>
            {lists.map((item) => (
              <section className={styles.card} key={item.id ?? item.title}>
                <div className={styles.cardMeta}>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <div className={styles.cardSub}>
                    <Tag color={item.active ? 'green' : 'default'}>
                      {item.active ? t('active') : t('inactive')}
                    </Tag>
                    <span>{t('clips_count', { count: item.clips?.length ?? 0 })}</span>
                  </div>
                </div>
                <div className={styles.cardActions}>
                  <Switch
                    aria-label={t('active')}
                    checked={item.active}
                    loading={togglingId === item.id}
                    onChange={(checked) => handleToggleActive(item, checked)}
                  />
                  <Button
                    icon={<EditOutlined />}
                    aria-label={t('edit')}
                    title={t('edit')}
                    onClick={() => openEdit(item)}
                  />
                  <Popconfirm
                    title={t('delete_list_confirm')}
                    okText={t('confirm_yes')}
                    cancelText={t('confirm_no')}
                    onConfirm={() => item.id && handleDelete(item.id)}
                  >
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      aria-label={t('remove_list')}
                      title={t('remove_list')}
                    />
                  </Popconfirm>
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      <Modal
        open={modalOpen}
        title={editingItem ? t('edit') : t('add')}
        onCancel={closeModal}
        onOk={() => form.submit()}
        okText={t('save')}
        cancelText={t('cancel')}
        confirmLoading={saving}
        maskClosable={false}
        destroyOnClose
        width={720}
      >
        <Form form={form} layout="vertical" className={styles.modalForm} onFinish={handleFinish}>
          <Form.Item
            name="title"
            label={t('name')}
            rules={[{ required: true, whitespace: true, message: t('title_required') }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="active" label={t('active')} valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item label={t('clips')} required>
            <p className={styles.hint}>{t('order_hint')}</p>
            <Form.List
              name="clips"
              rules={[
                {
                  validator: async (_, value) => {
                    if (!value || value.length === 0) {
                      return Promise.reject(new Error(t('clips_required')))
                    }
                  },
                },
              ]}
            >
              {(fields, { add, remove, move }, { errors }) => (
                <>
                  {fields.map((field, index) => (
                    <ClipRow
                      key={field.key}
                      fieldName={field.name}
                      index={index}
                      total={fields.length}
                      form={form}
                      onMove={move}
                      onRemove={remove}
                    />
                  ))}
                  <Button icon={<PlusOutlined />} onClick={() => add(createEmptyClip())}>
                    {t('add_clip')}
                  </Button>
                  <Form.ErrorList errors={errors} />
                </>
              )}
            </Form.List>
          </Form.Item>
        </Form>
      </Modal>
    </Spin>
  )
}
