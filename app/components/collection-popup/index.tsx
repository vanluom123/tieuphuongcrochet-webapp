'use client'

import { Button, Col, Empty, Form, Input, List, message, Modal, Row, Spin } from 'antd'
import { FolderOutlined, PlusOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useSession } from 'next-auth/react'
import { Collection } from '@/app/lib/definitions'
import { createCollection, fetchUserCollections } from '@/app/lib/service/profileService'
import { savePatternToCollection } from '@/app/lib/service/collectionService'
import '../../ui/components/collections-popup.scss'

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
      width={typeof window !== 'undefined' && window.innerWidth < 768 ? '95%' : 500}
      centered
      destroyOnClose
      // style={{
      //   maxWidth: '95vw',
      //   margin: '0 auto',
      // }}
      className="collectionsPopup"
      footer={
        <div className="collectionsPopup__footer">
          {/* Create New Collection Form */}
          {showCreateForm ? (
            <Form
              form={form}
              className="collectionsPopup__footer-Form"
              onFinish={handleCreateCollection}
            >
              <Form.Item name="name" rules={[{ required: true, message: t('nameRequired') }]}>
                <Input placeholder={t('collectionName')} disabled={creating} />
              </Form.Item>
              <Row gutter={5}>
                <Col span={16}>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={creating}
                      icon={<CheckOutlined />}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item>
                    <Button
                      onClick={() => {
                        setShowCreateForm(false)
                        form.resetFields()
                      }}
                      disabled={creating}
                      icon={<CloseOutlined />}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          ) : (
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              className="collectionsPopup__footer-btn"
              onClick={() => setShowCreateForm(true)}
              style={{
                width: '100%',
                fontSize:
                  typeof window !== 'undefined' && window.innerWidth < 768 ? '16px' : '14px',
              }}
            >
              {t('createNewCollection')}
            </Button>
          )}
        </div>
      }
    >
      <div>{t('description', { patternName: patternName || t('thisPattern') })}:</div>
      {/* Collections List */}
      {collections.length > 0 ? (
        <List
          loading={loading}
          className="collectionsPopup__items"
          dataSource={collections}
          renderItem={(collection) => (
            <List.Item
              style={{
                cursor: saving === collection.id ? 'not-allowed' : 'pointer',
                opacity: saving === collection.id ? 0.6 : 1,
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
                      fontWeight: 400
                    }}
                  >
                    {collection.name}
                  </span>
                }
                // description={
                //   <span
                //     style={{
                //       color: '#666',
                //       fontSize:
                //         typeof window !== 'undefined' && window.innerWidth < 768
                //           ? '14px'
                //           : '12px',
                //     }}
                //   >
                //     {collection.totalPatterns || 0} {t('patterns')}
                //   </span>
                // }
              />
            </List.Item>
          )}
        />
      ) : (
        <Empty description={t('noCollections')} image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </Modal>
  )
}

export default CollectionPopup
