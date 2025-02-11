import { map } from "lodash";
import { API_ROUTES } from "../constant";
import { FileUpload, ListParams, DataType, Pattern, CUResponse } from "../definitions";
import { getAvatar } from "../utils";
import apiService from "./apiService";
import { notification } from "../notify";
import apiJwtService from "./apiJwtService";

export const fetchFreePatterns = async (params: ListParams, next?: NextFetchRequestConfig): Promise<{data: DataType[], totalRecords: number}> => {
    const res = await apiService({
        endpoint: `${API_ROUTES.FREE_PATTERN}/${API_ROUTES.PAGINATION}`,
        method: 'POST',
        queryParams: {
            'pageNo': params.pageNo.toString(),
            'pageSize': params.pageSize.toString(),
            'sortBy': params.sortBy as string,
            'sortDir': params.sortDir as string,
        },
        next,
        data: params.filters,
    }).catch((err) => {
        return { data: [], totalElements: 0 }
    });

    const newData = map(res.contents, item => ({
        ...item,
        key: item.id,
        src: item.fileContent || getAvatar(item?.images as FileUpload[]),
    }));
    
    return {
        data: newData as DataType[],
        totalRecords: res.totalElements || 0
    }
};

export const fetchFreePatternDetail = async (id: string, revalidate?: number): Promise<Pattern> => {
    const data = await apiService({
        endpoint: `${API_ROUTES.FREE_PATTERN}/${API_ROUTES.DETAIL}?id=${id}`,
        method: 'GET',
        next: { revalidate: revalidate || 0, tags: [`free-pattern-${id}`] },
    }).catch((err) => {
        return {} as Pattern;
    });

    const newData: Pattern = {
        ...data,
        src: getAvatar(data.images as FileUpload[]),
        files: data.files ? map(data.files, f => ({...f, url: f?.fileContent})) : [],
        images: data.images ? map(data.images, f => ({...f, url: f?.fileContent})) : [],
    };
    
    return newData;
};

export const createUpdateFreePattern = async (data: Pattern): Promise<CUResponse> => {
    const endpoint = `${API_ROUTES.FREE_PATTERN}/${API_ROUTES.CREATE}`
    const res: CUResponse = await apiJwtService({
        endpoint,
        method: 'POST',
        data,
    }).catch((err) => {
        notification.error({message: 'Failed', description: err.message});
   });

    if (res?.success && !data.id) {
        notification.success({ message: 'Success', description: 'Create free pattern successfully' })
    }
    if(res?.success && data.id) {
        notification.success({ message: 'Success', description: 'Update free pattern successfully' })
    }

    return res;
};

export const deleteFreePattern = async (id: string) => {
    const url = `${API_ROUTES.FREE_PATTERN}/${API_ROUTES.DELETE}?id=${id}`;
    await apiJwtService({
        endpoint: url,
        method: 'DELETE',
    }).then(() => {
        notification.success({ message: 'Success', description: 'Delete free pattern successfully' })
    }).catch((err) => {
        notification.error({ message: 'Failed', description: err.message })
    })
}