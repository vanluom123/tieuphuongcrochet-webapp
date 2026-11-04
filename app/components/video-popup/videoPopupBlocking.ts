import { VIDEO_POPUP_MODAL_CLASS } from './videoPopup.constants'

export function hasBlockingModal(): boolean {
  if (typeof document === 'undefined') return false
  const wraps = document.querySelectorAll('.ant-modal-wrap')
  for (const wrap of wraps) {
    if (wrap.classList.contains(VIDEO_POPUP_MODAL_CLASS)) continue
    const style = window.getComputedStyle(wrap)
    if (style.display === 'none' || style.visibility === 'hidden') continue
    return true
  }
  return false
}
