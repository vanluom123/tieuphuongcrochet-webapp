import { VIDEO_POPUP_COMPLETED_AT_KEY, VIDEO_POPUP_COOLDOWN_MS } from './videoPopup.constants'

function readCompletedAt(): number | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(VIDEO_POPUP_COMPLETED_AT_KEY)
    if (!raw) return null
    const completedAt = Number(raw)
    return Number.isFinite(completedAt) ? completedAt : null
  } catch {
    return null
  }
}

export function isInCooldown(now = Date.now()): boolean {
  const completedAt = readCompletedAt()
  return completedAt !== null && now - completedAt < VIDEO_POPUP_COOLDOWN_MS
}

export function markCompleted(): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(VIDEO_POPUP_COMPLETED_AT_KEY, String(Date.now()))
  } catch {
    // Storage can be unavailable in private browsing; closing must still work.
  }
}
