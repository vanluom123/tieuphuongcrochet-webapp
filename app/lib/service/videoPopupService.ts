import { API_ROUTES } from '../constant'
import { VideoPopup, VideoPopupClip } from '../definitions'
import apiService from './apiService'
import apiJwtService from './apiJwtService'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function parseClip(value: unknown): VideoPopupClip | null {
  if (!isRecord(value)) return null
  if (typeof value.videoUrl !== 'string' || typeof value.videoFileName !== 'string') return null
  return {
    videoUrl: value.videoUrl,
    videoFileName: value.videoFileName,
    label: typeof value.label === 'string' ? value.label : undefined,
    ctaUrl: typeof value.ctaUrl === 'string' ? value.ctaUrl : undefined,
  }
}

function parsePopup(value: unknown): VideoPopup | null {
  if (!isRecord(value)) return null
  if (typeof value.title !== 'string' || typeof value.active !== 'boolean') return null
  if (value.id != null && typeof value.id !== 'string') return null
  if (!Array.isArray(value.clips)) return null
  const clips = value.clips.map(parseClip)
  if (clips.some((clip) => clip === null)) return null
  return {
    id: value.id ?? undefined,
    title: value.title,
    active: value.active,
    clips: clips as VideoPopupClip[],
  }
}

function requireVideoPopups(value: unknown): VideoPopup[] {
  if (!Array.isArray(value)) {
    throw new Error('Unexpected video popup response')
  }
  const popups = value.map(parsePopup)
  if (popups.some((popup) => popup === null)) {
    throw new Error('Unexpected video popup response')
  }
  return popups as VideoPopup[]
}

export async function fetchActiveVideoPopups(): Promise<VideoPopup[]> {
  try {
    const res = await apiService({ endpoint: API_ROUTES.VIDEO_POPUP_LISTS })
    if (!res?.success || !Array.isArray(res.data)) return []
    const data: unknown[] = res.data
    return data.map(parsePopup).filter((popup): popup is VideoPopup => popup !== null)
  } catch {
    return []
  }
}

export async function fetchVideoPopupsAdmin(): Promise<VideoPopup[]> {
  const res = await apiJwtService({ endpoint: `${API_ROUTES.VIDEO_POPUP_LISTS}/manage` })
  return requireVideoPopups(res.data)
}

export async function saveVideoPopups(lists: VideoPopup[]): Promise<VideoPopup[]> {
  const res = await apiJwtService({
    endpoint: API_ROUTES.VIDEO_POPUP_LISTS,
    method: 'POST',
    data: lists,
  })
  return requireVideoPopups(res.data)
}