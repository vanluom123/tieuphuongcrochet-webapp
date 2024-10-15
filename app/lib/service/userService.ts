import { User } from '@/app/lib/definitions';
import { ListParams } from '@/app/lib/definitions';
import { API_ROUTES } from '../constant';
import apiJwtService from './apiJwtService';

export async function fetchUsers(params: ListParams): Promise<{ data: User[], totalRecords: number }> {
    try {
        const response = await apiJwtService({
            endpoint: `${API_ROUTES.USER}/${API_ROUTES.PAGINATION}`,
            method: 'POST',
            queryParams: {
                pageNo: params.pageNo.toString(),
                pageSize: params.pageSize.toString(),
                sortBy: params.sortBy as string,
                sortDir: params.sortDir as string,
            },
            data: params.filters
        }).catch((err) => {
            console.log("err", err);
            return {} as User;
        });
        return {
            data: response.contents,
            totalRecords: response.totalElements || 0
        };
    } catch (error) {
        console.error('Error fetching users:', error);
        return { data: [], totalRecords: 0 };
    }
}

export async function fetchUserDetail(id: string): Promise<User> {
    try {
        const response = await apiJwtService({
            endpoint: `${API_ROUTES.USER}/${API_ROUTES.DETAIL}`,
            method: 'GET',
            queryParams: { 'id': id }
        }).catch((err) => {
            console.log("err", err);
            return {} as User;
        });
        return response;
    } catch (error) {
        console.error('Error fetching user detail:', error);
        return {} as User;
    }
}

export async function updateUser(id: string, userData: User): Promise<User> {
    try {
        const response = await apiJwtService({
            endpoint: `${API_ROUTES.USER}/${API_ROUTES.UPDATE}`,
            method: 'PUT',
            data: userData,
            queryParams: { 'id': id }
        }).catch((err) => {
            console.log("err", err);
            return {} as User;
        });
        return response;
    } catch (error) {
        console.error('Error updating user:', error);
        return {} as User;
    }
}

export async function deleteUser(id: string): Promise<void> {
    try {
        await apiJwtService({
            endpoint: `${API_ROUTES.USER}/${API_ROUTES.DELETE}`,
            method: 'DELETE',
            queryParams: { 'id': id }
        });
    } catch (error) {
        console.error('Error deleting user:', error);
    }
}

