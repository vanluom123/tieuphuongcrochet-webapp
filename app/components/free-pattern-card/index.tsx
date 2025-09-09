'use client'

import { Avatar, Button, Card, Flex, Skeleton, Tag, Tooltip } from 'antd'
import { DeleteFilled, EditFilled, UserOutlined } from '@ant-design/icons'
import React, { useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { ROUTE_PATH, TRANSLATION_STATUS } from '@/app/lib/constant'
import { Pattern } from '@/app/lib/definitions'
import { getStatusColor } from '@/app/lib/utils'
import CustomNextImage from '../next-image'
import { useSession } from 'next-auth/react'
import { removePatternFromCollection } from '@/app/lib/service/collectionService'
import whiteBookmark from '@/public/white-bookmark.png'
import primaryBookmark from '@/public/primary-bookmark.png'
import { getIconTag } from '../free-pattern-status'
import CollectionPopup from '../collection-popup'
import '../../ui/components/freePatternCard.scss'

interface FreePatternCardProps {
  width?: string | number
  pattern: Pattern
  onReadDetail?: () => void
  loading?: boolean
  isShowActions?: boolean
  onDelete?: () => void
  onEdit?: () => void
  onUnbookmark?: () => void
}

const FreePatternCard = ({
  pattern = { name: '', author: '', src: '' },
  width,
  onReadDetail,
  loading,
  isShowActions = false,
  onDelete,
  onEdit,
  onUnbookmark,
}: FreePatternCardProps) => {
  const { Meta } = Card
  const { name, src, status, username, userAvatar, userId, id, in_collection } = pattern
  const t = useTranslations('FreePattern')
  const profileT = useTranslations('Profile')
  const { data: session } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isInCollection, setIsInCollection] = useState(in_collection || false)
  const [showCollectionPopup, setShowCollectionPopup] = useState(false)

  // Sync state when prop in_collection changes from server
  React.useEffect(() => {
    setIsInCollection(!!in_collection)
  }, [in_collection])

  const handleToggleBookmark = async (patternId: string) => {
    if (!patternId) return

    // Check if user is not logged in
    if (!session?.user) {
      router.push(ROUTE_PATH.LOGIN)
      return
    }

    if (isInCollection) {
      // If already in collection, remove from collection
      setIsLoading(true)
      try {
        await removePatternFromCollection(patternId)
        setIsInCollection(false)

        // Call the onUnbookmark callback if provided
        if (onUnbookmark) {
          onUnbookmark()
        }
      } catch (error) {
        console.error('Error removing from collection:', error)
      } finally {
        setIsLoading(false)
      }
    } else {
      // If not in collection, show popup to select collection
      setShowCollectionPopup(true)
    }
  }

  // Handling when save successfully from popup
  const handleSaveSuccess = () => {
    setIsInCollection(true)
  }

  return (
    <>
      <Card
        loading={loading}
        hoverable
        className="free-pattern-card card-item"
        style={{ width: width || '100%' }}
        styles={{
          body: {
            overflow: 'hidden',
          },
        }}
        cover={
          <>
            {src && loading ? (
              <Skeleton.Image active />
            ) : (
              <div className="card-cover-custom" style={{ position: 'relative' }}>
                <div className="mark-dark"></div>

                <Flex className="action-buttons" vertical>
                  {/* Bookmark button remains unchanged */}
                  {userId && (
                    <Tooltip
                      title={
                        !session?.user
                          ? t('login_to_save')
                          : isInCollection
                            ? t('remove_from_collection')
                            : t('save')
                      }
                    >
                      <Button
                        type="text"
                        loading={isLoading}
                        disabled={isLoading}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleToggleBookmark(id?.toString() || '')
                        }}
                        className="action-button"
                      >
                        <Image
                          width={20}
                          height={20}
                          src={isInCollection ? primaryBookmark : whiteBookmark}
                          alt="bookmark"
                          key={`bookmark-${id}-${isInCollection ? 'filled' : 'empty'}`}
                        />
                      </Button>
                    </Tooltip>
                  )}
                  {isShowActions && (
                    <>
                      <Tooltip title={profileT('patterns.edit')}>
                        <Button
                          type="text"
                          icon={<EditFilled />}
                          onClick={(e) => {
                            e.stopPropagation()
                            if (onEdit) onEdit()
                          }}
                          className="action-button"
                        />
                      </Tooltip>
                      <Tooltip title={profileT('patterns.delete')}>
                        <Button
                          type="text"
                          icon={<DeleteFilled />}
                          onClick={(e) => {
                            e.stopPropagation()
                            if (onDelete) onDelete()
                          }}
                          className="action-button"
                        />
                      </Tooltip>
                    </>
                  )}
                </Flex>
                <CustomNextImage src={src} alt={name} />
              </div>
            )}
          </>
        }
        onClick={onReadDetail}
      >
        <Skeleton loading={!name} active>
          {name && (
            <Meta
              title={
                <span tabIndex={1} className="card-title" onClick={onReadDetail}>
                  {status && status !== TRANSLATION_STATUS.NONE && (
                    <Tag
                      className="status-tag"
                      color={getStatusColor(status)}
                      icon={getIconTag(status)}
                    />
                  )}
                  {name}
                </span>
              }
              description={
                <Flex justify="space-between" align="center">
                  <div className="creator">
                    {userAvatar ? <Avatar size={20} src={userAvatar} /> : <UserOutlined />}
                    <Link
                      href={`${ROUTE_PATH.PROFILE}/${userId}`}
                      onClick={(e) => e.stopPropagation()}
                      className="creator-link"
                    >
                      &nbsp;{username}
                    </Link>
                  </div>
                </Flex>
              }
            />
          )}
        </Skeleton>
      </Card>

      {/* Collection Popup */}
      <CollectionPopup
        isOpen={showCollectionPopup}
        onClose={() => setShowCollectionPopup(false)}
        patternId={id?.toString() || ''}
        patternName={name}
        onSuccess={handleSaveSuccess}
      />
    </>
  )
}

export default FreePatternCard
