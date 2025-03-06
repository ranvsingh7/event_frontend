import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

// Middleware function to handle token authentication and redirection
export function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const isPublicPath = path === "/auth";
    const token = req.cookies.get("token")?.value || '';

    // Function to decode JWT token
    function decodeJWT(token: string | undefined): { header: any; payload: any; } | null {
        if (!token) return null;

        try {
            const [headerEncoded, payloadEncoded] = token.split('.').slice(0, 2);
            const header = JSON.parse(atob(headerEncoded));
            const payload = JSON.parse(atob(payloadEncoded));
            return { header, payload };
        } catch (error) {
            console.error("Error decoding JWT:", error);
            return null;
        }
    }

    const decoded = decodeJWT(token);

    // Function to check if token is expired
    function isTokenExpired(decodedToken: { payload: { exp: number } }) {
        const currentTimestamp = Math.floor(Date.now() / 1000);
        return decodedToken.payload.exp < currentTimestamp;
    }

    // Redirect if token is expired
    if (decoded && isTokenExpired(decoded)) {
        const response = NextResponse.redirect(new URL('/auth', req.nextUrl));
        // Delete the expired token from cookies
        response.cookies.set("token", "", {
            httpOnly: true,
            expires: new Date(0)
        });
        return response;
    }

    // Redirect to login if accessing protected route without token
    if (!isPublicPath && path !== "/events" && !token) {
        return NextResponse.redirect(new URL('/auth', req.nextUrl));
    }

    // Redirect to dashboard if trying to access public path with token
    if (isPublicPath && token) {
        return NextResponse.redirect(new URL('/', req.nextUrl));
    }

    // Allow access to "/events" regardless of token
    if (path === "/events") {
        return NextResponse.next();
    }
}

// Configuration for middleware execution
export const config = {
    // Regular expression to match URLs where the middleware should be applied
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ]
}
