import { NextRequest, NextResponse } from "next/server"
import {
  PREVIEW_COOKIE,
  isPreviewAuthConfigured,
  readPreviewSession,
} from "./lib/previewAuth"

export async function middleware(request: NextRequest) {
  if (process.env.NODE_ENV === "development" && !isPreviewAuthConfigured()) {
    return NextResponse.next()
  }

  const session = await readPreviewSession(request.cookies.get(PREVIEW_COOKIE)?.value)
  if (session) return NextResponse.next()

  const login = new URL("/login", request.url)
  const next = request.nextUrl.pathname + request.nextUrl.search
  if (next !== "/login") login.searchParams.set("next", next)
  return NextResponse.redirect(login)
}

export const config = {
  matcher: ["/((?!login|_next/static|_next/image|favicon.ico).*)"],
}
