import { error } from 'console';
import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

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
          placeholder: "Tham Phuong"
        }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const res = await fetch("https://tieuphuongcrochet-90b41ee4488a.herokuapp.com/auth/login", {
            method: 'POST',
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" }
          })
          const user = await res.json()
          console.log(user, 'login user');
          if (res.ok && user) {
            console.log('Login success');
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
}