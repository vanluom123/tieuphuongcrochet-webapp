import {Collection, DataType, FileUpload, IResponseList, ListParams, Pattern, ResponseData} from "../definitions";
import apiJwtService from "./apiJwtService";
import {API_ROUTES} from "../constant";
import {map} from "lodash";
import {getAvatar} from "../utils";

export async function fetchFreePatternsByCollection(
    userId: string,
    collectionId: string,
    params: ListParams
): Promise<{ data: DataType[], totalRecords: number }> {
    const res = await apiJwtService({
        endpoint: `${API_ROUTES.USERS}/${userId}/collections/${collectionId}/free-patterns`,
        method: 'GET',
        queryParams: {
            pageNo: params.pageNo.toString(),
            pageSize: params.pageSize.toString(),
            sortBy: params.sortBy as string,
            sortDir: params.sortDir as string
        }
    });

    if (!res.data || !res.data.contents) {
        return {data: [], totalRecords: 0};
    }

    const newData = map(res.data.contents, (item) => ({
        ...item,
        key: item.id,
        src: item.fileContent || getAvatar(item?.images as FileUpload[]),
    }));

    return {
        data: newData as DataType[],
        totalRecords: res.data.totalElements || 0,
    };
}

export async function fetchUserCollections(userId: string): Promise<Collection[]> {
    const response = await apiJwtService({
        endpoint: `${API_ROUTES.USERS}/${userId}/collections`,
        method: 'GET'
    });

    if (!response.success) {
        return [];
    }

    return response.data;
}

export async function fetchUserPatterns(
    userId: string,
    params: ListParams
): Promise<IResponseList<Pattern>> {
    const res = await apiJwtService({
        endpoint: `${API_ROUTES.USERS}/${userId}/free-pattern`,
        method: 'GET',
        queryParams: {
            'pageNo': params?.pageNo.toString(),
            'pageSize': params?.pageSize.toString(),
            'sortBy': params?.sortBy as string,
            'sortDir': params?.sortDir as string,
            'filter': params.filter
        }
    });

    return {
        data: res.data.contents || [],
        totalRecords: res.data.totalElements || 0
    }
}

export async function deleteUserPattern(id: string) {
    const res = await apiJwtService({
        endpoint: `${API_ROUTES.FREE_PATTERNS}/${id}`,
        method: 'DELETE'
    });
    return res.data;
}

export async function fetchCollectionById(
    userId: string,
    collectionId: string
): Promise<ResponseData<any>> {
    const res: ResponseData<any> = await apiJwtService({
        endpoint: `${API_ROUTES.USERS}/${userId}/collections/${collectionId}`,
        method: 'GET'
    });
    return res;
}

export async function createCollection(name: string) {
    const res = await apiJwtService({
        endpoint: API_ROUTES.COLLECTIONS,
        method: 'POST',
        queryParams: {name}
    });
    return res;
}

export async function updateCollection(id: string, name: string) {
    const res = await apiJwtService({
        endpoint: `${API_ROUTES.COLLECTIONS}/${id}`,
        method: 'PUT',
        queryParams: {name}
    })
    return res;
}

export async function deleteCollection(id: string) {
    const res = await apiJwtService({
        endpoint: `${API_ROUTES.COLLECTIONS}/${id}`,
        method: 'DELETE'
    });
    return res;
}

export async function updateUserProfile(data: any) {
    const res = await apiJwtService({
        endpoint: API_ROUTES.USER_PROFILE,
        method: 'PUT',
        data
    });
    return res.data;
}

export async function loadUserInfo(id: string = '') {
    if (!id) {
        return;
    }
    const res = await apiJwtService({
        endpoint: API_ROUTES.USER_PROFILE,
        method: 'GET',
        queryParams: {
            'userId': id
        }
    });

    if (!res.success) {
        return;
    }

    return {
        name: res.data.name,
        imageUrl: res.data.imageUrl,
        email: res.data.email,
        phone: res.data.phone,
        birthDate: res.data.birthDate,
        gender: res.data.gender,
        backgroundImageUrl: res.data.backgroundImageUrl
    };
}
