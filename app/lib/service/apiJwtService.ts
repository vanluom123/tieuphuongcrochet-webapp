import {getSession, signOut} from "next-auth/react";
import * as jwtDecode from "jsonwebtoken";
import {JwtPayload} from "jsonwebtoken";

import apiService from "./apiService";
import refreshAccessToken from "@/app/lib/service/refreshTokenService";

// With expiration buffer
const EXPIRATION_BUFFER_SECONDS = 30; // 30 seconds before actual expiration

async function apiJwtService({
                                 baseUrl = process.env.NEXT_PUBLIC_API_URL,
                                 endpoint = '',
                                 method = 'GET',
                                 data = null,
                                 headers = {},
                                 timeout = 20000,
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
        } catch (e) {
            await handleTokenRefreshFailure();
        }
    }

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
        timeout,
        queryParams,
        formData
    });
}

async function handleTokenRefreshFailure() {
    // Logout the user and redirect to login page
    await signOut({
        redirect: true,
        callbackUrl: '/login'
    });
}

export default apiJwtService;