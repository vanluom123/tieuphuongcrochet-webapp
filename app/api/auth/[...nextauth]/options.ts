import { User } from '@/app/lib/definitions';
import { error } from 'console';
import type { NextAuthOptions, Session } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import * as jwtDecode from 'jsonwebtoken';
import { JWT } from 'next-auth/jwt';
import { API_ROUTES, APP_URL } from '@/app/lib/constant';
import { JwtPayload } from 'jsonwebtoken';

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const response = await fetch(`${APP_URL}/${API_ROUTES.REFRESH_TOKEN}?refreshToken=${token.refreshToken}`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refreshToken: token.refreshToken,
      }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
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
    signIn: "/login",
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
          const res = await fetch(`${APP_URL}/${API_ROUTES.LOGIN}`, {
            method: 'POST',
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" }
          })
          const user = await res.json()
          if (res.ok && user) {
            return user;
          } else {
            console.log('Login failed:', user.message || 'Unknown error');
            return null;
          }
        } catch (error) {
          console.error('Login error:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    // Ref: https://authjs.dev/guides/basics/role-based-access-control#persisting-the-role
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken

        // Decode the access token
        const decoded = jwtDecode.decode(user.accessToken) as JwtPayload;
        if (decoded && Date.now() < (decoded.exp as number)) {
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
      }
      return session
    },
  }
}