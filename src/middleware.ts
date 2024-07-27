import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.redirect(new URL("/api/auth/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/chat",
};

function isAuthenticated(request: NextRequest) {
  return request.cookies.get("next-auth.session-token");
}
