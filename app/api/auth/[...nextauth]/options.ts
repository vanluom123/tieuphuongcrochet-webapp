import CredentialsProvider from 'next-auth/providers/credentials'
import { API_ROUTES, ROUTE_PATH } from '@/app/lib/constant';
import { NextAuthOptions } from 'next-auth';
import { encode as encodeJwt, JWT } from 'next-auth/jwt';
import apiService, { ApiError } from '../../../lib/service/apiService';
import refreshAccessToken from '@/app/lib/service/refreshTokenService';
import { isAccessTokenExpired } from '@/app/lib/auth/jwt';
import { isEmailNotVerified } from '@/app/lib/auth/emailVerification';

const SESSION_MAX_AGE_DEFAULT = 86400; // 1 day (seconds)
const SESSION_MAX_AGE_REMEMBER_ME = 2592000; // 30 days (seconds)

const inFlightRefreshMap = new Map<string, Promise<{ accessToken: string; refreshToken?: string } | null>>();

async function ensureFreshAccessToken(token: JWT): Promise<JWT> {
    const accessToken = token.accessToken as string | null | undefined;
    const refreshToken = token.refreshToken as string | null | undefined;
    if (!accessToken || !refreshToken) {
        return token;
    }

    if (!isAccessTokenExpired(accessToken)) {
        return token;
    }

    try {
        let refreshPromise = inFlightRefreshMap.get(refreshToken);
        if (!refreshPromise) {
            refreshPromise = refreshAccessToken(refreshToken).then((res) => {
                if (res?.success && res.data?.accessToken) {
                    return {
                        accessToken: res.data.accessToken,
                        refreshToken: res.data.refreshToken,
                    };
                }
                return null;
            }).finally(() => {
                inFlightRefreshMap.delete(refreshToken);
            });
            inFlightRefreshMap.set(refreshToken, refreshPromise);
        }

        const freshTokens = await refreshPromise;
        if (freshTokens?.accessToken) {
            token.accessToken = freshTokens.accessToken;
            if (freshTokens.refreshToken) {
                token.refreshToken = freshTokens.refreshToken;
            }
            delete token.error;
        } else {
            token.error = 'RefreshAccessTokenError';
        }
    } catch (e) {
        console.error('Server-side token refresh failed:', e);
        token.error = 'RefreshAccessTokenError';
    }

    return token;
}

export const options: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: ROUTE_PATH.LOGIN,
        error: ROUTE_PATH.ERROR
    },
    session: {
        maxAge: SESSION_MAX_AGE_REMEMBER_ME,
    },
    jwt: {
        async encode(params) {
            // NextAuth resets exp on every encode; preserve the deadline chosen at sign-in.
            const sessionExpiresAt = params.token?.sessionExpiresAt;
            const maxAge = typeof sessionExpiresAt === 'number'
                ? Math.max(0, sessionExpiresAt - Math.floor(Date.now() / 1000))
                : params.maxAge;
            return encodeJwt({ ...params, maxAge });
        },
    },
    events: {
        async signOut({ token }) {
            if (!token.refreshToken) {
                return;
            }
            try {
                await apiService({
                    baseUrl: process.env.NEXT_PUBLIC_API_URL,
                    endpoint: API_ROUTES.LOGOUT,
                    method: 'POST',
                    data: { refreshToken: token.refreshToken },
                    headers: token.accessToken
                        ? { Authorization: `Bearer ${token.accessToken}` }
                        : {},
                    retry: 0,
                });
            } catch (error) {
                console.error('Server-side logout failed:', error);
            }
        },
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
                },
                rememberMe: {
                    label: "Remember Me",
                    type: "text"
                }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }
                const rememberMe = credentials.rememberMe === 'true';
                try {
                    const res = await apiService({
                        baseUrl: process.env.NEXT_PUBLIC_API_URL,
                        endpoint: API_ROUTES.LOGIN,
                        method: 'POST',
                        data: {
                            email: credentials.email,
                            password: credentials.password,
                            rememberMe,
                        }
                    });
                    if (res?.success === false) {
                        if (isEmailNotVerified(res)) {
                            throw new Error('EMAIL_NOT_VERIFIED');
                        }
                        return null;
                    }
                    // Attach rememberMe flag to the user object for JWT callback
                    return { ...res.data, rememberMe };
                } catch (error: unknown) {
                    if (error instanceof ApiError && (isEmailNotVerified(error) || isEmailNotVerified(error.data))) {
                        throw new Error('EMAIL_NOT_VERIFIED');
                    }
                    const msg = error instanceof Error ? error.message : '';
                    if (msg === 'EMAIL_NOT_VERIFIED' || msg.includes('not verified') || msg.includes('"code":6') || msg.includes('code: 6')) {
                        throw new Error('EMAIL_NOT_VERIFIED');
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
                const rememberMe = 'rememberMe' in user
                    && (user as Record<string, unknown>).rememberMe === true;
                token = {
                    ...token,
                    ...user,
                    picture: user.imageUrl,
                    rememberMe,
                    sessionExpiresAt: Math.floor(Date.now() / 1000)
                        + (rememberMe ? SESSION_MAX_AGE_REMEMBER_ME : SESSION_MAX_AGE_DEFAULT),
                };
            }
            if (trigger === "update" && session?.role) {
                token.role = session.role;
            }
            return ensureFreshAccessToken(token);
        },
        async session({ session, token }) {
            if (token.error) {
                session.error = token.error;
            }
            if (session.user) {
                session.user.accessToken = token.accessToken;
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.imageUrl = token.picture;
                session.user.role = token.role;
                session.user.id = token.userId;
            }
            if (typeof token.sessionExpiresAt === 'number') {
                session.expires = new Date(token.sessionExpiresAt * 1000).toISOString();
            }
            return session;
        }
    }
}
