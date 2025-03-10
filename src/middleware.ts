import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;

    // Define public paths that anyone can access
    const isPublicPath =
        path === "/auth" ||
        path === "/contact-us" ||
        path === "/terms-and-condition" ||
        path === "/refund-and-cancellation" ||
        path === "/events" ||
        path === "/";

    const token = req.cookies.get("token")?.value || "";

    // Function to decode JWT token
    function decodeJWT(token: string | undefined): { header: any; payload: any } | null {
        if (!token) return null;

        try {
            const [headerEncoded, payloadEncoded] = token.split(".").slice(0, 2);
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
        const response = NextResponse.redirect(new URL("/auth", req.nextUrl));
        // Delete the expired token from cookies
        response.cookies.set("token", "", {
            httpOnly: true,
            expires: new Date(0),
        });
        return response;
    }

    // Redirect logged-in users away from /auth to /
    if (path === "/auth" && token) {
        return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }

    // Redirect to login if accessing protected route without token
    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL("/auth", req.nextUrl));
    }

    // Allow access to public routes for everyone
    if (isPublicPath) {
        return NextResponse.next();
    }

    // Allow access to other routes if authenticated
    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
