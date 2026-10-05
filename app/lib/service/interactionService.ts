import { API_ROUTES } from '../constant'
import apiJwtService from './apiJwtService'

export interface ToggleLikeResponse {
  success: boolean
  data: boolean
  message: string
}

/**
 * Toggle like on a target item (pattern, free pattern, blog, product, etc.)
 * @param targetId - The ID of the target item
 * @param targetType - The type of the target (PATTERN, FREE_PATTERN, BLOG, PRODUCT)
 * @returns Promise<boolean> - New like state (true = liked, false = unliked)
 */
export const toggleLike = async (
  targetId: string,
  targetType: string,
): Promise<boolean> => {
  try {
    const res: ToggleLikeResponse = await apiJwtService({
      endpoint: `${API_ROUTES.INTERACTIONS}/like/toggle`,
      method: 'POST',
      queryParams: {
        targetId,
        targetType,
      },
    })

    return res.data
  } catch (error) {
    console.error('Error toggling like:', error)
    throw error
  }
}