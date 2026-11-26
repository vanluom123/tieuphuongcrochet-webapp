'use client'
import { Button } from 'antd'
import { MessageOutlined } from '@ant-design/icons'
import { useTranslations } from 'next-intl'
import dynamic from 'next/dynamic'

import DetailHero from '@/app/components/detail-hero'
import FormattedCurrency from '@/app/components/forrmat-currency'
import CommentSection from '@/app/components/comment/CommentSection'
import { SOCIAL_LINKS } from '@/app/lib/constant'
import { Product } from '@/app/lib/definitions'

// Lazy load ViewImagesList component
const ViewImagesList = dynamic(
  () => import('@/app/components/view-image-list'),
  { ssr: false }, // Disable server-side rendering
)

export default function ProductDetail({ product }: { product: Product }) {
  const t = useTranslations('Shop')
  const tDH = useTranslations('DetailHero')

  return (
    <article className="detail-page">
      <DetailHero
        name={product.name}
        images={product.images}
        coverSrc={product.src}
        author={product.author}
        description={product.description}
        viewCount={product.viewCount}
        likeCount={product.likeCount}
        note={t('note')}
        actions={
          <>
            <div className="detail-hero__price">
              {product.price ? (
                <FormattedCurrency
                  price={product.price}
                  currency_code={product.currency_code}
                />
              ) : (
                tDH('price_contact')
              )}
            </div>
            <Button
              href={product.link || SOCIAL_LINKS.FACEBOOK}
              target="_blank"
              rel="noopener noreferrer"
              size="large"
              shape="round"
              className="detail-btn detail-btn--primary"
              icon={<MessageOutlined />}
            >
              {tDH('order')}
            </Button>
          </>
        }
      />

      <section className="detail-page__section">
        <h2 className="detail-page__title">{t('detail')}</h2>
        <ViewImagesList
          images={product?.images}
          name="product"
          content={product?.content}
        />
      </section>

      <CommentSection id={product?.id?.toString() || ''} type={'product'} />
    </article>
  )
}
