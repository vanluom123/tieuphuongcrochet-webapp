
import CredentialsProvider from 'next-auth/providers/credentials'
import * as jwtDecode from 'jsonwebtoken';
import { API_ROUTES, ROUTE_PATH } from '@/app/lib/constant';
import { JwtPayload } from 'jsonwebtoken';
import { NextAuthOptions } from 'next-auth';
import apiService from '../../../lib/service/apiService';
import refreshAccessToken from '../../refreshToken';

export const options: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: ROUTE_PATH.LOGIN
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
          console.log("error", error);
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
      if ( user) {
        token.role = user.role
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken

        // Decode the access token
        const decoded = jwtDecode.decode(user.accessToken) as JwtPayload;
        if (decoded && Date.now() >= (decoded.exp as number) * 1000) {
          return await refreshAccessToken(token);
        }
      }

      return token;
    },
    // If you want to use the role in client components
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;
        session.user.email = token.email as string;
        session.user.accessToken = token.accessToken as string;
        session.user.refreshToken = token.refreshToken as string;
      }
      return session
    },
  }
}