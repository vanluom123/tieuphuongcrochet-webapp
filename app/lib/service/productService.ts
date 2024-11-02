import { map } from "lodash";
import { API_ROUTES } from "../constant";
import { Product, FileUpload, ListParams, DataType } from "../definitions";
import { getAvatar, mapImagesPreview } from "../utils";
import apiService from "./apiService";
import { notification } from "antd";
import apiJwtService from "./apiJwtService";

export const fetchProducts = async (params: ListParams, next?: NextFetchRequestConfig): Promise<{ data: DataType[], totalRecords: number }> => {
    const res = await apiService({
        endpoint: `${API_ROUTES.PRODUCT}/${API_ROUTES.PAGINATION}`,
        method: 'POST',
        queryParams: {
            'pageNo': params.pageNo.toString(),
            'pageSize': params.pageSize.toString(),
            'sortBy': params.sortBy as string,
            'sortDir': params.sortDir as string,
        },
        data: params.filters,
        next,
    }).catch((err) => {
        console.log("err", err);
        return {} as Product;
    });

    const newData = map(res.contents, (item: Product) => ({
        ...item,
        key: item.id,
        name: item.name,
        price: item.price,
        currency_code: item.currency_code,
        category: item.category,
        images: item.images?.map(f => ({ ...f, url: f?.fileContent })),
        src: getAvatar(item.images as FileUpload[]),
        imagesPreview: mapImagesPreview(item.images || [])

    }));
    return {
        data: newData as DataType[],
        totalRecords: res.totalElements || 0
    }
};

export const fetchProductDetail = async (id: string): Promise<Product> => {
    const res = await apiService({
        endpoint: `${API_ROUTES.PRODUCT}/${API_ROUTES.DETAIL}?id=${id}`,
        method: 'GET',
    }).catch((err) => {
        console.log("err", err);
        return {} as Product;
    });

    const newData: Product = {
        ...res,
        src: getAvatar(res.images as FileUpload[]),
        images: res.images?.map((f: FileUpload) => ({ ...f, url: f?.fileContent }))
    };
    
    return newData;
};

export const deleteProduct = async (id: string) => {
    const url = `${API_ROUTES.PRODUCT}/${API_ROUTES.DELETE}?id=${id}`;
    await apiJwtService({
        endpoint: url,
        method: 'DELETE',
    }).then(() => {
        notification.success({ message: 'Success', description: 'Delete product successfully' })
    }).catch((err) => {
        console.log("err", err);
        notification.error({ message: 'Failed', description: err.message })
    })
};

export const createUpdateProduct = async (data: Product): Promise<Product> => {
    const endpoint = `${API_ROUTES.PRODUCT}/${API_ROUTES.CREATE}`
    const res = await apiJwtService({
        endpoint,
        method: 'POST',
        data,
    }).catch((err) => {
        notification.error({message: 'Failed', description: err.message});
   });
    

    if (res?.id && !data.id) {
        notification.success({ message: 'Success', description: 'Create product successfully' })
    }
    if(res?.id && data.id) {
        notification.success({ message: 'Success', description: 'Update product successfully' })
    }

    return res;
};