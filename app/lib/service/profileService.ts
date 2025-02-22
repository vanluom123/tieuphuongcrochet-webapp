import { Collection, IResponseList, ListParams, ListResponse, Pattern } from "../definitions";
import apiJwtService from "./apiJwtService";
import { API_ROUTES } from "../constant";

export async function fetchUserCollections(): Promise<Collection[]> {
    const response = await apiJwtService({
        endpoint: `${API_ROUTES.COLLECTIONS}/my-collections`,
        method: 'GET',
    });

    return response ?? [];
}

export async function fetchUserPatterns(userId: string, params: ListParams): Promise<IResponseList<Pattern>> {
    console.log('params', params);

    const response: ListResponse<Pattern> = await apiJwtService({
        endpoint: `${API_ROUTES.USER}/${userId}${API_ROUTES.FREE_PATTERN}`,
        method: 'POST',
        queryParams: {
            'pageNo': params?.pageNo.toString(),
            'pageSize': params?.pageSize.toString(),
            'sortBy': params?.sortBy as string,
            'sortDir': params?.sortDir as string,
        }
    });
    console.log('fetchUserPatterns', response);
    const mockPatternsArray = [
        {
            id: "0JQCD9RPKE70F",
            name: "Chart móc gấu túi và gấu nhỏ - Koala and bear illustration",
            author: "柠檬糖手作 - xiaoxiushougon",
            status: "PENDING",
            userId: "0JHMGC9X0C1GJ",
            username: "Tâm Hằng",
            userAvatar: "https://firebasestorage.googleapis.com/v0/b/littlecrochet.appspot.com/o/prod%2Fce77c5aa-cd61-43c2-b90e-0fc9b642b874.jpg?alt=media",
            fileContent: "https://firebasestorage.googleapis.com/v0/b/littlecrochet.appspot.com/o/prod%2F8f84d2f2-5237-46ba-b8fb-0157acd9f4a1.jpg?alt=media",
        }];

    return {
        data: mockPatternsArray as Pattern[],
        totalRecords: mockPatternsArray.length || 0
    }
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
