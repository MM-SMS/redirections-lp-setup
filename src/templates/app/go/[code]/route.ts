import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { ROUTE_HANDLERS } from "@/lib/lp/settings"
import { renderDefaultRedirectPage } from "@/lib/lp/config/defaultRedirectPage"

type CampaignRoute = {
  type: string
  landing_page: string | null
  affiliate_url: string | null
  click_id: string | null
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

function appendQueryParam(url: string, param: string, value: string): string {
  try {
    const u = new URL(url)
    u.searchParams.append(param, value)
    return u.toString()
  } catch {
    const sep = url.includes("?") ? "&" : "?"
    return `${url}${sep}${encodeURIComponent(param)}=${encodeURIComponent(value)}`
  }
}

// SPEC 0155: resolve also records the click server-side and mints a click_id.
// Append it to affiliate_url as `&{click_id_param}={click_id}` so the affiliate
// partner echoes it back in the conversion postback. /api/public/click is
// deprecated (now a no-op) — there's nothing left for this app to call there.
function appendClickId(affiliateUrl: string | null, clickIdParam: string | null, clickId: string | null): string | null {
  if (!affiliateUrl || !clickIdParam || !clickId) return affiliateUrl
  return appendQueryParam(affiliateUrl, clickIdParam, clickId)
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
      landing_page:  data.prelander_id ?? null,
      affiliate_url: appendClickId(data.affiliate_url ?? null, data.click_id_param ?? null, data.click_id ?? null),
      click_id:      data.click_id ?? null,
    },
  }
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

  const { type, affiliate_url, landing_page, click_id } = resolved.route!

  if (!affiliate_url)
    return new NextResponse("Misconfigured: missing affiliate_url", { status: 500 })

  // Sweeply's network reads the click id from a fixed `aff_click_id` param,
  // regardless of whatever click_id_param the campaign's affiliate network has set.
  const finalUrl = type === "sweeply_hosted" && click_id
    ? appendQueryParam(affiliate_url, "aff_click_id", click_id)
    : affiliate_url

  if (!landing_page)
    return html200(renderDefaultRedirectPage(finalUrl))

  const handler = ROUTE_HANDLERS[type]
  if (!handler)
    return new NextResponse(`Unknown route type: ${type}`, { status: 400 })

  const raw = readLandingHtml(landing_page)
  if (!raw) return new NextResponse(`Landing not found: ${landing_page}`, { status: 500 })

  return html200(handler(raw, finalUrl))
}
