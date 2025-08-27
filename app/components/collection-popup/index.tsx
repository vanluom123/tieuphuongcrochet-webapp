'use client'

import { Button, Empty, Form, Input, List, message, Modal, Spin } from 'antd'
import { FolderOutlined, PlusOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useSession } from 'next-auth/react'
import { Collection } from '@/app/lib/definitions'
import { createCollection, fetchUserCollections } from '@/app/lib/service/profileService'
import { savePatternToCollection } from '@/app/lib/service/collectionService'

interface CollectionPopupProps {
  isOpen: boolean
  onClose: () => void
  patternId: string
  patternName?: string
  onSuccess?: () => void
}

const CollectionPopup = ({
  isOpen,
  onClose,
  patternId,
  patternName,
  onSuccess,
}: CollectionPopupProps) => {
  const t = useTranslations('CollectionPopup')
  const { data: session } = useSession()
  const [form] = Form.useForm()

  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [saving, setSaving] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)

  // Fetch user collections when modal opens
  useEffect(() => {
    if (isOpen && session?.user?.id) {
      fetchCollections()
    }
  }, [isOpen, session?.user?.id])

  const fetchCollections = async () => {
    if (!session?.user?.id) return

    setLoading(true)
    try {
      const userCollections = await fetchUserCollections(session.user.id)
      setCollections(userCollections)
    } catch (error) {
      console.error('Error fetching collections:', error)
      message.error(t('fetchError'))
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCollection = async (values: { name: string }) => {
    setCreating(true)
    try {
      const response = await createCollection(values.name)
      if (response.success) {
        message.success(t('createSuccess'))
        form.resetFields()
        setShowCreateForm(false)
        await fetchCollections() // Refresh collections list
      } else {
        message.error(response.message || t('createError'))
      }
    } catch (error) {
      console.error('Error creating collection:', error)
      message.error(t('createError'))
    } finally {
      setCreating(false)
    }
  }

  const handleSaveToCollection = async (collectionId: string) => {
    setSaving(collectionId)
    try {
      const response = await savePatternToCollection(patternId, collectionId)
      if (response.success) {
        message.success(t('saveSuccess'))
        onSuccess?.()
        onClose()
      } else {
        message.error(response.message || t('saveError'))
      }
    } catch (error) {
      console.error('Error saving to collection:', error)
      message.error(t('saveError'))
    } finally {
      setSaving(null)
    }
  }

  const handleClose = () => {
    form.resetFields()
    setShowCreateForm(false)
    onClose()
  }

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FolderOutlined />
          {t('title')}
        </div>
      }
      open={isOpen}
      onCancel={handleClose}
      footer={null}
      width={typeof window !== 'undefined' && window.innerWidth < 768 ? '95%' : 500}
      centered
      destroyOnClose
      style={{
        maxWidth: '95vw',
        margin: '0 auto',
      }}
      bodyStyle={{
        padding: typeof window !== 'undefined' && window.innerWidth < 768 ? '16px' : '24px',
      }}
    >
      <div style={{ marginBottom: 16 }}>
        <p style={{ margin: 0, color: '#666' }}>
          {t('description', { patternName: patternName || t('thisPattern') })}
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          {/* Collections List */}
          {collections.length > 0 ? (
            <List
              dataSource={collections}
              renderItem={(collection) => (
                <List.Item
                  style={{
                    cursor: saving === collection.id ? 'not-allowed' : 'pointer',
                    opacity: saving === collection.id ? 0.6 : 1,
                    padding:
                      typeof window !== 'undefined' && window.innerWidth < 768
                        ? '16px 12px'
                        : '12px 16px',
                    borderRadius: '6px',
                    transition: 'all 0.2s ease',
                    marginBottom:
                      typeof window !== 'undefined' && window.innerWidth < 768 ? '8px' : '4px',
                    backgroundColor: '#fafafa',
                    border: '1px solid #f0f0f0',
                  }}
                  onClick={() => {
                    if (saving !== collection.id) {
                      handleSaveToCollection(collection.id)
                    }
                  }}
                >
                  <List.Item.Meta
                    avatar={
                      saving === collection.id ? (
                        <Spin size="small" />
                      ) : (
                        <FolderOutlined
                          style={{
                            fontSize:
                              typeof window !== 'undefined' && window.innerWidth < 768 ? 24 : 20,
                            color: '#1890ff',
                          }}
                        />
                      )
                    }
                    title={
                      <span
                        style={{
                          fontSize:
                            typeof window !== 'undefined' && window.innerWidth < 768
                              ? '16px'
                              : '14px',
                          fontWeight: 500,
                        }}
                      >
                        {collection.name}
                      </span>
                    }
                    description={
                      <span
                        style={{
                          color: '#666',
                          fontSize:
                            typeof window !== 'undefined' && window.innerWidth < 768
                              ? '14px'
                              : '12px',
                        }}
                      >
                        {collection.totalPatterns || 0} {t('patterns')}
                      </span>
                    }
                  />
                </List.Item>
              )}
            />
          ) : (
            <Empty description={t('noCollections')} image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}

          {/* Create New Collection Form */}
          {showCreateForm ? (
            <div
              style={{
                marginTop: 16,
                padding: typeof window !== 'undefined' && window.innerWidth < 768 ? '12px' : '16px',
                border: '1px solid #f0f0f0',
                borderRadius: 6,
              }}
            >
              <Form
                form={form}
                onFinish={handleCreateCollection}
                layout={
                  typeof window !== 'undefined' && window.innerWidth < 768 ? 'vertical' : 'inline'
                }
                style={{ width: '100%' }}
              >
                <Form.Item
                  name="name"
                  rules={[{ required: true, message: t('nameRequired') }]}
                  style={
                    typeof window !== 'undefined' && window.innerWidth < 768
                      ? { marginBottom: 12 }
                      : { flex: 1, marginRight: 8 }
                  }
                >
                  <Input
                    placeholder={t('collectionName')}
                    disabled={creating}
                    size={
                      typeof window !== 'undefined' && window.innerWidth < 768 ? 'large' : 'middle'
                    }
                  />
                </Form.Item>
                <div
                  style={{
                    display: 'flex',
                    gap: 8,
                    flexDirection:
                      typeof window !== 'undefined' && window.innerWidth < 768 ? 'column' : 'row',
                  }}
                >
                  <Form.Item style={{ margin: 0, flex: 1 }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={creating}
                      icon={<PlusOutlined />}
                      size={
                        typeof window !== 'undefined' && window.innerWidth < 768
                          ? 'large'
                          : 'middle'
                      }
                      style={{ width: '100%' }}
                    >
                      {t('create')}
                    </Button>
                  </Form.Item>
                  <Form.Item style={{ margin: 0, flex: 1 }}>
                    <Button
                      onClick={() => {
                        setShowCreateForm(false)
                        form.resetFields()
                      }}
                      disabled={creating}
                      size={
                        typeof window !== 'undefined' && window.innerWidth < 768
                          ? 'large'
                          : 'middle'
                      }
                      style={{ width: '100%' }}
                    >
                      {t('cancel')}
                    </Button>
                  </Form.Item>
                </div>
              </Form>
            </div>
          ) : (
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <Button
                type="dashed"
                icon={<PlusOutlined />}
                onClick={() => setShowCreateForm(true)}
                style={{
                  width: '100%',
                  height:
                    typeof window !== 'undefined' && window.innerWidth < 768 ? '48px' : '40px',
                  fontSize:
                    typeof window !== 'undefined' && window.innerWidth < 768 ? '16px' : '14px',
                }}
                size={typeof window !== 'undefined' && window.innerWidth < 768 ? 'large' : 'middle'}
              >
                {t('createNewCollection')}
              </Button>
            </div>
          )}
        </>
      )}
    </Modal>
  )
}

export default CollectionPopup
