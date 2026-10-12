"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import {
  PREVIEW_COOKIE,
  credentialsMatch,
  previewSessionSeconds,
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

  const maxAge = previewSessionSeconds()
  const exp = Math.floor(Date.now() / 1000) + maxAge
  cookies().set(PREVIEW_COOKIE, await signPreviewSession(user, exp), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  })

  redirect(next)
}

export async function logoutAction(): Promise<void> {
  cookies().set(PREVIEW_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  })
  redirect("/login")
}
