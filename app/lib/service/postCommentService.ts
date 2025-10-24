import { API_ROUTES } from '../constant'
import apiService from './apiService'
import apiJwtService from './apiJwtService'
import { notification } from '../notify'
import { CommentData, PageResponse, ResponseData } from '../definitions'

export const postCommentApi = {
    // Create or update comment
    createUpdateComment: async (data: {
        id?: string
        postId?: string
        content: string
        parentId?: string
        mentionedUserId?: string
    }): Promise<ResponseData<any>> => {
        return await apiJwtService({
            baseUrl: process.env.NEXT_PUBLIC_POST_SERVICE_API_URL,
            endpoint: API_ROUTES.COMMENTS,
            method: 'POST',
            data,
        })
    },

    // Get root comments for a blog post
    fetchRootComments: async (
        id: string,
        pageNo: number = 0,
        pageSize: number = 10,
    ): Promise<PageResponse<CommentData>> => {
        const res: ResponseData<PageResponse<CommentData>> = await apiService({
            baseUrl: process.env.NEXT_PUBLIC_POST_SERVICE_API_URL,
            endpoint: `${API_ROUTES.COMMENTS}/${id}/root`,
            method: 'GET',
            queryParams: {
                pageNo: pageNo.toString(),
                pageSize: pageSize.toString(),
            },
        })
        return res.data
    },

    // Get all comments for a blog post
    fetchAllComments: async (
        id: string,
        pageNo: number = 0,
        pageSize: number = 10,
    ): Promise<PageResponse<CommentData>> => {
        const res: ResponseData<PageResponse<CommentData>> = await apiService({
            baseUrl: process.env.NEXT_PUBLIC_POST_SERVICE_API_URL,
            endpoint: `${API_ROUTES.COMMENTS}/${id}`,
            method: 'GET',
            queryParams: {
                pageNo: pageNo.toString(),
                pageSize: pageSize.toString(),
            },
        })
        return res.data
    },

    // Get replies for a comment
    fetchCommentReplies: async (commentId: string): Promise<CommentData[]> => {
        const res: ResponseData<CommentData[]> = await apiService({
            baseUrl: process.env.NEXT_PUBLIC_POST_SERVICE_API_URL,
            endpoint: `${API_ROUTES.COMMENTS}/replies/${commentId}`,
            method: 'GET',
        })
        if (!res.success) {
            return []
        }
        return res.data
    },

    // Delete a comment
    deleteComment: async (commentId: string): Promise<ResponseData<any>> => {
        const res: ResponseData<any> = await apiJwtService({
            baseUrl: process.env.NEXT_PUBLIC_POST_SERVICE_API_URL,
            endpoint: `${API_ROUTES.COMMENTS}/${commentId}`,
            method: 'DELETE',
        })

        if (!res.success) {
            notification.error({ message: 'Failed', description: res.message })
        }

        return res
    },

    // Get count of root comments for a blog post
    fetchRootCommentsCount: async (id: string): Promise<number> => {
        const res: ResponseData<any> = await apiService({
            baseUrl: process.env.NEXT_PUBLIC_POST_SERVICE_API_URL,
            endpoint: `${API_ROUTES.COMMENTS}/${id}/root/count`,
            method: 'GET',
        })

        if (!res.success) {
            return 0
        }

        return res.data
    },

    // Get count of all comments for a blog post
    fetchAllCommentsCount: async (id: string): Promise<number> => {
        const res: ResponseData<any> = await apiService({
            baseUrl: process.env.NEXT_PUBLIC_POST_SERVICE_API_URL,
            endpoint: `${API_ROUTES.COMMENTS}/${id}/count`,
            method: 'GET',
        })

        if (!res.success) {
            return 0
        }

        return res.data
    },
}
