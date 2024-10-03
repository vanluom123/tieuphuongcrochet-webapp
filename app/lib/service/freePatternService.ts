import { map } from "lodash";
import { API_ROUTES } from "../constant";
import { FileUpload, ListParams, DataType, Pattern } from "../definitions";
import { getAvatar, mapImagesPreview } from "../utils";
import fetchData from "../../api/fetchData";

export const fetchFreePatterns = async (params: ListParams): Promise<{data: DataType[], totalRecords: number}> => {
    const res = await fetchData({
        endpoint: `${API_ROUTES.FREE_PATTERN}/${API_ROUTES.PAGINATION}`,
        method: 'POST',
        queryParams: {
            'pageNo': params.pageNo.toString(),
            'pageSize': params.pageSize.toString(),
            'sortBy': params.sortBy as string,
            'sortDir': params.sortDir as string,
        },
        data: params.filters,
    }).catch((err) => {
        console.log("err", err);
    });

    const newData = map(res.contents, item => ({
        ...item,
        key: item.id,
        files: item.files ? map(item.files, f => ({...f,url: f?.fileContent})) : [],
        src: getAvatar(item.images as FileUpload[]),
        imagesPreview: mapImagesPreview(item.images || [])
    }));
    
    return {
        data: newData as DataType[],
        totalRecords: res.totalElements || 0
    }
};

export const fetchFreePatternDetail = async (id: string): Promise<Pattern> => {
    const data = await fetchData({
        endpoint: `${API_ROUTES.FREE_PATTERN}/${API_ROUTES.DETAIL}?id=${id}`,
        method: 'GET',
    });

    const newData: Pattern = {
        ...data,
        src: getAvatar(data.images as FileUpload[]),
        files: data.files ? map(data.files, f => ({...f, url: f?.fileContent})) : [],
        images: data.images ? map(data.images, f => ({...f, url: f?.fileContent})) : [],
    };
    
    return newData;
};