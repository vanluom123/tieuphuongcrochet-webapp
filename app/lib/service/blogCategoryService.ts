import {API_ROUTES} from "../constant";
import {DataType, ResponseData} from "../definitions";
import apiService from "./apiService";

export interface BlogCategory {
    id: string;
    name: string;
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

export const mapBlogCategoriesToDataType = (categories: BlogCategory[]): DataType[] => {
    return categories.map(cat => ({
        key: cat.id,
        name: cat.name,
    }));
};