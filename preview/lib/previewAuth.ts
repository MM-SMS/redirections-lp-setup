export const PREVIEW_COOKIE = "preview_session"
const DEFAULT_SESSION_HOURS = 8

const encoder = new TextEncoder()

function previewUser(): string {
  return process.env.PREVIEW_USER?.trim() ?? ""
}

function previewPassword(): string {
  return process.env.PREVIEW_PASSWORD ?? ""
}

export function previewSessionSeconds(): number {
  const hours = Number(process.env.PREVIEW_SESSION_HOURS ?? DEFAULT_SESSION_HOURS)
  if (!Number.isFinite(hours) || hours <= 0) return DEFAULT_SESSION_HOURS * 60 * 60
  return Math.round(hours * 60 * 60)
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

export interface PreviewSession {
  user: string
  exp: number
}

export async function signPreviewSession(user: string, exp: number): Promise<string> {
  const sig = await hmacHex(`${previewUser()}:${previewPassword()}`, `${user}.${exp}`)
  return `${exp}.${user}.${sig}`
}

export async function readPreviewSession(token: string | undefined): Promise<PreviewSession | null> {
  if (!token || !isPreviewAuthConfigured()) return null
  const first = token.indexOf(".")
  const last = token.lastIndexOf(".")
  if (first <= 0 || last <= first) return null

  const exp = Number(token.slice(0, first))
  const user = token.slice(first + 1, last)
  const sig = token.slice(last + 1)
  if (!Number.isFinite(exp) || exp * 1000 <= Date.now()) return null
  if (!safeEqual(user, previewUser())) return null

  const expected = await hmacHex(`${previewUser()}:${previewPassword()}`, `${user}.${exp}`)
  if (!safeEqual(sig, expected)) return null
  return { user, exp }
}
