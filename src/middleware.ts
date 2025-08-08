import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// export async function middleware(req: NextRequest) {
//   return NextResponse.next();
// }
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow requests to public paths without auth
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

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|upload/images|login|api).*)",
  ],
};
