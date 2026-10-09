"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import {
  PREVIEW_COOKIE,
  PREVIEW_COOKIE_MAX_AGE,
  credentialsMatch,
  signPreviewSession,
} from "../../lib/previewAuth"

export async function loginAction(formData: FormData): Promise<void> {
  const user = String(formData.get("user") ?? "")
  const password = String(formData.get("password") ?? "")
  const nextRaw = String(formData.get("next") ?? "/")
  const next = nextRaw.startsWith("/") && !nextRaw.startsWith("//") ? nextRaw : "/"

  if (!credentialsMatch(user, password)) {
    redirect(`/login?error=1&next=${encodeURIComponent(next)}`)
  }

  cookies().set(PREVIEW_COOKIE, await signPreviewSession(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: PREVIEW_COOKIE_MAX_AGE,
  })

  redirect(next)
}
