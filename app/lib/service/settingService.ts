import { map } from "lodash";
import { API_ROUTES } from "../constant";
import { Banner, DataType, IBannerType, Setting } from "../definitions";
import { notification } from "../notify";
import apiJwtService from "./apiJwtService";

export const fetchBannerTypes = async (): Promise<DataType[]> => {
    const res = await apiJwtService({ endpoint: API_ROUTES.BANNER_TYPES });
    return map(res.data, ({ id, name, createdDate }) => ({
        id,
        name,
        key: id || '',
        createdDate
    }));
};

export const fetchBanners = async (): Promise<Banner[]> => {
    const res = await apiJwtService({ endpoint: API_ROUTES.BANNERS });
    return map(res.data, d => ({
        ...d,
        bannerTypeId: d.bannerType?.id
    }));
};

export const createUpdateBanners = async (banners: Banner[]): Promise<void> => {
    const res = await apiJwtService({
        endpoint: API_ROUTES.BANNERS,
        method: 'POST',
        data: banners
    });
    if (res.success) {
        notification.success({
            message: 'Success',
            description: 'Banners updated successfully'
        })
    } else {
        notification.error({
            message: 'Failed',
            description: 'An error occurred while updating the banner'
        })
    }
};

export const deleteBannerType = async (id: string): Promise<void> => {
    const res = await apiJwtService({
        endpoint: `${API_ROUTES.BANNER_TYPES}/${id}`,
        method: 'DELETE'
    });
    if (res.success) {
        notification.success({ message: 'Success', description: 'Delete banner type successfully' });
    } else {
        notification.error({ message: 'Failed', description: 'An error occurred while deleting the banner type' });
    }
};

export const createUpdateBannerType = async (data: IBannerType): Promise<void> => {
    const res = await apiJwtService({
        endpoint: API_ROUTES.BANNER_TYPES,
        method: 'POST',
        data
    });
    if (res.success) {
        notification.success({ message: 'Success', description: 'Create banner type successfully' });
    } else {
        notification.error({ message: 'Failed', description: 'An error occurred while creating the banner type' });
    }
};

export const fetchSettings = async (): Promise<Setting[]> => {
    const res = await apiJwtService({ endpoint: API_ROUTES.SETTINGS });
    return res.data;
};

export const updateSetting = async (data: Setting): Promise<void> => {
    const res = await apiJwtService({
        endpoint: API_ROUTES.SETTINGS,
        method: 'POST',
        data
    });
    if (res.success) {
        notification.success({ message: 'Success', description: 'Update setting successfully' });
    } else {
        notification.error({ message: 'Failed', description: 'An error occurred while updating the setting' });
    }
};
