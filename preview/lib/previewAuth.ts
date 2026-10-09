export const PREVIEW_COOKIE = "preview_session"
export const PREVIEW_COOKIE_MAX_AGE = 60 * 60 * 24 * 7

const encoder = new TextEncoder()

function previewUser(): string {
  return process.env.PREVIEW_USER?.trim() ?? ""
}

function previewPassword(): string {
  return process.env.PREVIEW_PASSWORD ?? ""
}

export function isPreviewAuthConfigured(): boolean {
  return Boolean(previewUser() && previewPassword())
}

function safeEqual(left: string, right: string): boolean {
  if (left.length !== right.length) return false
  let mismatch = 0
  for (let i = 0; i < left.length; i++) mismatch |= left.charCodeAt(i) ^ right.charCodeAt(i)
  return mismatch === 0
}

export function credentialsMatch(user: string, password: string): boolean {
  if (!isPreviewAuthConfigured()) return false
  return safeEqual(user, previewUser()) && safeEqual(password, previewPassword())
}

async function hmacHex(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  )
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(message))
  return Array.from(new Uint8Array(sig), (byte) => byte.toString(16).padStart(2, "0")).join("")
}

export async function signPreviewSession(user: string): Promise<string> {
  const sig = await hmacHex(`${previewUser()}:${previewPassword()}`, user)
  return `${user}.${sig}`
}

export async function previewSessionIsValid(token: string | undefined): Promise<boolean> {
  if (!token || !isPreviewAuthConfigured()) return false
  const dot = token.lastIndexOf(".")
  if (dot <= 0) return false
  const user = token.slice(0, dot)
  const sig = token.slice(dot + 1)
  if (!safeEqual(user, previewUser())) return false
  const expected = await hmacHex(`${previewUser()}:${previewPassword()}`, user)
  return safeEqual(sig, expected)
}
