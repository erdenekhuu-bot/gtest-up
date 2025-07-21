import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function middleware(req: NextRequest) {
  // const token = await getToken({ req, secret: process.env.SECRET });
  // const isExpired = token?.exp && Date.now() >= Number(token.exp) * 1000;
  // console.log(token);

  // if (req.nextUrl.pathname === "/") {
  //   return NextResponse.redirect(new URL("/plan", req.nextUrl));
  // }
  // if (isExpired) {
  //   return NextResponse.redirect(new URL("/login", req.nextUrl));
  // }
  NextResponse.next();
}
