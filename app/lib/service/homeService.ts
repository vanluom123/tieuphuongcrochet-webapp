import { map } from "lodash";
import { API_ROUTES } from "../constant";
import { Product, Pattern, Post, HomeData } from "../definitions";
import { getAvatar, mapImagesPreview } from "../utils";
import apiService from "./apiService";

export const fetchHomeData = async (): Promise<HomeData> => {
    const data = await apiService({
        endpoint: API_ROUTES.HOME,
        method: 'GET',
    }).catch((err) => {
        console.log("err", err);
        return {} as HomeData;
    });

    const freePatterns: Pattern[] = map(data.freePatterns, pt => ({
        status: pt.status,
        id: pt.id,
        author: pt.author,
        name: pt.name,
        src: pt.images?.[0]?.fileContent,
        imagesPreview: mapImagesPreview(pt.images || [])
    }));

    const products: Product[] = map(data.products, prod => ({
        id: prod.id,
        name: prod.name,
        price: prod.price,
        currency_code: prod.currency_code,
        src: prod.images?.[0]?.fileContent,
        imagesPreview: mapImagesPreview(prod.images || []),
        category: prod.category
    }));

    const blogs: Post[] = map(data.blogs, bl => ({
        ...bl,
        src: getAvatar(bl.files || [])
    }));
    return {
        freePatterns,
        products,
        blogs,
        banners: data.banners,
    };
};
