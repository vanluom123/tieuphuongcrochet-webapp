import { API_ROUTES } from "../constant";
import { DataType, ListParams, ListResponse, Post } from "../definitions";
import fetchData from "../../api/fetchData";
import { map } from "lodash";
import { getAvatar } from "../utils";

export const fetchBlogs = async (params: ListParams): Promise<{data: DataType[], totalRecords: number}> => {
    const res: ListResponse<Post>  = await fetchData({
        endpoint: `${API_ROUTES.BLOG}/${API_ROUTES.PAGINATION}`,
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

    const newData = res.contents?.map(item => ({
        ...item,
        key: item.id,
        name: item.title,
        content: item.content,
        createdDate: item.createdDate,
        src: item.files?.[0]?.fileContent,
    }));
    
    return {
        data: newData as DataType[],
        totalRecords: res.totalElements || 0
    }
};

export const fetchPostDetail = async (id: string): Promise<Post> => {
    const res: Post = await fetchData({
        endpoint: `${API_ROUTES.BLOG}/${API_ROUTES.DETAIL}?id=${id}`,
        method: 'GET',
    });
    const newData = {
        ...res,
        src: getAvatar(res.files || []),
        files: res.files ? map(res.files, f => ({...f, url: f?.fileContent})) : [],
    };
    return newData;
};
