import {
  VIDEO_POPUP_COMPLETED_PREFIX,
  VIDEO_POPUP_COOLDOWN_MS,
  VIDEO_POPUP_WATCHING_KEY,
} from './videoPopup.constants'

export function isInCooldown(listId: string, now = Date.now()): boolean {
  if (typeof window === 'undefined') return false
  const raw = window.localStorage.getItem(VIDEO_POPUP_COMPLETED_PREFIX + listId)
  if (!raw) return false
  const completedAt = Number(raw)
  if (!Number.isFinite(completedAt)) return false
  return now - completedAt < VIDEO_POPUP_COOLDOWN_MS
}

export function markCompleted(listId: string): void {
  window.localStorage.setItem(VIDEO_POPUP_COMPLETED_PREFIX + listId, String(Date.now()))
  clearWatching()
}

export function markWatching(listId: string): void {
  window.sessionStorage.setItem(
    VIDEO_POPUP_WATCHING_KEY,
    JSON.stringify({ listId, startedAt: Date.now() }),
  )
}

export function clearWatching(): void {
  window.sessionStorage.removeItem(VIDEO_POPUP_WATCHING_KEY)
}

/** Refresh mid-watch keeps sessionStorage. Drop it so the user must watch again. */
export function abandonWatchingFromRefresh(): void {
  if (typeof window === 'undefined') return
  if (window.sessionStorage.getItem(VIDEO_POPUP_WATCHING_KEY)) {
    clearWatching()
  }
}
