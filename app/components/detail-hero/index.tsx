'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Avatar } from 'antd'
import {
  EyeOutlined,
  HeartOutlined,
  InfoCircleOutlined,
  UserOutlined,
} from '@ant-design/icons'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

import { FileUpload, TTranslationStatus } from '@/app/lib/definitions'
import { ROUTE_PATH } from '@/app/lib/constant'
import DownloadImage from '../custom-image'
import ShareButton from '../share-button'
import '../../ui/components/detail-hero.scss'

export interface DetailHeroProps {
  name: string
  images?: FileUpload[]
  coverSrc?: string
  author?: string
  description?: string
  status?: TTranslationStatus
  creator?: { id?: string; name?: string; avatar?: string }
  viewCount?: number
  likeCount?: number
  note?: string
  actions?: React.ReactNode
}

const DetailHero = ({
  name,
  images,
  coverSrc,
  author,
  description,
  status,
  creator,
  viewCount,
  likeCount,
  note,
  actions,
}: DetailHeroProps) => {
  const t = useTranslations('DetailHero')

  const list = useMemo(() => {
    const fileUrls = images?.map((img) => img.fileContent).filter(Boolean) || []
    if (fileUrls.length > 0) return fileUrls
    return coverSrc ? [coverSrc] : []
  }, [images, coverSrc])

  const resolveInitialIndex = useMemo(() => {
    if (!coverSrc || list.length === 0) return 0
    const idx = list.indexOf(coverSrc)
    return idx >= 0 ? idx : 0
  }, [list, coverSrc])

  const [activeIndex, setActiveIndex] = useState<number>(resolveInitialIndex)

  useEffect(() => {
    setActiveIndex(resolveInitialIndex)
  }, [resolveInitialIndex])

  const activeSrc = list[activeIndex] || coverSrc || ''
  const showStatus = status === 'SUCCESS' || status === 'PENDING'
  const showMeta =
    showStatus || typeof viewCount === 'number' || typeof likeCount === 'number'

  return (
    <>
      <div className="detail-hero">
        <div className="detail-hero__gallery">
          <div className="detail-hero__frame">
            <DownloadImage src={activeSrc} alt={name} width="100%" height="100%" />
          </div>

          {list.length > 1 && (
            <ul className="detail-hero__thumbs">
              {list.map((imgSrc, i) => (
                <li key={`${imgSrc}_${i}`}>
                  <button
                    type="button"
                    aria-label={t('photo', { index: i + 1, total: list.length })}
                    aria-current={i === activeIndex ? 'true' : undefined}
                    onClick={() => setActiveIndex(i)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imgSrc} loading="lazy" alt="" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <section className="detail-hero__band" aria-labelledby="detail-hero-title">
          {showMeta && (
            <div className="detail-hero__meta">
              {showStatus && (
                <span
                  className={`detail-hero__status detail-hero__status--${status.toLowerCase()}`}
                >
                  {status === 'SUCCESS' ? t('status_SUCCESS') : t('status_PENDING')}
                </span>
              )}
              {typeof viewCount === 'number' && (
                <span className="detail-hero__meta-item">
                  <EyeOutlined />
                  <span>{t('views', { count: viewCount })}</span>
                </span>
              )}
              {typeof likeCount === 'number' && (
                <span className="detail-hero__meta-item">
                  <HeartOutlined />
                  <span>{t('likes', { count: likeCount })}</span>
                </span>
              )}
            </div>
          )}

          <h1 id="detail-hero-title" className="detail-hero__title">
            {name}
          </h1>

          {author && (
            <p className="detail-hero__author">
              {t('author')}: <span>{author}</span>
            </p>
          )}

          {creator?.name && (
            <Link
              href={`${ROUTE_PATH.PROFILE}/${creator.id || ''}`}
              className="detail-hero__creator"
            >
              <Avatar size={28} src={creator.avatar} icon={<UserOutlined />} />
              <span>
                {t('shared_by')} <strong>{creator.name}</strong>
              </span>
            </Link>
          )}

          {description && <p className="detail-hero__desc">{description}</p>}

          {actions && <div className="detail-hero__actions">{actions}</div>}

          {note && (
            <p className="detail-hero__note">
              <InfoCircleOutlined />
              <span>{note}</span>
            </p>
          )}
        </section>
      </div>
      <ShareButton />
    </>
  )
}

export default DetailHero
