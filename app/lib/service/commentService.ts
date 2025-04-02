// commentService.ts
import {API_ROUTES} from "../constant";
import apiService from "./apiService";
import apiJwtService from "./apiJwtService";
import {notification} from "../notify";
import {CommentData, PageResponse, ResponseData} from "../definitions";

// Create or update comment
export const createUpdateComment = async (data: {
    id?: string;
    blogPostId: string;
    content: string;
    parentId?: string;
    mentionedUserId?: string;
}): Promise<ResponseData<any>> => {
    return await apiJwtService({
        endpoint: API_ROUTES.COMMENTS,
        method: 'POST',
        data
    });
};

// Get root comments for a blog post
export const fetchRootComments = async (
    blogId: string,
    pageNo: number = 0,
    pageSize: number = 10
): Promise<PageResponse<CommentData>> => {
    const res: ResponseData<PageResponse<CommentData>> = await apiService({
        endpoint: `${API_ROUTES.COMMENTS}/root/${blogId}`,
        method: 'GET',
        queryParams: {
            pageNo: pageNo.toString(),
            pageSize: pageSize.toString()
        }
    });
    return res.data;
};

// Get all comments for a blog post
export const fetchAllComments = async (
    blogId: string,
    pageNo: number = 0,
    pageSize: number = 10
): Promise<PageResponse<CommentData>> => {
    const res: ResponseData<PageResponse<CommentData>> = await apiService({
        endpoint: `${API_ROUTES.COMMENTS}/blog/${blogId}`,
        method: 'GET',
        queryParams: {
            pageNo: pageNo.toString(),
            pageSize: pageSize.toString()
        }
    });
    return res.data;
};

// Get replies for a comment
export const fetchCommentReplies = async (
    commentId: string
): Promise<CommentData[]> => {
    const res: ResponseData<CommentData[]> = await apiService({
        endpoint: `${API_ROUTES.COMMENTS}/replies/${commentId}`,
        method: 'GET'
    });
    if (!res.success) {
        return [];
    }
    return res.data;
};

// Delete a comment
export const deleteComment = async (
    commentId: string
): Promise<ResponseData<any>> => {
    const res: ResponseData<any> = await apiJwtService({
        endpoint: `${API_ROUTES.COMMENTS}/${commentId}`,
        method: 'DELETE'
    });

    if (!res.success) {
        notification.error({message: 'Failed', description: res.message});
    }

    return res;
};

// Get count of root comments for a blog post
export const fetchRootCommentsCount = async (
    blogId: string
): Promise<number> => {
    const res: ResponseData<any> = await apiService({
        endpoint: `${API_ROUTES.COMMENTS}/count/root/${blogId}`,
        method: 'GET'
    });

    if (!res.success) {
        return 0;
    }

    return res.data;
};

// Get count of all comments for a blog post
export const fetchAllCommentsCount = async (
    blogId: string
): Promise<number> => {
    const res: ResponseData<any> = await apiService({
        endpoint: `${API_ROUTES.COMMENTS}/count/${blogId}`,
        method: 'GET'
    });

    if (!res.success) {
        return 0;
    }

    return res.data;
};