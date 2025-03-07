import {Collection, IResponseList, ListParams, ListResponse, Pattern} from "../definitions";
import apiJwtService from "./apiJwtService";
import {API_ROUTES} from "../constant";

export async function fetchUserCollections(): Promise<Collection[]> {
    const response = await apiJwtService({
        endpoint: `${API_ROUTES.COLLECTIONS}/my-collections`,
        method: 'GET',
    });

    return response ?? [];
}

export async function fetchUserPatterns(userId: string, params: ListParams): Promise<IResponseList<Pattern>> {
    const response: ListResponse<Pattern> = await apiJwtService({
        endpoint: `${API_ROUTES.USER}/${userId}${API_ROUTES.FREE_PATTERN}`,
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
        data: response.contents || [],
        totalRecords: response.totalElements || 0
    }
}

export async function deleteUserPattern(id: string) {
    return await apiJwtService({
        endpoint: `${API_ROUTES.FREE_PATTERN}/${API_ROUTES.DELETE}`,
        method: 'DELETE',
        queryParams: {id}
    });
}

export async function fetchCollectionDetail(id: string) {
    return await apiJwtService({
        endpoint: `${API_ROUTES.COLLECTIONS}/${id}`,
        method: 'GET'
    });
}

export async function createUpdateCollection(name: string) {
    const endpoint = `${API_ROUTES.COLLECTIONS}/${API_ROUTES.CREATE}`;
    const options = {
        endpoint,
        method: 'POST',
        queryParams: {name},
    };

    return apiJwtService(options);
}

export async function updateUserProfile(data: any) {
    return await apiJwtService({
        endpoint: `/user-profile/update`,
        method: 'PUT',
        data
    });
}

export async function loadUserInfo(id: string = '') {
    if (!id) {
        return;
    }
    const res = await apiJwtService({
        endpoint: `/user-profile`,
        method: 'GET',
        queryParams: {
            'userId': id
        }
    });
    return {
        name: res?.name,
        imageUrl: res?.imageUrl,
        email: res?.email,
        phone: res?.phone,
        birthDate: res?.birthDate,
        gender: res?.gender,
        backgroundImageUrl: res?.backgroundImageUrl
    };
}
