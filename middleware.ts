// Ref: https://next-auth.js.org/configuration/nextjs#advanced-usage
import { getToken } from "next-auth/jwt";
import { withAuth, NextRequestWithAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import { ROUTE_PATH, USER_ROLES } from "./app/lib/constant";

export default withAuth(
    // `withAuth` augments your `Request` with the user's token.
    async function middleware(request: NextRequestWithAuth) {
        // Bỏ qua các request tới static files
        if (request.nextUrl.pathname.startsWith('/_next/')) {
            return NextResponse.next();
        }
        // Bỏ qua sitemap.xml
        if (request.nextUrl.pathname === '/sitemap.xml') {
            return NextResponse.next();
        }

        // Lấy token từ session
        const token = await getToken({
            req: request,
            secret: process.env.NEXTAUTH_SECRET
        });

        // Kiểm tra token expiration
        // const decoded = jwtDecode.decode(token?.accessToken as string) as JwtPayload;
        // if (decoded && Date.now() >= (decoded.exp as number) * 1000) {
        //     // Token đã hết hạn, redirect về trang login
        //     return NextResponse.redirect(new URL(ROUTE_PATH.LOGIN, request.url))
        // }

        // Kiểm tra nếu route bắt đầu bằng /dashboard
        if (request.nextUrl.pathname.startsWith(ROUTE_PATH.DASHBOARD)) {
            console.log('Dashboard route detected');

            if (!token) {
                console.log('No token found, redirecting to login');

                // Nếu chưa đăng nhập, redirect về trang login
                return NextResponse.redirect(new URL(ROUTE_PATH.LOGIN, request.url))
            }
            console.log('Checking role:', token?.role);

            // Kiểm tra role của user (giả sử role được lưu trong token)
            if (token.role !== USER_ROLES.ADMIN) {
                // Nếu không phải admin, redirect về trang chủ
                console.log('Not admin, redirecting to home');
                return NextResponse.redirect(new URL(ROUTE_PATH.HOME, request.url))
            }
        }

        return NextResponse.next()
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
)

// Applies next-auth only to matching routes - can be regex
// Ref: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
// Chỉ định các route cần được bảo vệ
export const config = {
    matcher: ['/dashboard/:path*', 
        '/((?!sitemap.xml|api/auth).*)/*',
    ]
}