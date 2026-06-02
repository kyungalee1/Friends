import { NextResponse, type NextRequest } from "next/server";
import { verifySessionToken } from "@/lib/auth-session";

const PUBLIC_PATHS = ["/login"];
const PUBLIC_API = ["/api/auth/login", "/api/auth/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_API.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const token = request.cookies.get("session")?.value;
  const userId = token ? await verifySessionToken(token) : null;

  if (pathname.startsWith("/api/")) {
    if (!userId) {
      return NextResponse.json({ error: "로그인이 필요해요" }, { status: 401 });
    }
    return NextResponse.next();
  }

  const isPublicPage = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  if (!userId && !isPublicPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (userId && pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
