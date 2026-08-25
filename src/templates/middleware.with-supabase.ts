/**
 * Example: brand already has Supabase updateSession.
 * Install: npm install orione-content-link
 *
 * Copy into project root as middleware.ts and adjust import path / matcher
 * to match your brand. Package updates do not overwrite this file.
 */
import { updateSession } from "@/lib/supabase/auth/middleware"
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
