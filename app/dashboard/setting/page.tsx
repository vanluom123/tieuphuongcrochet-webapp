'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Button, Popconfirm, Spin, Tag, notification } from 'antd'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { useTranslations } from 'next-intl'
import BannerItem from '@/app/components/cover-page/BannerItem'
import { Banner, DataType, IBannerType } from '@/app/lib/definitions'
import { createUpdateBanners, fetchBanners, fetchBannerTypes } from '@/app/lib/service/settingService'
import { uid } from '@/app/lib/utils'
import BannerForm, { EdittingBanner, initialEdittingBanner } from './BannerForm'
import BannerType from './BannerType'
import SubscriptionPricingForm from './SubscriptionPricingForm'
import VideoPopupListSettings from './VideoPopupListSettings'
import styles from './SettingPage.module.scss'

type SettingSection = 'banners' | 'video-popup' | 'pricing' | 'banner-types'

const Setting = () => {
  const t = useTranslations('VideoPopupList')
  const [activeSection, setActiveSection] = useState<SettingSection>('banners')
  const [isUpdatedBList, setIsUpdatedBList] = useState(false)
  const [showBannerForm, setShowBannerForm] = useState(false)
  const [savingBanners, setSavingBanners] = useState(false)
  const [edittingBanner, setEdittingBanner] = useState<EdittingBanner>(initialEdittingBanner)
  const [bannersList, setBannersList] = useState<Banner[]>([])
  const [loading, setLoading] = useState(false)
  const [bannerTypes, setBannerTypes] = useState<DataType[]>([])
  const bannerRef = useRef<Banner[]>([])

  useEffect(() => {
    setLoading(true)
    Promise.all([fetchBannerTypes(), fetchBanners()])
      .then(([types, banners]) => {
        setBannerTypes(types)
        setBannersList(banners)
        bannerRef.current = banners
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const handleRefreshBannerTypes = async () => {
    const types = await fetchBannerTypes()
    setBannerTypes(types)
  }

  const handleRefreshBanners = async () => {
    const banners = await fetchBanners()
    setBannersList(banners)
    bannerRef.current = banners
  }

  const onSaveBanners = async () => {
    if (bannersList.length === 0) {
      notification.warning({ message: 'Phải có ít nhất 1 banner' })
      return
    }
    setSavingBanners(true)
    try {
      await createUpdateBanners(bannersList)
      bannerRef.current = bannersList
      setIsUpdatedBList(false)
    } finally {
      setSavingBanners(false)
    }
  }

  const onDiscardBanners = () => {
    setBannersList(bannerRef.current)
    setIsUpdatedBList(false)
    setEdittingBanner(initialEdittingBanner)
    setShowBannerForm(false)
  }

  const onEditBanner = (banner: Banner, index: number) => {
    setEdittingBanner({
      isEditting: true,
      index,
      image: [
        {
          fileContent: banner.fileContent,
          fileName: banner.fileName,
          url: banner.fileContent,
          name: banner.fileName,
          uid: banner.id || uid(),
        },
      ],
      banner,
    })
    setShowBannerForm(true)
  }

  const onDeleteBanner = (index: number) => {
    setBannersList((prev) => prev.filter((_, i) => i !== index))
    setIsUpdatedBList(true)
  }

  const getBannerTypeName = (id?: string, bannerType?: IBannerType) => {
    return id ? bannerTypes.find((bt) => bt.key === id)?.name : bannerType?.name
  }

  const navItems: { key: SettingSection; label: string; count?: number }[] = [
    { key: 'banners', label: 'Banner trang chủ', count: bannersList.length },
    { key: 'video-popup', label: t('title') },
    { key: 'pricing', label: 'Gói thành viên' },
    { key: 'banner-types', label: 'Loại banner', count: bannerTypes.length },
  ]

  const sectionMeta: Record<SettingSection, { title: string; subtitle: string }> = {
    banners: {
      title: 'Banner trang chủ',
      subtitle: 'Sắp xếp nội dung hiển thị ở đầu trang và kiểm tra trước khi xuất bản.',
    },
    'video-popup': {
      title: t('title'),
      subtitle: 'Cấu hình danh sách video giới thiệu hiển thị tự động cho khách truy cập.',
    },
    pricing: {
      title: 'Gói thành viên',
      subtitle: 'Thiết lập mức giá thanh toán theo tháng và theo năm cho tài khoản Premium.',
    },
    'banner-types': {
      title: 'Loại banner',
      subtitle: 'Quản lý các vị trí và phân loại banner đang được hỗ trợ trên hệ thống.',
    },
  }

  const currentMeta = sectionMeta[activeSection]
  const isEditorVisible = showBannerForm || edittingBanner.isEditting

  return (
    <div className={styles.settingPage}>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Cài đặt cửa hàng</h1>
        <p className={styles.pageSubtitle}>
          Quản lý banner trang chủ, video popup, giá gói thành viên và danh mục banner.
        </p>
      </header>

      <div className={styles.workspace}>
        <nav className={styles.navRail} aria-label="Danh mục cài đặt">
          {navItems.map((item) => {
            const isActive = activeSection === item.key
            return (
              <button
                key={item.key}
                type="button"
                aria-current={isActive ? 'page' : undefined}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                onClick={() => setActiveSection(item.key)}
              >
                <span>{item.label}</span>
                {typeof item.count === 'number' ? (
                  <span className={styles.navBadge}>{item.count}</span>
                ) : null}
              </button>
            )
          })}
        </nav>

        <section className={styles.panel} aria-label={currentMeta.title}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>{currentMeta.title}</h2>
              <p className={styles.sectionSubtitle}>{currentMeta.subtitle}</p>
            </div>
            {activeSection === 'banners' && !isEditorVisible ? (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setShowBannerForm(true)}
              >
                Thêm banner
              </Button>
            ) : null}
          </div>

          {activeSection === 'banners' ? (
            <div>
              {isEditorVisible ? (
                <div className={styles.bannerEditor}>
                  <div className={styles.bannerEditorHeader}>
                    <h3 className={styles.bannerEditorTitle}>
                      {edittingBanner.isEditting ? 'Chỉnh sửa banner' : 'Thêm banner mới'}
                    </h3>
                  </div>
                  <BannerForm
                    bannerTypes={bannerTypes}
                    bannersList={bannersList}
                    edittingBanner={edittingBanner}
                    setEdittingBanner={setEdittingBanner}
                    SetBannersList={setBannersList}
                    setIsUpdatedBList={setIsUpdatedBList}
                    onRefresh={handleRefreshBanners}
                    onClose={() => setShowBannerForm(false)}
                  />
                </div>
              ) : null}

              <Spin spinning={loading}>
                {bannersList.length === 0 ? (
                  <div className={styles.emptyState}>
                    Chưa có banner nào. Nhấn &ldquo;Thêm banner&rdquo; để tạo banner đầu tiên.
                  </div>
                ) : (
                  <div className={styles.bannerList}>
                    {bannersList.map((item, index) => {
                      const typeName = getBannerTypeName(item.bannerTypeId, item.bannerType)
                      return (
                        <article className={styles.bannerRow} key={item.id ?? `banner-${index}`}>
                          <div className={styles.bannerPreview}>
                            <BannerItem banner={item} classNames="banner-item__preview" />
                          </div>

                          <div className={styles.bannerInfo}>
                            <div className={styles.bannerTitleRow}>
                              <h3 className={styles.bannerTitle}>
                                {item.title || `Banner #${index + 1}`}
                              </h3>
                              {typeName ? <Tag>{typeName}</Tag> : null}
                              <Tag color={item.active ? 'green' : 'default'}>
                                {item.active ? 'Đang hiển thị' : 'Đang ẩn'}
                              </Tag>
                            </div>
                            {item.content ? (
                              <p className={styles.bannerContent}>{item.content}</p>
                            ) : null}
                            {item.url ? (
                              <span className={styles.bannerUrl} title={item.url}>
                                {item.url}
                              </span>
                            ) : null}
                          </div>

                          <div className={styles.bannerActions}>
                            <Button
                              icon={<EditOutlined />}
                              aria-label="Sửa banner"
                              title="Sửa"
                              disabled={edittingBanner.isEditting}
                              onClick={() => onEditBanner(item, index)}
                            />
                            <Popconfirm
                              title="Xóa banner này khỏi danh sách?"
                              okText="Xóa"
                              cancelText="Hủy"
                              onConfirm={() => onDeleteBanner(index)}
                            >
                              <Button
                                danger
                                icon={<DeleteOutlined />}
                                aria-label="Xóa banner"
                                title="Xóa"
                                disabled={edittingBanner.isEditting}
                              />
                            </Popconfirm>
                          </div>
                        </article>
                      )
                    })}
                  </div>
                )}
              </Spin>

              {isUpdatedBList ? (
                <div className={styles.saveBar} role="status" aria-live="polite">
                  <span className={styles.saveBarText}>
                    Bạn có thay đổi chưa lưu ở danh sách banner.
                  </span>
                  <div className={styles.bannerActions}>
                    <Button disabled={savingBanners} onClick={onDiscardBanners}>
                      Hủy thay đổi
                    </Button>
                    <Button
                      type="primary"
                      loading={savingBanners}
                      disabled={edittingBanner.isEditting}
                      onClick={onSaveBanners}
                    >
                      Lưu thay đổi
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          {activeSection === 'video-popup' ? <VideoPopupListSettings /> : null}

          {activeSection === 'pricing' ? <SubscriptionPricingForm /> : null}

          {activeSection === 'banner-types' ? (
            <BannerType
              bannerTypes={bannerTypes}
              onRefresh={handleRefreshBannerTypes}
              loading={loading}
            />
          ) : null}
        </section>
      </div>
    </div>
  )
}

export default Setting
