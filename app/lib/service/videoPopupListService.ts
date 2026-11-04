import { API_ROUTES } from '../constant'
import { VideoPopupList } from '../definitions'
import { notification } from '../notify'
import apiService from './apiService'
import apiJwtService from './apiJwtService'

export async function fetchActiveVideoPopupLists(): Promise<VideoPopupList[]> {
  try {
    const res = await apiService({ endpoint: API_ROUTES.VIDEO_POPUP_LISTS })
    if (!res?.success || !Array.isArray(res.data)) return []
    return res.data
  } catch {
    return []
  }
}

export async function fetchVideoPopupListsAdmin(): Promise<VideoPopupList[]> {
  const res = await apiJwtService({ endpoint: `${API_ROUTES.VIDEO_POPUP_LISTS}/manage` })
  return Array.isArray(res.data) ? res.data : []
}

export async function createUpdateVideoPopupLists(lists: VideoPopupList[]): Promise<boolean> {
  const res = await apiJwtService({
    endpoint: API_ROUTES.VIDEO_POPUP_LISTS,
    method: 'POST',
    data: lists,
  })
  if (res.success) {
    notification.success({ message: 'Success', description: 'Video popup lists updated' })
    return true
  }
  notification.error({ message: 'Failed', description: 'Could not update video popup lists' })
  return false
}
