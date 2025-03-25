import apiService from "@/app/lib/service/apiService";
import { API_ROUTES } from "@/app/lib/constant";

export default async function refreshAccessToken(token: string) {
    const res = await apiService({
        baseUrl: process.env.NEXT_PUBLIC_API_URL,
        endpoint: `${API_ROUTES.REFRESH_TOKEN}?refreshToken=${token}`,
        method: 'GET'
    });

    return res;
}