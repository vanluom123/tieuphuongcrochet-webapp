import { API_ROUTES } from "../constant";
import apiService from "./apiService";
import { mapTreeData } from "../utils";
import { Category } from "../definitions";
import apiJwtService from "./apiJwtService";
import { notification } from "../notify";

export const fetchCategories = async () => {
    const res = await apiService({
        endpoint: API_ROUTES.CATEGORIES
    });
    const newData = mapTreeData(res.data);
    return newData;
}

export const createCategory = async (data: Category) => {
    const res = await apiJwtService({
        endpoint: API_ROUTES.CATEGORIES,
        method: 'POST',
        data: data
    });

    if (!res.success) {
        notification.error({ message: 'Failed', description: res.message })
    }

    if (res.success) {
        notification.success({ message: 'Success', description: 'Create category successfully' })
    }
}

export const updateCategory = async (data: Category) => {
    const res = await apiJwtService({
        endpoint: API_ROUTES.CATEGORIES,
        method: 'PUT',
        data: data
    });

    if (!res.success) {
        notification.error({ message: 'Failed', description: res.message })
    }

    if (res.success) {
        notification.success({ message: 'Success', description: 'Update category successfully' })
    }
}

export const deleteCategory = async (id: string) => {
    const res = await apiJwtService({
        endpoint: `${API_ROUTES.CATEGORIES}/${id}`,
        method: 'DELETE'
    });

    if (!res.success) {
        notification.error({ message: 'Failed', description: res.message })
    }

    if (res.success) {
        notification.success({ message: 'Success', description: 'Delete category successfully' })
    }
}