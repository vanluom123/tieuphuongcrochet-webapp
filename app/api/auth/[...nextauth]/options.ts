import type { NextAuthOptions } from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'

export const options: NextAuthOptions = {
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {
                    label: "Email:",
                    type: "text",
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
                  
                  const res = await fetch("https://tieuphuongcrochet-90b41ee4488a.herokuapp.com/auth/login", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      email: credentials.email,
                      password: credentials.password,
                    }),
                  });
          
                  const user = await res.json();
          
                  if (res.ok && user) {
                    console.log('user', user);
                    return user;
                  } else {
                    console.log('Login failed');
                    return null;
                }
            }
        })
    ],
    pages: {
        signIn: "/login",
      },
      callbacks: {
        async jwt({ token, user }) {
          if (user) {
            token.id = user.id;
            token.email = user.email;
          }
          return token;
        },
        async session({ session, token }) {
          if (token && session.user) {
            session.user = {
              ...session.user,
              id: token.id as string,
              email: token.email as string
            } as {
              id: string;
              email: string;
              name?: string | null;
              image?: string | null;
            };
          }
          return session;
        },
      },
}