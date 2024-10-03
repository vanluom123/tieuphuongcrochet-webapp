import { API_ROUTES } from "../constant";
import apiService from "./apiService";
import { mapTreeData } from "../utils";

export const fetchCategories = async () => {
    const res = await apiService({
        endpoint: API_ROUTES.ALL_CATEGORY,
    });
    const newData = mapTreeData(res);
    return newData;
}