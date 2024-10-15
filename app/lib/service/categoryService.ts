import { API_ROUTES } from "../constant";
import apiService from "./apiService";
import { mapTreeData } from "../utils";
import { Category } from "../definitions";
import apiJwtService from "./apiJwtService";
import { notification } from "../notify";

export const fetchCategories = async () => {
    const res = await apiService({
        endpoint: API_ROUTES.ALL_CATEGORY,
    });
    const newData = mapTreeData(res);
    return newData;
}

export const createCategory = async (data: Category) => {
    const url = `${API_ROUTES.CATEGORY}/${API_ROUTES.CREATE}`
    const res = await apiJwtService({
        endpoint: url,
        method: 'POST',
        data: data,
    }).catch((err) => {
        console.log("err", err);
        notification.error({message: 'Failed', description: err.message})
    });
    if (res?.id || res?.length > 0) {
        notification.success({ message: 'Success', description: 'Create category successfully' })
    }
}

export const updateCategory = async (data: Category) => {
    const url = `${API_ROUTES.CATEGORY}/${API_ROUTES.UPDATE}`
    const res = await apiJwtService({
        endpoint: url,
        method: 'PUT',
        data: data,
    }).catch((err) => {
        console.log("err", err);
        notification.error({message: 'Failed', description: err.message})
    });
    if (res?.id) {
        notification.success({ message: 'Success', description: 'Update category successfully' })
    }

}

export const deleteCategory = async (id: string) => {
    const url = `${API_ROUTES.CATEGORY}/${API_ROUTES.DELETE}?id=${id}`
    
    await apiJwtService({
        endpoint: url,
        method: 'DELETE',
    }).then(() => {
            notification.success({ message: 'Success', description: 'Delete category successfully' })
    }).catch((err) => {
        console.log("err", err);
        notification.error({ message: 'Failed', description: err.message })
    })
}