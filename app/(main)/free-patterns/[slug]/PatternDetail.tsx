'use client'
import { Divider, Flex, FloatButton, Tooltip } from 'antd'
import { HeartFilled, HeartOutlined } from '@ant-design/icons'
import { useTranslations } from 'next-intl'
import IntroductionCard from '@/app/components/introduction-card'
import ViewDetailWrapper from '@/app/components/view-detail-wrapper'
import { Pattern } from '@/app/lib/definitions'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import primaryBookmark from '@/public/primary-bookmark.png'
import bookmark from '@/public/bookmark.png'
import CommentSection from '@/app/components/comment/CommentSection'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { removePatternFromCollection } from '@/app/lib/service/collectionService'
import CollectionPopup from '@/app/components/collection-popup'
import { ROUTE_PATH } from '@/app/lib/constant'
import { existInCollection, checkIsPatternLiked } from '@/app/lib/service/freePatternService'
import { toggleLike } from '@/app/lib/service/interactionService'

// Lazy load ViewImagesList component
const ViewImagesList = dynamic(
  () => import('@/app/components/view-image-list'),
  { ssr: false }, // Disable server-side rendering
)

const PatternDetail = ({ pattern }: { pattern: Pattern }) => {
  const t = useTranslations('FreePattern')
  const { data: session } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isInCollection, setIsInCollection] = useState(pattern?.in_collection || false)
  const [showCollectionPopup, setShowCollectionPopup] = useState(false)

  const [isLiked, setIsLiked] = useState(pattern?.is_liked || false)
  const [likeCount, setLikeCount] = useState(pattern?.likeCount || 0)
  const [likeLoading, setLikeLoading] = useState(false)

  useEffect(() => {
    const fetchUserStatus = async () => {
      if (!pattern?.id) return

      const [collectionRes, likedRes] = await Promise.all([
        existInCollection(pattern.id.toString()),
        checkIsPatternLiked(pattern.id.toString()).catch(() => ({ data: false })),
      ])
      setIsInCollection(collectionRes.data || false)
      setIsLiked(likedRes.data || false)
    }

    if (session?.user && pattern?.id) {
      fetchUserStatus()
    }
  }, [pattern?.id, session?.user?.id])

  const toggleBookmark = async (patternId: string) => {
    if (!patternId) return

    if (!session?.user) {
      router.push(ROUTE_PATH.LOGIN)
      return
    }

    if (isInCollection) {
      setIsLoading(true)
      try {
        await removePatternFromCollection(patternId)
        setIsInCollection(false)
      } catch (error) {
        console.error('Error removing from collection:', error)
      } finally {
        setIsLoading(false)
      }
    } else {
      setShowCollectionPopup(true)
    }
  }

  const handleSaveSuccess = () => {
    setIsInCollection(true)
  }

  const handleToggleLike = async () => {
    if (!session?.user) {
      router.push(ROUTE_PATH.LOGIN)
      return
    }

    const patternId = pattern?.id?.toString() || ''
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
    <ViewDetailWrapper isShowAlert alertMessage={t('note')} alertType="warning">
      {/* Introducing the free pattern */}
      <div className="pattern-header">
        <Flex vertical gap="small">
          <IntroductionCard isPreviewAvatar data={pattern} isShowThumbnail />
        </Flex>
      </div>

      <Divider />

      {/* ViewImagesList sẽ chỉ được render ở client side */}
      <ViewImagesList
        isPattern
        name="free-patterns"
        contentTitle={t('detail')}
        content={pattern?.content}
        images={pattern?.files}
      />

      {/* Floating like button with count */}
      <Tooltip
        title={
          !session?.user
            ? t('login_to_like')
            : isLiked
              ? t('unlike')
              : t('like')
        }
      >
        <FloatButton
          shape="circle"
          className="custom-like-button"
          onClick={handleToggleLike}
          icon={
            likeLoading ? (
              <span
                className="like-loading-spinner"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 20,
                  height: 20,
                }}
              >
                <svg width="20" height="20" viewBox="0 0 50 50">
                  <circle
                    cx="25"
                    cy="25"
                    r="20"
                    fill="none"
                    stroke="#999"
                    strokeWidth="5"
                    strokeDasharray="31.415, 31.415"
                    transform="rotate(72.0001 25 25)"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="0 25 25"
                      to="360 25 25"
                      dur="1s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </svg>
              </span>
            ) : isLiked ? (
              <HeartFilled style={{ color: '#ff4d4f' }} />
            ) : (
              <HeartOutlined />
            )
          }
          style={{ right: 24, bottom: 240, zIndex: 10 }}
        />
      </Tooltip>

      {/* Like count text */}
      {likeCount > 0 && (
        <span
          style={{
            position: 'fixed',
            right: 28,
            bottom: 275,
            fontSize: 12,
            color: '#666',
            zIndex: 10,
            lineHeight: 1,
          }}
        >
          {likeCount}
        </span>
      )}

      {/* Custom bookmark button for both desktop and mobile */}
      <Tooltip title={isInCollection ? t('remove_from_collection') : t('save')}>
        <FloatButton
          shape="circle"
          className="custom-bookmark-button"
          onClick={() => toggleBookmark(pattern?.id?.toString() || '')}
          icon={
            isLoading ? (
              <span
                className="bookmark-loading-spinner"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 20,
                  height: 20,
                }}
              >
                <svg width="20" height="20" viewBox="0 0 50 50">
                  <circle
                    cx="25"
                    cy="25"
                    r="20"
                    fill="none"
                    stroke="#999"
                    strokeWidth="5"
                    strokeDasharray="31.415, 31.415"
                    transform="rotate(72.0001 25 25)"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="0 25 25"
                      to="360 25 25"
                      dur="1s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </svg>
              </span>
            ) : (
              <Image
                width={20}
                height={20}
                src={isInCollection ? primaryBookmark : bookmark}
                alt="bookmark"
                priority={true}
              />
            )
          }
          style={{ right: 24, bottom: 190, zIndex: 10 }}
        />
      </Tooltip>

      <CommentSection id={pattern?.id?.toString() || ''} type={'free-pattern'} />

      {/* Collection Popup */}
      <CollectionPopup
        isOpen={showCollectionPopup}
        onClose={() => setShowCollectionPopup(false)}
        patternId={pattern?.id?.toString() || ''}
        patternName={pattern?.name}
        onSuccess={handleSaveSuccess}
      />
    </ViewDetailWrapper>
  )
}

export default PatternDetail