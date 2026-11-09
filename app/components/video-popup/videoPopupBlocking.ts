import { VIDEO_POPUP_MODAL_CLASS } from './videoPopup.constants'

const BLOCKING_OVERLAYS = [
  `.ant-modal-wrap:not(.${VIDEO_POPUP_MODAL_CLASS})`,
  '.ant-drawer-open',
  '.ant-image-preview-wrap',
].join(', ')

export function hasBlockingModal(): boolean {
  if (typeof window === 'undefined') return false

  for (const overlay of document.querySelectorAll(BLOCKING_OVERLAYS)) {
    const style = window.getComputedStyle(overlay)
    if (style.display !== 'none' && style.visibility !== 'hidden') return true
  }
  return false
}