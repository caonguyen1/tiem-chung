import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * First gate for /admin: a request without a session cookie is sent to the sign-in page before
 * anything renders. It only checks that the cookie exists; whether the session is valid is
 * decided by `requireAdmin()` in the data layer, which every admin page calls before reading data.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const open = pathname === "/admin/dang-nhap";
  if (!open && !request.cookies.has("tt_admin_session")) {
    return NextResponse.redirect(new URL("/admin/dang-nhap", request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin", "/admin/:path*"] };
