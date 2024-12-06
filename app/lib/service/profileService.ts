import { Collection, Pattern } from "../definitions";
import apiJwtService from "./apiJwtService";
import { API_ROUTES } from "../constant";

export async function fetchUserCollections(): Promise<Collection[]> {
    const response = await apiJwtService({
        endpoint: `${API_ROUTES.COLLECTIONS}/my-collections`,
        method: 'GET'
    });
    return response || [];
}

export async function fetchUserPatterns(): Promise<Pattern[]> {
    const response = await apiJwtService({
        endpoint: `${API_ROUTES.FREE_PATTERN}/create-by`,
        method: 'GET',
    });
    return response || [];
}

export async function updateUserProfile(data: any) {
    return await apiJwtService({
        endpoint: API_ROUTES.USER,
        method: 'PUT',
        data
    });
}