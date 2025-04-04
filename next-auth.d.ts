
import { DefaultSession, DefaultUser } from "next-auth"
import { JWT, DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
    interface Session {
        user: {
            id?: string,
            name?: string | null,
            role?: string | null,
            email?: string | null,
            accessToken?: string | null,
            refreshToken?: string | null,
            imageUrl?: string | null,
            phone?: string | null,
            birthDate?: string | null,
            gender?: string | null,
            backgroundImageUrl?: string | null
        } & DefaultSession
    }

    interface User extends DefaultUser {
        role?: string | null,
        accessToken?: string | null,
        refreshToken?: string | null,
        imageUrl?: string | null,
        backgroundImageUrl?: string | null
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        userId?: string,
        role?: string | null,
        accessToken?: string | null,
        refreshToken?: string | null,
        backgroundImageUrl?: string | null
    }
}