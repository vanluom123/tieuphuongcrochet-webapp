import { API_ROUTES } from "../constant";
import apiService from "./apiService";
import { mapTreeData } from "../utils";
import { Category } from "../definitions";

export const fetchCategories = async () => {
    const res = await apiService({
        endpoint: API_ROUTES.ALL_CATEGORY,
    });
    const newData = mapTreeData(res);
    return newData;
}

export const createCategory = async (data: Category) => {
    const url = `${API_ROUTES.CATEGORY}/${API_ROUTES.CREATE}`
    await apiService({
        endpoint: url,
        method: 'PUT',
        data: data
    }).catch((err) => {
        console.log("err", err);
        return {} as Category;
    });
}