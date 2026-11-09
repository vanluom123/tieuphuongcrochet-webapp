import { API_ROUTES } from '../constant'
import { VideoPopup } from '../definitions'
import apiService from './apiService'
import apiJwtService from './apiJwtService'

function requireArray(value: unknown): VideoPopup[] {
  if (!Array.isArray(value)) {
    throw new Error('Unexpected video popup response')
  }
  return value
}

export async function fetchActiveVideoPopups(): Promise<VideoPopup[]> {
  try {
    const res = await apiService({ endpoint: API_ROUTES.VIDEO_POPUP_LISTS })
    if (!res?.success || !Array.isArray(res.data)) return []
    return res.data
  } catch {
    return []
  }
}

export async function fetchVideoPopupsAdmin(): Promise<VideoPopup[]> {
  const res = await apiJwtService({ endpoint: `${API_ROUTES.VIDEO_POPUP_LISTS}/manage` })
  return requireArray(res.data)
}

export async function saveVideoPopups(lists: VideoPopup[]): Promise<VideoPopup[]> {
  const res = await apiJwtService({
    endpoint: API_ROUTES.VIDEO_POPUP_LISTS,
    method: 'POST',
    data: lists,
  })
  return requireArray(res.data)
}
