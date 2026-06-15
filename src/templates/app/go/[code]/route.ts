import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { injectClickBankBridgeScript } from "@/lib/lp/config/clickbankBridgeConfig"
import { injectClickBankHostedScript } from "@/lib/lp/config/clickbankHostedConfig"
import { injectSweeplyHostedScript } from "@/lib/lp/config/sweeplyHostedConfig"
import { getBrand, type RouteType } from "@/lib/lp/settings"

type CampaignRoute = {
  type: RouteType
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

function linkSecret(): string {
  const s = process.env.LINK_PUBLIC_SECRET
  if (!s) throw new Error("LINK_PUBLIC_SECRET is not set")
  return s
}

async function resolveLink(
  paf: string,
  brand: string,
): Promise<{ found: boolean; active: boolean; route?: CampaignRoute }> {
  const res = await fetch(
    `${apiBase()}/api/public/resolve?brand=${encodeURIComponent(brand)}&paf=${encodeURIComponent(paf)}`,
    { headers: { "x-link-secret": linkSecret() }, cache: "no-store" }
  )

  if (res.status === 401) throw new Error("Invalid LINK_PUBLIC_SECRET")
  if (!res.ok) throw new Error(`Resolve API error: ${res.status}`)

  const data = await res.json()

  if (!data.found || !data.active) return { found: data.found, active: data.active }

  return {
    found: true,
    active: true,
    route: {
      type: data.routing_type as RouteType,
      landing_page: data.prelander_id ?? null,
      affiliate_url: data.affiliate_url ?? null,
    },
  }
}

function trackClick(paf: string, brand: string, request: NextRequest): void {
  const headers: Record<string, string> = {
    "x-link-secret": linkSecret(),
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
    body: JSON.stringify({ brand, paf }),
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

  let brand: string
  try {
    brand = getBrand(request.headers.get("host") ?? "")
  } catch (err) {
    console.error("[go] unknown domain:", err)
    return new NextResponse("Unknown brand", { status: 404 })
  }

  let resolved: { found: boolean; active: boolean; route?: CampaignRoute }
  try {
    resolved = await resolveLink(code, brand)
  } catch (err) {
    console.error("[go] resolve error:", err)
    return new NextResponse("Internal error", { status: 500 })
  }

  if (!resolved.found)   return NextResponse.redirect(new URL("/not-found", request.url))
  if (!resolved.active)  return NextResponse.redirect(new URL("/expired", request.url))

  const route = resolved.route!
  trackClick(code, brand, request)

  const { affiliate_url, landing_page } = route

  switch (route.type) {
    case "clickbankBridge": {
      if (!affiliate_url || !landing_page)
        return new NextResponse("Misconfigured: missing affiliate_url or prelander_id", { status: 500 })
      const raw = readLandingHtml(landing_page)
      if (!raw) return new NextResponse(`Landing not found: ${landing_page}`, { status: 500 })
      return html200(injectClickBankBridgeScript(raw, affiliate_url))
    }

    case "clickbankHosted": {
      if (!affiliate_url || !landing_page)
        return new NextResponse("Misconfigured: missing affiliate_url or prelander_id", { status: 500 })
      const raw = readLandingHtml(landing_page)
      if (!raw) return new NextResponse(`Landing not found: ${landing_page}`, { status: 500 })
      return html200(injectClickBankHostedScript(raw, affiliate_url))
    }

    case "sweeplyHosted": {
      if (!affiliate_url || !landing_page)
        return new NextResponse("Misconfigured: missing affiliate_url or prelander_id", { status: 500 })
      const raw = readLandingHtml(landing_page)
      if (!raw) return new NextResponse(`Landing not found: ${landing_page}`, { status: 500 })
      return html200(injectSweeplyHostedScript(raw, affiliate_url))
    }

    default:
      return new NextResponse("Unknown route type", { status: 400 })
  }
}
