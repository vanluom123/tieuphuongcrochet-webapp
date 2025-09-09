import { map } from 'lodash'
import { API_ROUTES } from '../constant'
import { DataType, FileUpload, ListParams, Pattern, ResponseData } from '../definitions'
import { getAvatar, showNotification } from '../utils'
import apiJwtService from './apiJwtService'

/** Fetch paginated list of free patterns */
export const fetchFreePatterns = async (
  params: ListParams,
  next?: NextFetchRequestConfig,
): Promise<{ data: DataType[]; totalRecords: number }> => {
  try {
    const res = await apiJwtService({
      endpoint: API_ROUTES.FREE_PATTERNS,
      method: 'GET',
      queryParams: {
        pageNo: params.pageNo.toString(),
        pageSize: params.pageSize.toString(),
        sortBy: params.sortBy as string,
        sortDir: params.sortDir as string,
        categoryId: params.categoryId,
        filter: params.filter,
      },
      next: next,
    })

    if (!res.data || !res.data.contents) {
      return { data: [], totalRecords: 0 }
    }

    const newData = map(res.data.contents, (item) => ({
      ...item,
      key: item.id,
      src: item.fileContent || getAvatar(item?.images as FileUpload[]),
      in_collection: item.in_collection || false, // Sử dụng trạng thái từ backend hoặc mặc định là false
    }))

    return {
      data: newData as DataType[],
      totalRecords: res.data.totalElements || 0,
    }
  } catch (error) {
    console.error('❌ Error fetching free patterns:', error)
    return { data: [], totalRecords: 0 }
  }
}

/** Fetch free pattern details by ID */
export const fetchFreePatternDetail = async (id: string, revalidate?: number): Promise<Pattern> => {
  try {
    const res = await apiJwtService({
      endpoint: `${API_ROUTES.FREE_PATTERNS}/${id}`,
      method: 'GET',
      next: {
        revalidate: revalidate || 0,
        tags: [`free-pattern-${id}`],
      },
    })

    if (!res.data) {
      return {} as Pattern
    }

    return {
      ...res.data,
      src: getAvatar(res.data.images as FileUpload[]),
      files: res.data.files ? map(res.data.files, (f) => ({ ...f, url: f?.fileContent })) : [],
      images: res.data.images ? map(res.data.images, (f) => ({ ...f, url: f?.fileContent })) : [],
    }
  } catch (error) {
    console.error('Error fetching pattern details:', error)
    return {} as Pattern
  }
}

/** Create or update a free pattern */
export const createUpdateFreePattern = async (data: Pattern): Promise<ResponseData<any>> => {
  try {
    const res: ResponseData<any> = await apiJwtService({
      endpoint: API_ROUTES.FREE_PATTERNS,
      method: 'POST',
      data,
    })

    const action = data.id ? 'Update' : 'Create'
    showNotification('success', 'Success', `${action} free pattern successfully`)

    return res
  } catch (error: any) {
    showNotification('error', 'Failed', error.message || 'An unexpected error occurred)')
    return { success: false, message: error?.message || 'API error' } as ResponseData<any>
  }
}

/** Delete a free pattern */
export const deleteFreePattern = async (id: string) => {
  try {
    await apiJwtService({
      endpoint: `${API_ROUTES.FREE_PATTERNS}/${id}`,
      method: 'DELETE',
    })
    showNotification('success', 'Success', 'Delete free pattern successfully')
  } catch (error: any) {
    showNotification('error', 'Failed', error.message || 'An unexpected error occurred')
  }
}

export const existInCollection = async (id: string): Promise<ResponseData<boolean>> => {
  const res = await apiJwtService({
    endpoint: `${API_ROUTES.FREE_PATTERNS}/${id}/exist`,
    method: 'GET',
  })
  return res
}