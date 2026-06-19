import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { ROUTE_HANDLERS } from "@/lib/lp/settings"
import { renderDefaultRedirectPage } from "@/lib/lp/config/defaultRedirectPage"

type CampaignRoute = {
  type: string
  landing_page: string | null
  affiliate_url: string | null
}

// ─────────────────────────────────────────────
// Campaigns API helpers
// ─────────────────────────────────────────────

function apiBase(): string {
  const url = process.env.CAMPAIGNS_MNG_URL
  if (!url) throw new Error("CAMPAIGNS_MNG_URL is not set")
  return url.replace(/\/$/, "")
}

function brandToken(): string {
  const t = process.env.CAMPAIGNS_BRAND_TOKEN
  if (!t) throw new Error("CAMPAIGNS_BRAND_TOKEN is not set")
  return t
}

async function resolveLink(
  paf: string,
): Promise<{ found: boolean; active: boolean; route?: CampaignRoute }> {
  const res = await fetch(
    `${apiBase()}/api/public/resolve?paf=${encodeURIComponent(paf)}`,
    { headers: { "x-brand-token": brandToken() }, cache: "no-store" }
  )

  if (res.status === 401) throw new Error("Invalid CAMPAIGNS_BRAND_TOKEN")
  if (!res.ok) throw new Error(`Resolve API error: ${res.status}`)

  const data = await res.json()

  if (!data.found || !data.active) return { found: data.found, active: data.active }

  return {
    found: true,
    active: true,
    route: {
      type:          data.routing_type,
      landing_page:  data.prelander_id  ?? null,
      affiliate_url: data.affiliate_url ?? null,
    },
  }
}

function trackClick(paf: string, request: NextRequest): void {
  const headers: Record<string, string> = {
    "x-brand-token": brandToken(),
    "Content-Type": "application/json",
  }
  const fwd = request.headers.get("x-forwarded-for")
  const ua  = request.headers.get("user-agent")
  const ref = request.headers.get("referer")
  if (fwd) headers["x-forwarded-for"] = fwd
  if (ua)  headers["user-agent"]       = ua
  if (ref) headers["referer"]          = ref

  fetch(`${apiBase()}/api/public/click`, {
    method: "POST",
    headers,
    body: JSON.stringify({ paf }),
  }).catch(err => console.error("[go] click track failed:", err))
}

// ─────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────

function readLandingHtml(prelander: string): string | null {
  try {
    const filePath = path.join(process.cwd(), "public", "lp", prelander, "index.html")
    return fs.readFileSync(filePath, "utf-8")
  } catch {
    return null
  }
}

function html200(body: string): NextResponse {
  return new NextResponse(body, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store, no-cache" },
  })
}

// ─────────────────────────────────────────────
// Handler
// ─────────────────────────────────────────────

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params

  let resolved: { found: boolean; active: boolean; route?: CampaignRoute }
  try {
    resolved = await resolveLink(code)
  } catch (err) {
    console.error("[go] resolve error:", err)
    return new NextResponse("Internal error", { status: 500 })
  }

  if (!resolved.found)  return NextResponse.redirect(new URL("/not-found", request.url))
  if (!resolved.active) return NextResponse.redirect(new URL("/expired",   request.url))

  const { type, affiliate_url, landing_page } = resolved.route!
  trackClick(code, request)

  if (!affiliate_url)
    return new NextResponse("Misconfigured: missing affiliate_url", { status: 500 })

  if (!landing_page)
    return html200(renderDefaultRedirectPage(affiliate_url))

  const handler = ROUTE_HANDLERS[type]
  if (!handler)
    return new NextResponse(`Unknown route type: ${type}`, { status: 400 })

  const raw = readLandingHtml(landing_page)
  if (!raw) return new NextResponse(`Landing not found: ${landing_page}`, { status: 500 })

  return html200(handler(raw, affiliate_url))
}
