import { map } from "lodash";
import { API_ROUTES } from "../constant";
import { Product, FileUpload, ListParams, DataType } from "../definitions";
import { getAvatar, mapImagesPreview } from "../utils";
import fetchData from "../../api/fetchData";

export const fetchProducts = async (params: ListParams, filters: any[]): Promise<{data: DataType[], totalRecords: number}> => {
    const res = await fetchData({
        endpoint: `${API_ROUTES.PRODUCT}/${API_ROUTES.PAGINATION}`,
        method: 'POST',
        queryParams: {
            'pageNo': params.pageNo.toString(),
            'pageSize': params.pageSize.toString(),
            'sortBy': params.sortBy as string,
            'sortDir': params.sortDir as string,
        },
        data: filters,
    }).catch((err) => {
        console.log("err", err);
    });

    const newData = map(res.contents, (item: Product) => ({
        ...item,
        key: item.id,
        name: item.name,
        author: item.author,
        description: item.description,
        images: item.images?.map(f => ({...f, url: f?.fileContent})),
        src: getAvatar(item.images as FileUpload[]),
        imagesPreview: mapImagesPreview(item.images || [])

    }));
    return {
        data: newData as DataType[],
        totalRecords: res.totalElements || 0
    }
};