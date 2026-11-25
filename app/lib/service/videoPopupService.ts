import { API_ROUTES } from '../constant'
import { VideoPopup } from '../definitions'
import apiJwtService from './apiJwtService'
import apiService from './apiService'

export async function fetchActiveVideoPopups(): Promise<VideoPopup[]> {
  try {
    const res = await apiService({ endpoint: API_ROUTES.VIDEO_POPUP_LISTS })
    return res?.success && Array.isArray(res.data) ? res.data : []
  } catch {
    return []
  }
}

export async function fetchVideoPopupsAdmin(): Promise<VideoPopup[]> {
  const res = await apiJwtService({ endpoint: `${API_ROUTES.VIDEO_POPUP_LISTS}/manage` })
  if (!res?.success || !Array.isArray(res.data)) {
    throw new Error(res?.message || 'Could not load video popups')
  }
  return res.data
}

export async function createVideoPopup(data: Omit<VideoPopup, 'id'>): Promise<VideoPopup> {
  const res = await apiJwtService({
    endpoint: API_ROUTES.VIDEO_POPUP_LISTS,
    method: 'POST',
    data,
  })
  if (!res?.success || !res?.data) {
    throw new Error(res?.message || 'Could not create video popup')
  }
  return res.data
}

export async function updateVideoPopup(id: string, data: Omit<VideoPopup, 'id'>): Promise<VideoPopup> {
  const res = await apiJwtService({
    endpoint: `${API_ROUTES.VIDEO_POPUP_LISTS}/${id}`,
    method: 'PUT',
    data,
  })
  if (!res?.success || !res?.data) {
    throw new Error(res?.message || 'Could not update video popup')
  }
  return res.data
}

export async function deleteVideoPopup(id: string): Promise<void> {
  const res = await apiJwtService({
    endpoint: `${API_ROUTES.VIDEO_POPUP_LISTS}/${id}`,
    method: 'DELETE',
  })
  if (!res?.success) {
    throw new Error(res?.message || 'Could not delete video popup')
  }
}
