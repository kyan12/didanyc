import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PATHS = ["/account/orders", "/account/addresses"];
const SESSION_COOKIE = "dida_session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );

  if (isProtected) {
    const session = request.cookies.get(SESSION_COOKIE);
    if (!session) {
      const loginUrl = new URL("/account", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*"],
};
