import CredentialsProvider from 'next-auth/providers/credentials'
import * as jwtDecode from 'jsonwebtoken'
import { JwtPayload } from 'jsonwebtoken'
import { API_ROUTES, ROUTE_PATH } from '@/app/lib/constant';
import { NextAuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import apiService, { ApiError } from '../../../lib/service/apiService';
import refreshAccessToken from '@/app/lib/service/refreshTokenService';

const EXPIRATION_BUFFER_SECONDS = 30

// Runs server-side inside the NextAuth JWT flow: the refresh token never leaves
// the encrypted session cookie, only the access token is handed to the client.
async function ensureFreshAccessToken(token: JWT): Promise<JWT> {
    const accessToken = token.accessToken as string | null | undefined;
    if (!accessToken || !token.refreshToken) {
        return token;
    }

    const decoded = jwtDecode.decode(accessToken) as JwtPayload | null
    const isExpired =
        !decoded ||
        (decoded.exp && Date.now() >= ((decoded.exp as number) - EXPIRATION_BUFFER_SECONDS) * 1000)

    if (!isExpired) {
        return token;
    }

    try {
        const res = await refreshAccessToken(token.refreshToken as string);
        if (res?.success && res.data?.accessToken) {
            token.accessToken = res.data.accessToken;
            if (res.data.refreshToken) {
                token.refreshToken = res.data.refreshToken;
            }
        }
        // On failure keep the current token: the client expiry check in
        // apiJwtService decides when to sign out.
    } catch (e) {
        console.error('Server-side token refresh failed:', e);
    }

    return token;
}

export const options: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: ROUTE_PATH.LOGIN,
        error: ROUTE_PATH.ERROR
    },
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "credentials",
            credentials: {
                email: {
                    label: "Email:",
                    type: "email",
                    placeholder: "Enter your email"
                },
                password: {
                    label: "Password:",
                    type: "password",
                    placeholder: "Enter your password"
                }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }
                try {
                    const res = await apiService({
                        baseUrl: process.env.NEXT_PUBLIC_API_URL,
                        endpoint: API_ROUTES.LOGIN,
                        method: 'POST',
                        data: credentials
                    });
                    if (res?.success === false) {
                        if (res.code === 6 || res.message?.includes('not verified')) {
                            throw new Error('EMAIL_NOT_VERIFIED');
                        }
                        return null;
                    }
                    return res.data;
                } catch (error: any) {
                    if (error instanceof ApiError) {
                        if (error.code === 6 || error.message?.includes('not verified')) {
                            throw new Error('EMAIL_NOT_VERIFIED');
                        }
                        return null;
                    }
                    if (error?.message === 'EMAIL_NOT_VERIFIED') {
                        throw error;
                    }
                    return null;
                }
            }
        }),
        CredentialsProvider({
            id: "custom-oauth2",
            name: "custom-oauth2",
            credentials: {
                token: { label: "Token", type: "text" }
            },
            async authorize(credentials) {
                if (!credentials?.token) {
                    return null;
                }
                try {
                    const res = await apiService({
                        baseUrl: process.env.NEXT_PUBLIC_API_URL,
                        endpoint: '/api/v1/auth/me',
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${credentials.token}`
                        },
                        retry: 0
                    });
                    return res.data;
                } catch (error) {
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token = {
                    ...token,
                    ...user,
                    picture: user.imageUrl
                };
            }
            if (trigger === "update" && session?.role) {
                token.role = session.role;
            }
            return ensureFreshAccessToken(token);
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.accessToken = token.accessToken;
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.imageUrl = token.picture;
                session.user.role = token.role;
                session.user.id = token.userId;
            }
            return session;
        }
    }
}
