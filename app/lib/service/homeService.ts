import {map} from "lodash";
import {API_ROUTES} from "../constant";
import {HomeData, Pattern, Post, Product, ResponseData} from "../definitions";
import {getAvatar} from "../utils";
import apiService from "./apiService";

export const fetchHomeData = async (): Promise<HomeData> => {
    const res: ResponseData<any> = await apiService({
        endpoint: API_ROUTES.HOMES,
        method: 'GET',
        next: {
            revalidate: 60, // 1 minute
            tags: ['home'],
        }
    });

    if (!res.success) {
        return {} as HomeData;
    }

    const freePatterns: Pattern[] = map(res.data.freePatterns, pt => ({
        status: pt.status,
        id: pt.id,
        author: pt.author,
        name: pt.name,
        src: pt.fileContent || pt.images?.[0]?.fileContent,
        username: pt.username,
        userAvatar: pt.userAvatar,
        userId: pt.userId,
    }));

    const products: Product[] = map(res.data.products, prod => ({
        id: prod.id,
        name: prod.name,
        price: prod.price,
        currency_code: prod.currency_code,
        src: prod.fileContent || prod.images?.[0]?.fileContent,
        category: prod.category
    }));

    const blogs: Post[] = map(res.data.blogs, bl => ({
        ...bl,
        src: bl.fileContent || getAvatar(bl.files || [])
    }));
    return {
        freePatterns,
        products,
        blogs,
        banners: res.data.banners,
    };
};
