'use client'

import { useMemo, useState } from 'react'
import {
  BookOutlined,
  DownOutlined,
  ExportOutlined,
  ShoppingOutlined,
} from '@ant-design/icons'
import styles from './crochetSymbolsGuide.module.scss'

type SymbolCategory = 'basic' | 'shaping' | 'notation'
type FilterKey = 'all' | SymbolCategory

interface CrochetSymbolItem {
  code: string
  vi: string
  en: string
  category: SymbolCategory
}

const SUPPLIES_URL = 'https://mycollection.shop/tiemlentieuconuong'

const CROCHET_SYMBOLS: CrochetSymbolItem[] = [
  {
    code: 'MR',
    vi: 'Vòng tròn ma thuật',
    en: 'Magic Ring',
    category: 'basic',
  },
  {
    code: 'X / sc',
    vi: 'Mũi đơn',
    en: 'Single crochet',
    category: 'basic',
  },
  {
    code: 'V / inc',
    vi: '2 mũi đơn chung chân',
    en: 'Increase',
    category: 'shaping',
  },
  {
    code: 'W',
    vi: '3 mũi đơn chung chân',
    en: 'Triple increase',
    category: 'shaping',
  },
  {
    code: 'A / dec',
    vi: 'Giảm mũi (2 mũi đơn chụm đầu)',
    en: 'Decrease',
    category: 'shaping',
  },
  {
    code: 'Ch',
    vi: 'Mũi bính',
    en: 'Chain stitch',
    category: 'basic',
  },
  {
    code: 'S / sl / slst',
    vi: 'Mũi trượt',
    en: 'Slip stitch',
    category: 'basic',
  },
  {
    code: 'T / hdc',
    vi: 'Mũi nửa kép',
    en: 'Half double crochet',
    category: 'basic',
  },
  {
    code: 'F / dc',
    vi: 'Mũi kép đơn',
    en: 'Double crochet',
    category: 'basic',
  },
  {
    code: 'E / tr',
    vi: 'Mũi kép đôi',
    en: 'Treble crochet',
    category: 'basic',
  },
  {
    code: 'FLO',
    vi: 'Móc vào cạnh trước của mũi',
    en: 'Front loop only',
    category: 'shaping',
  },
  {
    code: 'BLO',
    vi: 'Móc vào cạnh sau của mũi',
    en: 'Back loop only',
    category: 'shaping',
  },
  {
    code: 'K',
    vi: 'Bỏ qua 1 mũi',
    en: 'Skip stitch',
    category: 'shaping',
  },
  {
    code: '[...]',
    vi: 'Số mũi trong 1 vòng',
    en: 'Number of stitches in one round',
    category: 'notation',
  },
  {
    code: 'R',
    vi: 'Vòng',
    en: 'Round',
    category: 'notation',
  },
]

const FILTER_OPTIONS: Array<{ key: FilterKey; label: string }> = [
  { key: 'all', label: 'Tất cả' },
  { key: 'basic', label: 'Mũi cơ bản' },
  { key: 'shaping', label: 'Tăng, giảm & biến thể' },
  { key: 'notation', label: 'Đọc chart' },
]

interface CrochetSymbolsGuideProps {
  defaultOpen?: boolean
}

const CrochetSymbolsGuide = ({ defaultOpen = true }: CrochetSymbolsGuideProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all')

  const categoryCounts = useMemo(() => {
    const counts: Record<FilterKey, number> = {
      all: CROCHET_SYMBOLS.length,
      basic: 0,
      shaping: 0,
      notation: 0,
    }
    for (const item of CROCHET_SYMBOLS) {
      counts[item.category] += 1
    }
    return counts
  }, [])

  const filteredSymbols = useMemo(() => {
    if (activeFilter === 'all') {
      return CROCHET_SYMBOLS
    }
    return CROCHET_SYMBOLS.filter((item) => item.category === activeFilter)
  }, [activeFilter])

  return (
    <section
      aria-label="Ký hiệu móc len và nguyên liệu"
      className={styles.wrapper}
    >
      <div className={styles.header}>
        <button
          type="button"
          className={styles.toggleButton}
          aria-expanded={isOpen}
          aria-controls="crochet-symbols-panel"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span className={styles.headerMain}>
            <span className={styles.iconBadge} aria-hidden="true">
              <BookOutlined />
            </span>
            <span className={styles.title}>
              Ký hiệu móc len / Crochet symbols
            </span>
            <span className={styles.countPill}>
              {CROCHET_SYMBOLS.length} ký hiệu
            </span>
          </span>
          <span
            className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
            aria-hidden="true"
          >
            <DownOutlined />
          </span>
        </button>

        <a
          className={styles.headerShopLink}
          href={SUPPLIES_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ShoppingOutlined />
          <span>Len &amp; phụ kiện</span>
        </a>
      </div>

      {isOpen && (
        <div id="crochet-symbols-panel" className={styles.body}>
          <div
            className={styles.filterBar}
            role="group"
            aria-label="Lọc theo nhóm ký hiệu"
          >
            {FILTER_OPTIONS.map((option) => {
              const isActive = activeFilter === option.key
              return (
                <button
                  key={option.key}
                  type="button"
                  aria-pressed={isActive}
                  className={`${styles.filterPill} ${
                    isActive ? styles.filterPillActive : ''
                  }`}
                  onClick={() => setActiveFilter(option.key)}
                >
                  <span>{option.label}</span>
                  <span className={styles.filterCount}>
                    {categoryCounts[option.key]}
                  </span>
                </button>
              )
            })}
          </div>

          <div className={styles.grid}>
            {filteredSymbols.map((item) => (
              <div key={item.code} className={styles.symbolCard}>
                <span className={styles.symbolCode}>{item.code}</span>
                <div className={styles.symbolMeaning}>
                  <span className={styles.symbolVi}>{item.vi}</span>
                  <span className={styles.symbolEn}>{item.en}</span>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.footer}>
            <div className={styles.exampleBox}>
              <div className={styles.exampleHeader}>
                <span className={styles.exampleLabel}>Ví dụ</span>
                <code className={styles.exampleCode}>R1: 6x</code>
                <span className={styles.exampleEn}>6 sc in a magic ring</span>
              </div>
              <p className={styles.exampleVi}>
                Vòng 1: Móc 6 mũi đơn vào vòng tròn ma thuật.
              </p>
            </div>

            <div className={styles.suppliesBox}>
              <p className={styles.suppliesCopy}>
                Một số shop len, phụ kiện móc len, trang trí, chụp hình mình đã
                mua:
              </p>
              <a
                className={styles.suppliesButton}
                href={SUPPLIES_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ShoppingOutlined />
                <span>Len và phụ kiện</span>
                <ExportOutlined className={styles.externalIcon} />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default CrochetSymbolsGuide
