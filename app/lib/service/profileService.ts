import {Collection, IResponseList, ListParams, Pattern} from "../definitions";
import apiJwtService from "./apiJwtService";
import {API_ROUTES} from "../constant";
import {notification} from "../notify";

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

export async function fetchUserPatterns(userId: string, params: ListParams): Promise<IResponseList<Pattern>> {
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
        endpoint: `${API_ROUTES.PATTERNS}/${id}`,
        method: 'DELETE'
    });
    return res.data;
}

export async function fetchCollectionDetail(id: string) {
    const res = await apiJwtService({
        endpoint: `${API_ROUTES.COLLECTIONS}/${id}`,
        method: 'GET'
    });
    return res.data;
}

export async function createCollection(name: string) {
    const res = await apiJwtService({
        endpoint: API_ROUTES.COLLECTIONS,
        method: 'POST',
        queryParams: {name}
    });
    return res.data;
}

export async function updateCollection(id: string, name: string) {
    const res = await apiJwtService({
        endpoint: API_ROUTES.COLLECTIONS,
        method: 'PUT',
        queryParams: {collectionId: id, name}
    })
    return res.data;
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
