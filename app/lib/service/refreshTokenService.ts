import apiService from "@/app/lib/service/apiService";
import {API_ROUTES} from "@/app/lib/constant";

export default async function refreshAccessToken(token: string) {
    const res = await apiService({
        baseUrl: process.env.NEXT_PUBLIC_API_URL,
        endpoint: `${API_ROUTES.REFRESH_TOKEN}?refreshToken=${token}`,
        method: 'POST'
    }).catch((err: Error) => {
        console.error(err);
    })

    return {
        accessToken: res.accessToken as string,
        refreshToken: res.refreshToken as string,
    }
}

export async function getRefreshTokenExpired(token: string) {
    const res = await apiService({
        baseUrl: process.env.NEXT_PUBLIC_API_URL,
        endpoint: `${API_ROUTES.REFRESH_TOKEN}/expired?refreshToken=${token}`,
        method: 'GET'
    }).catch((err: Error) => {
        console.error(err);
    })

    return res;
}
