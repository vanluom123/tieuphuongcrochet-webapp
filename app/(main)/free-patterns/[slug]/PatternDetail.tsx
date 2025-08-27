'use client'
import { Divider, Flex, FloatButton, Tooltip } from 'antd'
import { useTranslations } from 'next-intl'
import IntroductionCard from '@/app/components/introduction-card'
import ViewDetailWrapper from '@/app/components/view-detail-wrapper'
import { Pattern } from '@/app/lib/definitions'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import primaryBookmark from '@/public/primary-bookmark.png'
import bookmark from '@/public/bookmark.png'
import CommentSection from '@/app/components/comment/CommentSection'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { removePatternFromCollection } from '@/app/lib/service/collectionService'
import CollectionPopup from '@/app/components/collection-popup'
import { ROUTE_PATH } from '@/app/lib/constant'

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

  // Hàm xử lý bookmark
  const toggleBookmark = async (patternId: string) => {
    if (!patternId) return

    // Kiểm tra nếu user chưa đăng nhập
    if (!session?.user) {
      router.push(ROUTE_PATH.LOGIN)
      return
    }

    if (isInCollection) {
      // Nếu đã trong collection, xóa khỏi collection
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
      // Nếu chưa trong collection, hiển thị popup để chọn collection
      setShowCollectionPopup(true)
    }
  }

  // Xử lý khi lưu thành công từ popup
  const handleSaveSuccess = () => {
    setIsInCollection(true)
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
          style={{ zIndex: 10 }}
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
