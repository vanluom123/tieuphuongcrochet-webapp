import { JsonLd } from 'react-schemaorg'
import { WebPage } from 'schema-dts'
import { Metadata } from 'next'

import FreePatterns from './FreePatterns'
import { getTranslations } from 'next-intl/server'
import { ROUTE_PATH } from '@/app/lib/constant'
import { fetchCategories } from '@/app/lib/service/categoryService'
import { fetchFreePatterns } from '@/app/lib/service/freePatternService'
import { Category, DataType, FileUpload, initialListParams } from '@/app/lib/definitions'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('FreePattern')
  return {
    title: t('title'),
    description: t('description'),

    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${process.env.NEXT_PUBLIC_URL}${ROUTE_PATH.FREEPATTERNS}`,
      type: 'website',
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_URL}/opengraph-image.jpg`,
          width: 1200,
          height: 630,
          alt: t('title'),
        },
      ],
    },
    keywords: [
      'Chart móc len miễn phí',
      'Web chart miễn phí',
      t('title'),
      t('Keywords.free_patterns'),
      t('Keywords.sewing_patterns'),
      t('Keywords.craft_patterns'),
      'downloadable patterns',
      'free sewing templates',
      'DIY patterns',
      'free patterns',
      'free sewing patterns',
      'free sewing templates',
      'free sewing patterns',
      'free sewing templates',
      'free sewing patterns',
      'free sewing templates',
      'free sewing patterns',
    ],
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_URL}${ROUTE_PATH.FREEPATTERNS}`,
    },
    robots: {
      index: true,
      follow: true,
    }, // Ensure the page is indexable
  }
}

async function getFreePatterns() {
  const { data, totalRecords } = await fetchFreePatterns(initialListParams, { revalidate: 0 })
  return { data, totalRecords }
}

async function getCategories() {
  return await fetchCategories()
}

const Page = async () => {
  const [freePatterns, categories] = await Promise.all([getFreePatterns(), getCategories()])

  const t = await getTranslations()

  return (
    <>
      <JsonLd<WebPage>
        item={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: t('FreePattern.title'),
          description: t('FreePattern.description'),
          url: `${process.env.NEXT_PUBLIC_URL}${ROUTE_PATH.FREEPATTERNS}`,
          breadcrumb: {
            '@type': 'BreadcrumbList',
            name: t('FreePattern.title'),
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: t('MenuNav.home'),
                item: process.env.NEXT_PUBLIC_URL,
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: t('MenuNav.freePattern'),
                item: `${process.env.NEXT_PUBLIC_URL}${ROUTE_PATH.FREEPATTERNS}`,
              },
            ],
          },
          // huộc tính phù hợp hơn để chỉ định các phần tử trong bộ sưu tập CollectionPage là type phù hợp hơn vì:
          hasPart: freePatterns.data.map((pattern: DataType) => ({
            '@type': 'CreativeWork',
            name: pattern.name,
            image: pattern.images?.map((image: FileUpload) => image.fileContent),
            description: pattern.description,
            url: `${process.env.NEXT_PUBLIC_URL}${ROUTE_PATH.FREEPATTERNS}/${pattern.key}`,
          })),
        }}
      />
      <FreePatterns
        initialData={{
          loading: false,
          data: freePatterns.data,
          totalRecord: freePatterns.totalRecords,
        }}
        categories={categories as Category[]}
      />
    </>
  )
}

export default Page
