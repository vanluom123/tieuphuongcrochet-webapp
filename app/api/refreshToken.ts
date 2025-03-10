import { JWT } from "next-auth/jwt";
import { API_ROUTES } from "../lib/constant";
import apiService from "../lib/service/apiService";

export default async function refreshAccessToken(token: JWT): Promise<JWT> {
    const res = await apiService({
        baseUrl: process.env.NEXT_PUBLIC_API_URL,
        endpoint: `${API_ROUTES.REFRESH_TOKEN}?refreshToken=${token.refreshToken}`,
        method: 'POST',
        data: { refreshedToken: token.refreshToken },
    }).catch((error) => {
        return {
            ...token,
            error: "RefreshAccessTokenError",
        };
    });

    if (res.success == false) {
        return {
            ...token,
            error: "RefreshAccessTokenError",
        };
    }

    return {
        ...token,
        accessToken: res.data.accessToken || res.data.jwtToken,
        refreshToken: res.data.refreshToken ?? token.refreshToken,
    };
}
