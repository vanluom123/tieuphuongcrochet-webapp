import { VIDEO_POPUP_MODAL_CLASS } from './videoPopup.constants'

function isVisible(element: Element): boolean {
  const style = window.getComputedStyle(element)
  return style.display !== 'none' && style.visibility !== 'hidden'
}

export function hasBlockingModal(): boolean {
  if (typeof document === 'undefined') return false

  const wraps = document.querySelectorAll('.ant-modal-wrap')
  for (const wrap of wraps) {
    if (wrap.classList.contains(VIDEO_POPUP_MODAL_CLASS)) continue
    if (isVisible(wrap)) return true
  }

  const overlays = document.querySelectorAll('.ant-drawer-open, .ant-image-preview-wrap')
  for (const overlay of overlays) {
    if (isVisible(overlay)) return true
  }

  return false
}
