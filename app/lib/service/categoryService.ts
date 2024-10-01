import { API_ROUTES } from "../constant";
import fetchData from "../../api/fetchData";
import { mapTreeData } from "../utils";

export const fetchCategories = async () => {
    const res = await fetchData({
        endpoint: API_ROUTES.ALL_CATEGORY,
    });
    const newData = mapTreeData(res);
    return newData;
}