import { map } from "lodash";
import { API_ROUTES } from "../constant";
import { Product, FileUpload, ListParams, DataType, ResponseData } from "../definitions";
import { getAvatar } from "../utils";
import apiService from "./apiService";
import { notification } from "antd";
import apiJwtService from "./apiJwtService";

export const fetchProducts = async (params: ListParams, next?: NextFetchRequestConfig): Promise<{ data: DataType[], totalRecords: number }> => {
    const res: ResponseData = await apiService({
        endpoint: API_ROUTES.PRODUCTS,
        method: 'POST',
        queryParams: {
            'pageNo': params.pageNo.toString(),
            'pageSize': params.pageSize.toString(),
            'sortBy': params.sortBy as string,
            'sortDir': params.sortDir as string,
        },
        data: params.filters,
        next,
    });

    if (!res.success) {
        return { data: [], totalRecords: 0 }
    }

    const newData = map(res.data.contents, (item: Product) => ({
        ...item,
        key: item.id,
        name: item.name,
        price: item.price,
        currency_code: item.currency_code,
        src: item?.fileContent || getAvatar(item.images as FileUpload[]),
    }));
    return {
        data: newData as DataType[],
        totalRecords: res.data.totalElements || 0
    }
};

export const fetchProductDetail = async (id: string, revalidate?: number): Promise<Product> => {
    const res = await apiService({
        endpoint: `${API_ROUTES.PRODUCTS}/${id}`,
        method: 'GET',
        next: { revalidate: revalidate || 0, tags: [`product-${id}`] },
    });

    if (!res.success) {
        return {} as Product;
    }

    const newData: Product = {
        ...res.data,
        src: getAvatar(res.data.images as FileUpload[]),
        images: res.data.images?.map((f: FileUpload) => ({ ...f, url: f?.fileContent }))
    };

    return newData;
};

export const deleteProduct = async (id: string) => {
    const res: ResponseData = await apiJwtService({
        endpoint: API_ROUTES.PRODUCTS,
        method: 'DELETE',
        queryParams: { id },
    });

    if (!res.success) {
        notification.error({ message: 'Failed', description: res.message });
    }

    if (res.success) {
        notification.success({ message: 'Success', description: 'Delete product successfully' });
    }
};

export const createUpdateProduct = async (data: Product): Promise<ResponseData> => {
    const res: ResponseData = await apiJwtService({
        endpoint: `${API_ROUTES.PRODUCTS}/${API_ROUTES.CREATE}`,
        method: 'POST',
        data,
    });

    if (!res.success) {
        notification.error({ message: 'Failed', description: res.message });
    }

    if (res.success && !data.id) {
        notification.success({ message: 'Success', description: 'Create product successfully' })
    }
    if (res.success && data.id) {
        notification.success({ message: 'Success', description: 'Update product successfully' })
    }

    return res;
};