'use client'

import { Button, Input, Space, Upload } from 'antd'
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DeleteOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import { useTranslations } from 'next-intl'
import { VIDEO_UPLOAD } from '@/app/lib/constant'
import { notification } from '@/app/lib/notify'
import { ClipDraft } from './useVideoPopupEditor'

interface VideoPopupClipRowProps {
  clip: ClipDraft
  index: number
  canMoveUp: boolean
  canMoveDown: boolean
  onChange: (patch: Partial<ClipDraft>) => void
  onMove: (direction: -1 | 1) => void
  onRemove: () => void
}

function fileLabel(clip: ClipDraft): string {
  if (clip.file?.name) return clip.file.name
  if (!clip.videoFileName) return ''
  const parts = clip.videoFileName.split('/')
  return parts[parts.length - 1] || clip.videoFileName
}

export default function VideoPopupClipRow({
  clip,
  index,
  canMoveUp,
  canMoveDown,
  onChange,
  onMove,
  onRemove,
}: VideoPopupClipRowProps) {
  const t = useTranslations('VideoPopupList')
  const name = fileLabel(clip)

  return (
    <div className="video-popup-settings__clip">
      <span className="video-popup-settings__index">{String(index + 1).padStart(2, '0')}</span>
      <div className="video-popup-settings__file">
        <Upload
          maxCount={1}
          showUploadList={false}
          accept={VIDEO_UPLOAD.MIME_TYPES.join(',')}
          beforeUpload={(file) => {
            if (!VIDEO_UPLOAD.MIME_TYPES.includes(file.type) || file.size > VIDEO_UPLOAD.MAX_BYTES) {
              notification.error({ message: t('video_invalid') })
              return false
            }
            onChange({ file })
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
        aria-label={t('cta_url')}
        value={clip.ctaUrl ?? ''}
        onChange={(event) => onChange({ ctaUrl: event.target.value })}
      />
      <Input
        placeholder={t('clip_label')}
        aria-label={t('clip_label')}
        value={clip.label ?? ''}
        onChange={(event) => onChange({ label: event.target.value })}
      />
      <Space>
        <Button
          aria-label={t('move_up')}
          icon={<ArrowUpOutlined />}
          disabled={!canMoveUp}
          onClick={() => onMove(-1)}
        />
        <Button
          aria-label={t('move_down')}
          icon={<ArrowDownOutlined />}
          disabled={!canMoveDown}
          onClick={() => onMove(1)}
        />
        <Button danger aria-label={t('remove_clip')} icon={<DeleteOutlined />} onClick={onRemove} />
      </Space>
    </div>
  )
}
