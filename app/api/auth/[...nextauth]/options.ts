import CredentialsProvider from 'next-auth/providers/credentials'
import { API_ROUTES, ROUTE_PATH } from '@/app/lib/constant';
import { NextAuthOptions } from 'next-auth';
import apiService from '../../../lib/service/apiService';
import refreshAccessToken from '../../refreshToken';
import * as jwtDecode from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';

export const options: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: ROUTE_PATH.LOGIN,
    error: ROUTE_PATH.ERROR
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
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
          data: credentials,
        }).catch((error) => {
          return null;
        });

        if (res == null) {
          return null;
        }

        return res;
      }
    })
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Copy all user properties to token on initial sign in
        return {
          ...token,
          ...user
        };
      }

      // On subsequent calls, check token expiration
      const decoded = jwtDecode.decode(token.accessToken as string) as JwtPayload;
      if (decoded && Date.now() >= (decoded.exp as number) * 1000) {
        return await refreshAccessToken(token);
      }

      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        // Copy all token properties to session.user
        session.user.accessToken = token.accessToken;
        session.user.refreshToken = token.refreshToken;
        session.user.name = token.name;
        session.user.email = token.email;
      }
      return session;
    },
  }
}