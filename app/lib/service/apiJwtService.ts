import { getSession, signOut } from "next-auth/react";
import * as jwtDecode from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";

import apiService from "./apiService";
import refreshAccessToken from "@/app/lib/service/refreshTokenService";
import { ROUTE_PATH } from "../constant";

// With expiration buffer
const EXPIRATION_BUFFER_SECONDS = 30; // 30 seconds before actual expiration

export async function handleTokenRefresh() {
    // Logout the user and redirect to login page
    const session = await getSession();
    let accessToken = session?.user.accessToken;

    // Decode the access token
    const decoded = jwtDecode.decode(accessToken as string) as JwtPayload;
    const isTokenExpired = !decoded ||
        (decoded.exp &&
            Date.now() >= ((decoded.exp as number) - EXPIRATION_BUFFER_SECONDS) * 1000);

    if (isTokenExpired) {
        try {
            if (session == null) {
                throw new Error('Session is not null');
            }
            const refreshToken = session.user.refreshToken;
            const tokenResponse = await refreshAccessToken(refreshToken as string);
            accessToken = tokenResponse.accessToken;
            session.user.accessToken = tokenResponse.accessToken;
            session.user.refreshToken = tokenResponse.refreshToken;
            return accessToken;
        } catch (e) {
            await handleTokenRefreshFailure();
        }
    }

    return accessToken;
}

async function apiJwtService({
    baseUrl = process.env.NEXT_PUBLIC_API_URL,
    endpoint = '',
    method = 'GET',
    data = null,
    headers = {},
    queryParams = {},
    formData
}: {
    baseUrl?: string;
    endpoint?: string;
    method?: string;
    data?: any | null;
    headers?: Record<string, string>;
    timeout?: number;
    queryParams?: Record<string, string>;
    formData?: FormData;
}) {
    let accessToken = await handleTokenRefresh();
    const options: RequestInit = {
        method: method,
        headers: {
            ...headers,
            'Authorization': `Bearer ${accessToken}`
        }
    };

    return apiService({
        baseUrl,
        endpoint,
        method,
        data,
        headers: options.headers as Record<string, string>,
        queryParams,
        formData
    });
}

export async function handleTokenRefreshFailure() {
    // Logout the user and redirect to login page
    await signOut({
        redirect: true,
        callbackUrl: ROUTE_PATH.LOGIN
    });
}

export default apiJwtService;