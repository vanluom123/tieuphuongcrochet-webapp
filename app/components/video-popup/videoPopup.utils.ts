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
