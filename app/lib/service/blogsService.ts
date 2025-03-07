import {API_ROUTES} from "../constant";
import {CUResponse, DataType, ListParams, ListResponse, Post} from "../definitions";
import apiService from "./apiService";
import {getAvatar} from "../utils";
import apiJwtService from "./apiJwtService";
import {notification} from "../notify";

export const fetchBlogs = async (params: ListParams, next?: NextFetchRequestConfig): Promise<{
    data: DataType[],
    totalRecords: number
}> => {
    try {
        const res: ListResponse<Post> = await apiService({
            endpoint: `${API_ROUTES.BLOG}/${API_ROUTES.PAGINATION}`,
            method: 'GET',
            queryParams: {
                pageNo: params.pageNo.toString(),
                pageSize: params.pageSize.toString(),
                sortBy: params.sortBy as string,
                sortDir: params.sortDir as string,
                filter: params.filter,
            },
            next,
        });

        const newData = res.contents?.map(item => ({
            ...item,
            key: item.id,
            name: item.title,
            src: item?.fileContent || item.files?.[0]?.fileContent,
        }));

        return {
            data: newData as DataType[],
            totalRecords: res.totalElements || 0
        };
    } catch (err) {
        console.error("Error fetching blogs:", err);
        return {data: [], totalRecords: 0};
    }
};

export const fetchPostDetail = async (id: string, next?: NextFetchRequestConfig): Promise<Post> => {
    try {
        const res: Post = await apiService({
            endpoint: `${API_ROUTES.BLOG}/${API_ROUTES.DETAIL}?id=${id}`,
            method: 'GET',
            next,
        });

        return {
            ...res,
            src: getAvatar(res.files || []),
            files: res.files?.map(f => ({...f, url: f?.fileContent})) || [],
        };
    } catch (err) {
        console.error("Error fetching post detail:", err);
        return {} as Post;
    }
};

export const deletePost = async (id: string): Promise<void> => {
    try {
        await apiJwtService({
            endpoint: `${API_ROUTES.BLOG}/${API_ROUTES.DELETE}?id=${id}`,
            method: 'DELETE',
        });
    } catch (err) {
        console.error("Error deleting post:", err);
        throw err;
    }
};

export const createUpdatePost = async (data: Post): Promise<CUResponse> => {
    const res = await apiJwtService({
        endpoint: `${API_ROUTES.BLOG}/${API_ROUTES.CREATE}`,
        method: 'POST',
        data,
    }).catch(err => {
        notification.error({message: 'Failed', description: err.message});
    });

    return res;
};
