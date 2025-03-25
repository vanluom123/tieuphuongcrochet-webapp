import { API_ROUTES } from "../constant";
import { ResponseData } from "../definitions";
import apiJwtService from "./apiJwtService";

export const savePatternToCollection = async (patternId: string, collectionId: string)
    : Promise<ResponseData> => {
    const res: ResponseData = await apiJwtService({
        endpoint: `${API_ROUTES.COLLECTIONS}/${collectionId}/add-pattern/${patternId}`,
        method: 'POST'
    });
    return res;
}

export const checkPatternInCollection = async (patternId: string)
    : Promise<ResponseData> => {
    const res: ResponseData = await apiJwtService({
        endpoint: `${API_ROUTES.COLLECTIONS}/${patternId}/exists`,
        method: 'GET'
    });
    return res;
}

export const removePatternFromCollection = async (patternId: string): Promise<ResponseData> => {
    const res = await apiJwtService({
        endpoint: `${API_ROUTES.COLLECTIONS}/remove-pattern/${patternId}`,
        method: 'DELETE'
    })
    return res;
}