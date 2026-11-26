'use client'
import { Button, Tooltip } from 'antd'
import { BookFilled, BookOutlined, HeartFilled, HeartOutlined } from '@ant-design/icons'
import { useTranslations } from 'next-intl'
import DetailHero from '@/app/components/detail-hero'
import { Pattern } from '@/app/lib/definitions'
import dynamic from 'next/dynamic'
import CommentSection from '@/app/components/comment/CommentSection'
import { useCallback, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { removePatternFromCollection } from '@/app/lib/service/collectionService'
import CollectionPopup from '@/app/components/collection-popup'
import { useRequireAuth } from '@/app/hooks/useRequireAuth'
import { existInCollection, checkIsPatternLiked } from '@/app/lib/service/freePatternService'
import { toggleLike } from '@/app/lib/service/interactionService'
import { ReportView } from '@/app/components/ReportView'

// Lazy load ViewImagesList component
const ViewImagesList = dynamic(
  () => import('@/app/components/view-image-list'),
  { ssr: false }, // Disable server-side rendering
)

const PatternDetail = ({ pattern }: { pattern: Pattern }) => {
  const t = useTranslations('FreePattern')
  const tDH = useTranslations('DetailHero')
  const { data: session } = useSession()
  const { requireAuth } = useRequireAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isInCollection, setIsInCollection] = useState(pattern?.in_collection || false)
  const [showCollectionPopup, setShowCollectionPopup] = useState(false)

  const [isLiked, setIsLiked] = useState(pattern?.is_liked || false)
  const [likeCount, setLikeCount] = useState(pattern?.likeCount || 0)
  const [likeLoading, setLikeLoading] = useState(false)
  const [viewCount, setViewCount] = useState(pattern?.viewCount || 0)

  useEffect(() => {
    if (pattern?.viewCount !== undefined) {
      setViewCount(pattern.viewCount)
    }
  }, [pattern?.viewCount])

  // Keep a stable reference so ReportView's effect does not re-run (and abort
  // its request) on every render.
  const handleViewCounted = useCallback(() => {
    setViewCount((prev) => prev + 1)
  }, [])

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

    if (!requireAuth('save_pattern')) {
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
    if (!requireAuth('like')) {
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

  const likeButton = (
    <Button
      size="large"
      shape="round"
      className="detail-btn detail-btn--ghost"
      loading={likeLoading}
      aria-pressed={isLiked}
      onClick={handleToggleLike}
      icon={isLiked ? <HeartFilled className="detail-btn__heart--on" /> : <HeartOutlined />}
    >
      {`${isLiked ? tDH('liked') : tDH('like')} (${likeCount})`}
    </Button>
  )

  return (
    <article className="detail-page">
      {pattern?.id && (
        <ReportView
          id={pattern.id.toString()}
          type="FREE_PATTERN"
          onViewCounted={handleViewCounted}
        />
      )}

      <DetailHero
        name={pattern.name}
        images={pattern.images}
        coverSrc={pattern.src}
        author={pattern.author}
        description={pattern.description}
        status={pattern.status}
        creator={{
          id: pattern.userId,
          name: pattern.username,
          avatar: pattern.userAvatar,
        }}
        viewCount={viewCount}
        note={t('note')}
        actions={
          <>
            <Button
              size="large"
              shape="round"
              className="detail-btn detail-btn--primary"
              loading={isLoading}
              aria-pressed={isInCollection}
              icon={isInCollection ? <BookFilled /> : <BookOutlined />}
              onClick={() => toggleBookmark(pattern?.id?.toString() || '')}
            >
              {isInCollection ? tDH('saved') : tDH('save')}
            </Button>
            {!session?.user ? (
              <Tooltip title={t('login_to_like')}>{likeButton}</Tooltip>
            ) : (
              likeButton
            )}
          </>
        }
      />

      <section className="detail-page__section">
        <h2 className="detail-page__title">{t('detail')}</h2>
        {/* ViewImagesList sẽ chỉ được render ở client side */}
        <ViewImagesList
          isPattern
          name="free-patterns"
          content={pattern?.content}
          images={pattern?.files}
        />
      </section>

      <CommentSection id={pattern?.id?.toString() || ''} type={'free-pattern'} />

      {/* Collection Popup */}
      <CollectionPopup
        isOpen={showCollectionPopup}
        onClose={() => setShowCollectionPopup(false)}
        patternId={pattern?.id?.toString() || ''}
        patternName={pattern?.name}
        onSuccess={handleSaveSuccess}
      />
    </article>
  )
}

export default PatternDetail
