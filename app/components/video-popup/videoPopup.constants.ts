export const VIDEO_POPUP_SHOW_DELAY_MS = 4500
export const VIDEO_POPUP_COOLDOWN_MS = 3 * 60 * 60 * 1000
export const VIDEO_POPUP_CLOSE_COUNTDOWN_SEC = 15
export const VIDEO_POPUP_MAX_WAIT_MS = 30_000
export const BLOCKING_MODAL_POLL_MS = 500
export const VIDEO_POPUP_MODAL_CLASS = 'video-popup-modal'
export const VIDEO_POPUP_COMPLETED_AT_KEY = 'videoPopup:completedAt'
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
