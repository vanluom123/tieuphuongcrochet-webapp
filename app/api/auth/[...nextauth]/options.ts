
import CredentialsProvider from 'next-auth/providers/credentials'
import * as jwtDecode from 'jsonwebtoken';
import { JWT } from 'next-auth/jwt';
import { API_ROUTES, ROUTE_PATH } from '@/app/lib/constant';
import { JwtPayload } from 'jsonwebtoken';
import { NextAuthOptions, User } from 'next-auth';
import fetchApi from '../../fetchApi';

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const response = await fetchApi<JWT>(
      `/${API_ROUTES.REFRESH_TOKEN}?refreshToken=${token.refreshToken}`,
       'POST', 
       {refreshedToken: token.refreshToken})


    const refreshedTokens =  response.data;

    if (response.status !== 200) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.accessToken,
      refreshToken: refreshedTokens.refreshToken ?? token.refreshToken,
    };
  } catch (error) {
    console.error("RefreshAccessTokenError", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const options: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: ROUTE_PATH.LOGIN,
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

        try {
          const res = await fetchApi<User>(API_ROUTES.LOGIN, 'POST', credentials);
          
          const user =  res.data;
          if (res.status === 200 && user) {
            return user;
          } else {
            return null;
          }
        } catch (error) {
          return null;
        }
      }
    })
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken

        // Decode the access token
        const decoded = jwtDecode.decode(user.accessToken) as JwtPayload;
        if (decoded && Date.now() < (decoded.exp as number) * 1000) {
          return token;
        }

        return refreshAccessToken(token);
      }

      return token;
    },
    // If you want to use the role in client components
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;
        session.user.email = token.email as string;
        session.user.accessToken = token.accessToken as string;
      }
      return session
    },
  }
}