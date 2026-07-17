import {API_ROUTES} from "../constant";
import {DataType, ResponseData} from "../definitions";
import apiService from "./apiService";
import apiJwtService from "./apiJwtService";
import {notification} from "../notify";

export interface BlogCategory {
    id: string;
    name: string;
    nameEn?: string;
}

export const fetchBlogCategories = async (next?: NextFetchRequestConfig): Promise<BlogCategory[]> => {
    const res: ResponseData<BlogCategory[]> = await apiService({
        endpoint: API_ROUTES.BLOG_CATEGORIES,
        method: 'GET',
        next,
    });

    if (!res.success) {
        return [];
    }

    return res.data || [];
};

export const createBlogCategory = async (data: { name: string; nameEn?: string }): Promise<ResponseData<any>> => {
    const res: ResponseData<any> = await apiJwtService({
        endpoint: API_ROUTES.BLOG_CATEGORIES,
        method: 'POST',
        data,
    });

    if (!res.success) {
        notification.error({message: 'Failed', description: res.message})
    }

    if (res.success) {
        notification.success({message: 'Success', description: 'Create blog category successfully'})
    }

    return res;
};

export const updateBlogCategory = async (data: { id: string; name: string; nameEn?: string }): Promise<ResponseData<any>> => {
    const res: ResponseData<any> = await apiJwtService({
        endpoint: API_ROUTES.BLOG_CATEGORIES,
        method: 'POST',
        data,
    });

    if (!res.success) {
        notification.error({message: 'Failed', description: res.message})
    }

    if (res.success) {
        notification.success({message: 'Success', description: 'Update blog category successfully'})
    }

    return res;
};



export const deleteBlogCategory = async (id: string): Promise<void> => {
    const res: ResponseData<any> = await apiJwtService({
        endpoint: `${API_ROUTES.BLOG_CATEGORIES}/${id}`,
        method: 'DELETE'
    });

    if (!res.success) {
        notification.error({message: 'Failed', description: res.message})
    }

    if (res.success) {
        notification.success({message: 'Success', description: 'Delete blog category successfully'})
    }
};

export const mapBlogCategoriesToDataType = (categories: BlogCategory[]): DataType[] => {
    return categories.map(cat => ({
        key: cat.id,
        name: cat.name,
        nameEn: cat.nameEn,
    }));
};
