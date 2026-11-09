import { VIDEO_POPUP_COMPLETED_AT_KEY, VIDEO_POPUP_COOLDOWN_MS } from './videoPopup.constants'

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

export function recordCompletionTimestamp(timestamp = Date.now()): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(VIDEO_POPUP_COMPLETED_AT_KEY, String(timestamp))
  } catch {
    // Storage can be unavailable in private browsing; closing must still work.
  }
}