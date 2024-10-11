import { map } from "lodash";
import { API_ROUTES } from "../constant";
import { Banner, DataType, IBannerType } from "../definitions";
import { notification } from "../notify";
import apiJwtService from "./apiJwtService";

const handleApiError = (err: any) => {
    console.error("API Error:", err);
    notification.error({ message: 'Failed', description: err.message });
    throw err; // Re-throw the error to be caught by the caller
};

export const fetchBannerTypes = async (): Promise<DataType[]> => {
    try {
        const res: IBannerType[] = await apiJwtService({ endpoint: API_ROUTES.BANNER_TYPE });
        return map(res, ({ id, name, createdDate }) => ({
            id,
            name,
            key: id || '',
            createdDate
        }));
    } catch (err) {
        return handleApiError(err);
    }
};

export const fetchBanners = async (): Promise<Banner[]> => {
    try {
        const res = await apiJwtService({ endpoint: API_ROUTES.GETT_ALL_BANNER });
        return map(res, d => ({
            ...d,
            bannerTypeId: d.bannerType?.id
        }));
    } catch (err) {
        return handleApiError(err);
    }
};

export const createUpdateBanners = async (banners: Banner[]): Promise<void> => {
    try {
        const res = await apiJwtService({
            endpoint: API_ROUTES.CU_BANNER,
            method: 'POST',
            data: banners,
        });
        console.log('res createUpdateBanner', res);
    } catch (err) {
        handleApiError(err);
    }
};

export const deleteBannerType = async (id: string): Promise<void> => {
    try {
        await apiJwtService({
            endpoint: `${API_ROUTES.D_BANNER_TYPE}/${id}`,
            method: 'DELETE',
        });
        notification.success({ message: 'Success', description: 'Delete banner type successfully' });
    } catch (err) {
        handleApiError(err);
    }
};

export const createUpdateBannerType = async (data: IBannerType): Promise<void> => {
    try {
        const res = await apiJwtService({
            endpoint: API_ROUTES.CU_BANNER_TYPE,
            method: 'POST',
            data,
        });
        console.log('res createUpdateBannerType', res);
    } catch (err) {
        handleApiError(err);
    }
};
