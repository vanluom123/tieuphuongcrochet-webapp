'use client'

import { Button, Form, Input, Popconfirm, Spin, Switch } from 'antd'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { useTranslations } from 'next-intl'
import { useVideoPopupEditor } from './videoPopup/useVideoPopupEditor'
import { validateDraftList } from './videoPopup/videoPopupEditor.helpers'
import VideoPopupClipRow from './videoPopup/VideoPopupClipRow'
import '@/app/ui/components/videoPopup.scss'

export default function VideoPopupListSettings() {
  const t = useTranslations('VideoPopupList')
  const {
    lists,
    loading,
    saving,
    showErrors,
    canSave,
    onSave,
    addList,
    removeList,
    addClip,
    updateList,
    updateClip,
    moveClip,
    removeClip,
  } = useVideoPopupEditor()

  return (
    <Spin spinning={loading || saving}>
      <div className="video-popup-settings">
        <div className="video-popup-settings__bar">
          <Button icon={<PlusOutlined />} disabled={loading || saving} onClick={addList}>
            {t('add')}
          </Button>
          <Button
            type="primary"
            className="btn-form"
            loading={saving}
            disabled={!canSave}
            onClick={onSave}
          >
            {t('save')}
          </Button>
        </div>

        {lists.length === 0 ? <p className="video-popup-settings__empty">{t('empty')}</p> : null}

        {lists.map((item, index) => {
          const errors = validateDraftList(item)
          return (
            <section className="video-popup-settings__card" key={item.key}>
              <div className="video-popup-settings__head">
                <h3 className="video-popup-settings__head-title">
                  {item.title.trim() || `${t('title')} ${index + 1}`}
                </h3>
                <div className="video-popup-settings__head-actions">
                  <span>{t('active')}</span>
                  <Switch
                    aria-label={t('active')}
                    checked={item.active}
                    onChange={(active) => updateList(index, { active })}
                  />
                  <Popconfirm
                    title={t('delete_list_confirm')}
                    okText={t('confirm_yes')}
                    cancelText={t('confirm_no')}
                    onConfirm={() => removeList(index)}
                  >
                    <Button
                      type="text"
                      danger
                      aria-label={t('remove_list')}
                      title={t('remove_list')}
                      icon={<DeleteOutlined />}
                    />
                  </Popconfirm>
                </div>
              </div>

              <Form layout="vertical">
                <Form.Item
                  label={t('name')}
                  required
                  validateStatus={showErrors && errors.titleMissing ? 'error' : undefined}
                  help={showErrors && errors.titleMissing ? t('title_required') : undefined}
                >
                  <Input
                    value={item.title}
                    onChange={(event) => updateList(index, { title: event.target.value })}
                  />
                </Form.Item>

                <Form.Item
                  label={t('clips')}
                  required
                  validateStatus={showErrors && errors.videoMissing ? 'error' : undefined}
                  help={showErrors && errors.videoMissing ? t('video_required') : undefined}
                >
                  <p className="video-popup-settings__hint">{t('order_hint')}</p>
                  {item.clips.map((clip, clipIndex) => (
                    <VideoPopupClipRow
                      key={clip.key}
                      clip={clip}
                      index={clipIndex}
                      canMoveUp={clipIndex > 0}
                      canMoveDown={clipIndex < item.clips.length - 1}
                      onChange={(patch) => updateClip(index, clipIndex, patch)}
                      onMove={(direction) => moveClip(index, clipIndex, direction)}
                      onRemove={() => removeClip(index, clipIndex)}
                    />
                  ))}
                  <Button icon={<PlusOutlined />} onClick={() => addClip(index)}>
                    {t('add_clip')}
                  </Button>
                </Form.Item>
              </Form>
            </section>
          )
        })}
      </div>
    </Spin>
  )
}
