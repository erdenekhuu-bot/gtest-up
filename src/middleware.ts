import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const publicPaths = [
    "/login",
    "/api",
    "/_next",
    "/favicon.ico",
    "/upload/images",
  ];

  const isPublic = publicPaths.some((path) => pathname.startsWith(path));
  if (isPublic) return NextResponse.next();

  const token = await getToken({ req, secret: process.env.SECRET });

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/plan", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!login|api|_next/static|_next/image|favicon.ico|upload/images).*)",
  ],
};
