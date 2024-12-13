import { Collection, Pattern } from "../definitions";
import apiJwtService from "./apiJwtService";
import { API_ROUTES } from "../constant";

export async function fetchUserCollections(): Promise<Collection[]> {
    const endpoint = `${API_ROUTES.COLLECTIONS}/my-collections`;
    const response = await apiJwtService({
        endpoint,
        method: 'GET',
    });

    return response ?? [];
}

export async function fetchUserPatterns(): Promise<Pattern[]> {
    const response = await apiJwtService({
        endpoint: `${API_ROUTES.FREE_PATTERN}/create-by`,
        method: 'GET',
    });
    return response ?? [];
}

export async function deleteUserPattern(id: string) {
    return await apiJwtService({
        endpoint: `${API_ROUTES.FREE_PATTERN}/${API_ROUTES.DELETE}`,
        method: 'DELETE',
        queryParams: { id }
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
        queryParams: { name },
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

export async function loadUserInfo() {
    const res = await apiJwtService({
        endpoint: `/user-profile`,
        method: 'GET'
    });
    return {
        name: res?.name,
        imageUrl: res?.imageUrl,
        email: res?.email, 
        phone: res?.phone,
        birthDate: res?.birthDate,
        gender: res?.gender
    };
}
