'use client'

import { Avatar, Button, Card, Flex, Skeleton, Tag, Tooltip } from 'antd'
import {
  DeleteFilled,
  EditFilled,
  HeartFilled,
  HeartOutlined,
  UserOutlined,
} from '@ant-design/icons'
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
import { toggleLike } from '@/app/lib/service/interactionService'
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
  const {
    name,
    src,
    status,
    username,
    userAvatar,
    userId,
    id,
    in_collection,
    likeCount: initialLikeCount,
    is_liked: initialIsLiked,
  } = pattern
  const t = useTranslations('FreePattern')
  const profileT = useTranslations('Profile')
  const { data: session } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isInCollection, setIsInCollection] = useState(in_collection || false)
  const [showCollectionPopup, setShowCollectionPopup] = useState(false)

  const [isLiked, setIsLiked] = useState(initialIsLiked || false)
  const [likeCount, setLikeCount] = useState(initialLikeCount || 0)
  const [likeLoading, setLikeLoading] = useState(false)

  // Sync state when prop in_collection changes from server
  React.useEffect(() => {
    setIsInCollection(!!in_collection)
  }, [in_collection])

  // Sync state when prop is_liked / likeCount changes from server
  React.useEffect(() => {
    setIsLiked(!!initialIsLiked)
    setLikeCount(initialLikeCount || 0)
  }, [initialIsLiked, initialLikeCount])

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

  const handleToggleLike = async (e: React.MouseEvent) => {
    e.stopPropagation()

    if (!session?.user) {
      router.push(ROUTE_PATH.LOGIN)
      return
    }

    const patternId = id?.toString() || ''
    if (!patternId) return

    setLikeLoading(true)

    // Optimistic update
    const wasLiked = isLiked
    const optimisticIsLiked = !wasLiked
    setIsLiked(optimisticIsLiked)
    setLikeCount((prev) => (optimisticIsLiked ? prev + 1 : prev - 1))

    try {
      const newIsLiked = await toggleLike(patternId, 'FREE_PATTERN')
      // Sync with server response
      if (newIsLiked !== optimisticIsLiked) {
        // Server rejected the toggle, revert count
        setIsLiked(newIsLiked)
        setLikeCount((prev) => (wasLiked ? prev + 1 : prev - 1))
      }
      // If server matches optimistic, count is already correct
      // but ensure isLiked is synced
      setIsLiked(newIsLiked)
    } catch (error) {
      // Revert optimistic update on error
      setIsLiked(wasLiked)
      setLikeCount((prev) => (wasLiked ? prev + 1 : prev - 1))
      console.error('Error toggling like:', error)
    } finally {
      setLikeLoading(false)
    }
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
                  <Flex align="center" gap={2} onClick={(e) => e.stopPropagation()}>
                    <Tooltip
                      title={
                        !session?.user
                          ? t('login_to_like')
                          : isLiked
                            ? t('unlike')
                            : t('like')
                      }
                    >
                      <Button
                        type="text"
                        size="small"
                        loading={likeLoading}
                        disabled={likeLoading}
                        onClick={handleToggleLike}
                        className={`like-button ${isLiked ? 'liked' : ''}`}
                        icon={
                          isLiked ? (
                            <HeartFilled style={{ color: '#ff4d4f', fontSize: 14 }} />
                          ) : (
                            <HeartOutlined style={{ fontSize: 14 }} />
                          )
                        }
                      />
                    </Tooltip>
                    {likeCount > 0 && (
                      <span style={{ fontSize: 12, color: '#666', lineHeight: 1 }}>{likeCount}</span>
                    )}
                  </Flex>
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