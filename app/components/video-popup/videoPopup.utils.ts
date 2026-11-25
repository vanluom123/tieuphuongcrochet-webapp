export const VIDEO_POPUP_SHOW_DELAY_MS = 3 * 60 * 1000
export const VIDEO_POPUP_COOLDOWN_MS = 60 * 60 * 1000
export const VIDEO_POPUP_CLOSE_COUNTDOWN_SEC = 15
export const VIDEO_POPUP_RETRY_MS = 5_000
export const VIDEO_POPUP_MAX_RETRIES = 6

export const VIDEO_POPUP_EXCLUDED_PATHS = [
  '/dashboard',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/resend-verification',
  '/oauth2',
  '/premium/capture',
  '/profile/delete-account',
]

const VIDEO_POPUP_COMPLETED_AT_KEY = 'videoPopup:completedAt'
const INTERNAL_PATH = /^\/[^/\\]/
const BLOCKING_OVERLAYS = '.ant-modal-wrap, .ant-drawer-open, .ant-image-preview-wrap'

function readCompletedAt(): number | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(VIDEO_POPUP_COMPLETED_AT_KEY)
    if (!raw) return null
    const completedAt = Number(raw)
    if (!Number.isFinite(completedAt) || completedAt <= 0 || completedAt > Date.now()) return null
    return completedAt
  } catch {
    return null
  }
}

export function isWithinCooldown(now = Date.now()): boolean {
  const completedAt = readCompletedAt()
  return completedAt !== null && now - completedAt < VIDEO_POPUP_COOLDOWN_MS
}

export function recordVideoPopupCompleted(timestamp = Date.now()): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(VIDEO_POPUP_COMPLETED_AT_KEY, String(timestamp))
  } catch {
    // Storage can be unavailable in private browsing; closing must still work.
  }
}

export function formatCtaLink(value: string): string {
  return value.trim()
}

export function isSafeVideoUrl(value: string): boolean {
  const link = value.trim()
  if (!link) return false
  try {
    const url = new URL(link)
    return (url.protocol === 'http:' || url.protocol === 'https:') && url.hostname !== ''
  } catch {
    return false
  }
}

const GANJING_VIDEO_PATH = /(?:^|\/)(?:video|embed)\/([a-zA-Z0-9_-]+)/
const YOUTUBE_VIDEO_ID = /^[a-zA-Z0-9_-]{6,20}$/
const YOUTUBE_HOSTS = new Set(['youtube.com', 'm.youtube.com', 'youtube-nocookie.com'])

export function resolveVideoEmbedUrl(
  rawUrl: string,
  options?: { autoplay?: boolean },
): string | null {
  const trimmed = rawUrl.trim()
  if (!trimmed) return null

  let url: URL
  try {
    url = new URL(trimmed)
  } catch {
    return null
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') return null

  const host = url.hostname.toLowerCase().replace(/^www\./, '')
  if (!host) return null

  if (host === 'ganjingworld.com' || host.endsWith('.ganjingworld.com')) {
    const match = url.pathname.match(GANJING_VIDEO_PATH)
    if (!match) return null
    const id = match[1]
    return `https://www.ganjingworld.com/embed/${id}${options?.autoplay ? '?autoplay=1&mute=1' : ''}`
  }

  let youtubeId: string | null = null
  if (host === 'youtu.be') {
    youtubeId = url.pathname.split('/').filter(Boolean)[0] ?? null
  } else if (YOUTUBE_HOSTS.has(host)) {
    if (url.pathname === '/watch') {
      youtubeId = url.searchParams.get('v')
    } else {
      const segments = url.pathname.split('/').filter(Boolean)
      if (segments[0] === 'embed' || segments[0] === 'shorts' || segments[0] === 'live') {
        youtubeId = segments[1] ?? null
      }
    }
  }

  if (youtubeId && YOUTUBE_VIDEO_ID.test(youtubeId)) {
    return `https://www.youtube.com/embed/${youtubeId}${
      options?.autoplay ? '?autoplay=1&mute=1&playsinline=1' : ''
    }`
  }

  return null
}

export function isSafeCtaUrl(value: string): boolean {
  const link = formatCtaLink(value)
  if (!link) return false
  // A single leading slash is a same-origin path; `//host` and `/\host` are not.
  if (INTERNAL_PATH.test(link)) return true
  try {
    const url = new URL(link)
    return (url.protocol === 'http:' || url.protocol === 'https:') && url.hostname !== ''
  } catch {
    return false
  }
}

export function hasBlockingOverlay(): boolean {
  if (typeof window === 'undefined') return false
  for (const overlay of document.querySelectorAll(BLOCKING_OVERLAYS)) {
    const style = window.getComputedStyle(overlay)
    if (style.display !== 'none' && style.visibility !== 'hidden') return true
  }
  return false
}
