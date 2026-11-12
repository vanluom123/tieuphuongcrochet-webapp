'use client'

import { Button, Input, Popconfirm, Space, Upload } from 'antd'
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DeleteOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import { useTranslations } from 'next-intl'
import { VIDEO_UPLOAD } from '@/app/lib/constant'
import { notification } from '@/app/lib/notify'
import { formatCtaLink, isSafeCtaUrl } from '@/app/components/video-popup/videoPopupUrl'
import { ClipDraft, resolveFileDisplayName } from './videoPopupEditor.helpers'

interface VideoPopupClipRowProps {
  clip: ClipDraft
  index: number
  canMoveUp: boolean
  canMoveDown: boolean
  onChange: (patch: Partial<ClipDraft>) => void
  onMove: (direction: -1 | 1) => void
  onRemove: () => void
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
  const name = resolveFileDisplayName(clip)
  const ctaUrl = formatCtaLink(clip.ctaUrl ?? '')
  const ctaInvalid = ctaUrl !== '' && !isSafeCtaUrl(ctaUrl)

  return (
    <div className="video-popup-settings__clip">
      <div className="video-popup-settings__clip-bar">
        <span className="video-popup-settings__index">#{String(index + 1).padStart(2, '0')}</span>
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
        <Space className="video-popup-settings__clip-actions">
          <Button
            aria-label={t('move_up')}
            title={t('move_up')}
            icon={<ArrowUpOutlined />}
            disabled={!canMoveUp}
            onClick={() => onMove(-1)}
          />
          <Button
            aria-label={t('move_down')}
            title={t('move_down')}
            icon={<ArrowDownOutlined />}
            disabled={!canMoveDown}
            onClick={() => onMove(1)}
          />
          <Popconfirm
            title={t('delete_clip_confirm')}
            okText={t('confirm_yes')}
            cancelText={t('confirm_no')}
            onConfirm={onRemove}
          >
            <Button danger aria-label={t('remove_clip')} title={t('remove_clip')} icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      </div>

      <div className="video-popup-settings__field">
        <Input
          placeholder={t('cta_url')}
          aria-label={t('cta_url')}
          value={clip.ctaUrl ?? ''}
          status={ctaInvalid ? 'warning' : undefined}
          onChange={(event) => onChange({ ctaUrl: event.target.value })}
        />
        {ctaInvalid ? <span className="video-popup-settings__field-hint">{t('cta_url_invalid')}</span> : null}
      </div>

      <Input
        placeholder={t('clip_label')}
        aria-label={t('clip_label')}
        value={clip.label ?? ''}
        onChange={(event) => onChange({ label: event.target.value })}
      />
    </div>
  )
}