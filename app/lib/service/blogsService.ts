import { API_ROUTES } from "../constant";
import { DataType, ListParams, Post, ResponseData } from "../definitions";
import apiService from "./apiService";
import {getAvatar} from "../utils";
import apiJwtService from "./apiJwtService";
import { notification } from "../notify";
import { map } from "lodash";

export const fetchBlogs = async (params: ListParams, next?: NextFetchRequestConfig): Promise<{
    data: DataType[],
    totalRecords: number
}> => {
    const res: ResponseData = await apiService({
        endpoint: API_ROUTES.BLOGS,
        method: 'GET',
        queryParams: {
            pageNo: params.pageNo.toString(),
            pageSize: params.pageSize.toString(),
            sortBy: params.sortBy as string,
            sortDir: params.sortDir as string,
            filter: params.filter
        },
        next,
    });

    if (!res.success) {
        notification.error({ message: 'Failed', description: res.message })
        return { data: [], totalRecords: 0 }
    }

    const newData = map(res.data.contents, item => ({
        ...item,
        key: item.id,
        name: item.title,
        src: item?.fileContent || item.files?.[0]?.fileContent,
    }));

    return {
        data: newData as DataType[],
        totalRecords: res.data.totalElements || 0
    };
};

export const fetchPostDetail = async (id: string, next?: NextFetchRequestConfig): Promise<Post> => {
    const res: ResponseData = await apiService({
        endpoint: `${API_ROUTES.BLOGS}/${id}`,
        method: 'GET',
        next
    });

    if (!res.success) {
        notification.error({ message: 'Failed', description: res.message })
        return {} as Post;
    }

    return {
        ...res.data,
        src: getAvatar(res.data.files || []),
        files: res.data.files ? map(res.data.files, f => ({ ...f, url: f?.fileContent })) : [],
    };
};

export const deletePost = async (id: string): Promise<void> => {
    const res: ResponseData = await apiJwtService({
        endpoint: `${API_ROUTES.BLOGS}/${id}`,
        method: 'DELETE'
    });
    if (!res.success) {
        notification.error({ message: 'Failed', description: res.message })
    }
    if (res.success) {
        notification.success({ message: 'Success', description: 'Delete post successfully' })
    }
};

export const createUpdatePost = async (data: Post): Promise<ResponseData> => {
    const res: ResponseData = await apiJwtService({
        endpoint: API_ROUTES.BLOGS,
        method: 'POST',
        data,
    });

    if (!res.success) {
        notification.error({ message: 'Failed', description: res.message })
    }

    if (res.success && !data.id) {
        notification.success({ message: 'Success', description: 'Create post successfully' })
    }

    if (res.success && data.id) {
        notification.success({ message: 'Success', description: 'Update post successfully' })
    }

    return res;
};
