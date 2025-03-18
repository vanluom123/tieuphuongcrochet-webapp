import { API_ROUTES } from "../constant";
import { ResponseData } from "../definitions";
import apiService from "./apiService";

export async function resendVerificationEmail(email: string)
    : Promise<ResponseData> {
    const res: ResponseData = await apiService({
        endpoint: API_ROUTES.RESEND_VERIFICATION,
        method: 'GET',
        queryParams: {
            email
        }
    });

    return res;
}