import CredentialsProvider from 'next-auth/providers/credentials'
import { API_ROUTES, ROUTE_PATH } from '@/app/lib/constant';
import { NextAuthOptions } from 'next-auth';
import apiService from '../../../lib/service/apiService';

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
                const res = await apiService({
                    baseUrl: process.env.NEXT_PUBLIC_API_URL,
                    endpoint: API_ROUTES.LOGIN,
                    method: 'POST',
                    data: credentials
                }).catch(() => {
                    return null;
                });
                if (res.success == false) {
                    return null;
                }
                return res.data;
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
                        queryParams: {
                            accessToken: credentials.token
                        }
                    });
                    return res.data;
                } catch (error) {
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                return {
                    ...token,
                    ...user,
                    picture: user.imageUrl
                };
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.accessToken = token.accessToken;
                session.user.refreshToken = token.refreshToken;
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
