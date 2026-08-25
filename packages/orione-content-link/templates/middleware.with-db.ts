/**
 * Auto-written by orione-content-link (withDb).
 * Do not edit by hand — change flags in package.json and reinstall.
 */
import { updateSession } from "__UPDATE_SESSION_FROM__"
import { handleContentLink } from "orione-content-link"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const content = await handleContentLink(request)
  if (content) return content
  return updateSession(request)
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|studio|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
