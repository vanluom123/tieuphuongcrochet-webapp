import {map} from "lodash";
import {API_ROUTES} from "../constant";
import {CUResponse, DataType, FileUpload, ListParams, Pattern} from "../definitions";
import {getAvatar, showNotification} from "../utils";
import apiService from "./apiService";
import apiJwtService from "./apiJwtService";

/** Fetch paginated list of free patterns */
export const fetchFreePatterns = async (
    params: ListParams,
    next?: NextFetchRequestConfig
): Promise<{ data: DataType[]; totalRecords: number }> => {
    try {
        const res = await apiService({
            endpoint: `${API_ROUTES.FREE_PATTERN}/${API_ROUTES.PAGINATION}`,
            method: "GET",
            queryParams: {
                pageNo: params.pageNo.toString(),
                pageSize: params.pageSize.toString(),
                sortBy: params.sortBy as string,
                sortDir: params.sortDir as string,
                categoryId: params.categoryId,
                filter: params.filter
            },
            next,
        });

        if (!res || !res.contents) throw new Error("Invalid API response");

        const newData = map(res.contents, (item) => ({
            ...item,
            key: item.id,
            src: item.fileContent || getAvatar(item?.images as FileUpload[]),
        }));

        return {
            data: newData as DataType[],
            totalRecords: res.totalElements || 0,
        };
    } catch (error) {
        console.error("Error fetching free patterns:", error);
        return {data: [], totalRecords: 0};
    }
};

/** Fetch free pattern details by ID */
export const fetchFreePatternDetail = async (
    id: string,
    revalidate?: number
): Promise<Pattern> => {
    try {
        const data = await apiService({
            endpoint: `${API_ROUTES.FREE_PATTERN}/${API_ROUTES.DETAIL}?id=${id}`,
            method: "GET",
            next: {revalidate: revalidate || 0, tags: [`free-pattern-${id}`]},
        });

        if (!data) throw new Error("Invalid API response");

        return {
            ...data,
            src: getAvatar(data.images as FileUpload[]),
            files: data.files ? map(data.files, (f) => ({...f, url: f?.fileContent})) : [],
            images: data.images ? map(data.images, (f) => ({...f, url: f?.fileContent})) : [],
        };
    } catch (error) {
        console.error("Error fetching pattern details:", error);
        return {} as Pattern;
    }
};

/** Create or update a free pattern */
export const createUpdateFreePattern = async (data: Pattern): Promise<CUResponse> => {
    try {
        const endpoint = `${API_ROUTES.FREE_PATTERN}/${API_ROUTES.CREATE}`;
        const res: CUResponse = await apiJwtService({
            endpoint,
            method: "POST",
            data,
        });

        const action = data.id ? 'Update' : 'Create';
        showNotification("success", "Success", `${action} free pattern successfully`);

        return res;
    } catch (error: any) {
        showNotification("error", "Failed", error.message || "An unexpected error occurred)");
        return {success: false, message: error?.message || "API error"} as CUResponse;
    }
};

/** Delete a free pattern */
export const deleteFreePattern = async (id: string) => {
    try {
        const url = `${API_ROUTES.FREE_PATTERN}/${API_ROUTES.DELETE}?id=${id}`;
        await apiJwtService({
            endpoint: url,
            method: "DELETE",
        });
        showNotification("success", "Success", "Delete free pattern successfully");
    } catch (error: any) {
        showNotification("error", "Failed", error.message || "An unexpected error occurred");
    }
};