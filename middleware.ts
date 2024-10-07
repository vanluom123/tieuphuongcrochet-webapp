// Ref: https://next-auth.js.org/configuration/nextjs#advanced-usage
import { withAuth, NextRequestWithAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    // `withAuth` augments your `Request` with the user's token.
    async function middleware(request: NextRequestWithAuth) {
        // console.log(request.nextauth.token)

        const role = request?.nextauth?.token?.role;
        const token = request?.nextauth?.token?.accessToken;

        // Set Authorization heade        
        if (token && role) {
            const newHeaders = new Headers(request.headers);
            newHeaders.set("Authorization", `Bearer ${token}`);

            return NextResponse.next({
                headers: newHeaders
            });
        }

    },
    {
        callbacks: {
          authorized: ({ token }) => true,
        },
    }
)

// Applies next-auth only to matching routes - can be regex
// Ref: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = { matcher: ["/dashboard", "/api/:path*"] }