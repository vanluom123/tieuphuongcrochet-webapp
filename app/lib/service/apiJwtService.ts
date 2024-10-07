import { getSession } from "next-auth/react";
import { JwtPayload } from "jsonwebtoken";
import * as jwtDecode from 'jsonwebtoken';
import { JWT } from "next-auth/jwt";
import { Session, User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";

import apiService from "./apiService";
import { options as authOptions } from '@/app/api/auth/[...nextauth]/options';

async function apiJwtService<T = unknown>({
    baseUrl = process.env.NEXT_PUBLIC_API_URL,
    endpoint = '',
    method = 'GET',
    data = null,
    headers = {},
    timeout = 20000,
    queryParams = {},
}: {
    baseUrl?: string;
    endpoint?: string;
    method?: string;
    data?: T | null;
    headers?: Record<string, string>;
    timeout?: number;
    queryParams?: Record<string, string>;
}) {
    const session = await getSession();
    let accessToken = session?.user?.accessToken;
    
    // Decode the access token
    const decoded = jwtDecode.decode(accessToken as string) as JwtPayload;
    if (decoded && Date.now() >= (decoded.exp as number) * 1000) {
        const refreshToken = session?.user.refreshToken;

        if(authOptions.callbacks?.jwt) {
            const updatedToken = await authOptions.callbacks.jwt({
                token: {
                    ...session?.user,
                    accessToken: accessToken,
                    refreshToken: refreshToken
                } as JWT,
                user: {
                    ...session?.user,
                    accessToken: accessToken,
                    refreshToken: refreshToken
                } as User,
                account: null,
            });

            if (authOptions.callbacks?.session) {
                await authOptions.callbacks.session({
                    session: session as Session,
                    token: updatedToken,
                    user: {
                        ...session?.user,
                        accessToken: updatedToken.accessToken,
                        refreshToken: updatedToken.refreshToken
                    } as AdapterUser,
                    newSession: null,
                    trigger: "update"
                });
                // The session is now updated with the new access token
            }
            accessToken = updatedToken.accessToken;            
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
        queryParams
    });
}

export default apiJwtService;