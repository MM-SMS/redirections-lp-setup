import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { ROUTE_HANDLERS } from "@/lib/lp/settings"
import { renderDefaultRedirectPage } from "@/lib/lp/config/defaultRedirectPage"
import { LP_SCRIPT_VERSION } from "@/lib/lp/version"
import { LEGACY_PAF_REDIRECTS } from "@/lib/lp/legacyPafRedirects"

export type CtaUse = "tracked_url" | "direct_url"

export type CampaignRoute = {
  type: string
  landing_page: string | null
  ctaUse: CtaUse | null
  trackedUrl: string | null
  directUrl: string | null
  clickId: string | null
  clickParamName: string | null
}

export type ResolveResult = {
  found: boolean
  active: boolean
  route?: CampaignRoute
  invalidToken?: boolean
}

export type VisitorHeaders = {
  forwardedFor: string
  userAgent: string
  referer: string
}

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

function readLandingHtml(prelander: string): string | null {
  try {
    const filePath = path.join(process.cwd(), "public", "lp", prelander, "index.html")
    return fs.readFileSync(filePath, "utf-8")
  } catch {
    return null
  }
}

function html200(body: string): NextResponse {
  const html = body.replace(
    "</body>",
    `<script>console.log('[lp] build v${LP_SCRIPT_VERSION}')</script>\n</body>`
  )
  return new NextResponse(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store, no-cache" },
  })
}

/** Campaign-level resolve (?paf= only). Same fetch as legacy /go — no visitor headers. */
async function resolveCampaignPaf(paf: string): Promise<ResolveResult> {
  const res = await fetch(
    `${apiBase()}/api/public/resolve?paf=${encodeURIComponent(paf)}`,
    { headers: { "x-brand-token": brandToken() }, cache: "no-store" }
  )

  if (res.status === 401) throw new Error("Invalid CAMPAIGNS_BRAND_TOKEN")
  if (!res.ok) throw new Error(`Resolve API error: ${res.status}`)

  const data = await res.json()

  if (!data.found || !data.active) return { found: data.found, active: data.active }

  return { found: true, active: true, route: mapResolveRoute(data) }
}

/**
 * Per-recipient resolve for /i: ?paf=&t= plus visitor headers.
 * Soft-handles 401 as invalidToken (→ /not-found). Unknown code → CRM found:false → /not-found.
 */
export async function resolveRecipientLink(
  paf: string,
  recipientCode: string,
  visitor: VisitorHeaders
): Promise<ResolveResult> {
  const qs = new URLSearchParams({ paf, t: recipientCode })

  const res = await fetch(`${apiBase()}/api/public/resolve?${qs.toString()}`, {
    headers: {
      "x-brand-token": brandToken(),
      "x-forwarded-for": visitor.forwardedFor,
      "user-agent": visitor.userAgent,
      referer: visitor.referer,
    },
    cache: "no-store",
  })

  if (res.status === 401) return { found: false, active: false, invalidToken: true }
  if (!res.ok) throw new Error(`Resolve API error: ${res.status}`)

  const data = await res.json()

  if (data?.error === "invalid_token")
    return { found: false, active: false, invalidToken: true }

  if (!data.found || !data.active) return { found: !!data.found, active: !!data.active }

  return { found: true, active: true, route: mapResolveRoute(data) }
}

function mapResolveRoute(data: {
  routing_type: string
  prelander_id?: string | null
  cta?: {
    use?: string | null
    tracked_url?: string | null
    direct_url?: string | null
  } | null
  click?: {
    id?: string | null
    param_name?: string | null
  } | null
  affiliate_url?: string | null
  checkout_url?: string | null
  click_id?: string | null
  click_id_param?: string | null
}): CampaignRoute {
  const ctaUse = data.cta?.use === "direct_url" || data.cta?.use === "tracked_url"
    ? data.cta.use
    : null

  return {
    type: data.routing_type,
    landing_page: data.prelander_id ?? null,
    ctaUse,
    trackedUrl: data.cta?.tracked_url ?? data.checkout_url ?? null,
    directUrl: data.cta?.direct_url ?? data.affiliate_url ?? null,
    clickId: data.click?.id ?? data.click_id ?? null,
    clickParamName: data.click?.param_name ?? data.click_id_param ?? null,
  }
}

function withClickId(url: string, param: string | null, clickId: string | null): string {
  if (!param || !clickId) return url
  try {
    if (new URL(url).searchParams.has(param)) return url
  } catch {
    /* append below */
  }
  return appendQueryParam(url, param, clickId)
}

/**
 * CTA / auto-redirect target from resolve.
 * tracked_url → CRM /ck/ hop as-is.
 * direct_url  → affiliate URL + click.param_name=click.id.
 */
function navigationUrl(route: CampaignRoute): string | null {
  const use = route.ctaUse ?? (route.trackedUrl ? "tracked_url" : route.directUrl ? "direct_url" : null)

  if (use === "tracked_url") return route.trackedUrl
  if (use === "direct_url" && route.directUrl) {
    const param =
      route.clickParamName ??
      (route.type === "sweeply_hosted" ? "aff_click_id" : null)
    return withClickId(route.directUrl, param, route.clickId)
  }
  return null
}

/** Shared post-resolve path: tracked/direct CTA URL → LP + injector. */
export function serveCampaignLanding(route: CampaignRoute): NextResponse {
  const { type, landing_page } = route
  const finalUrl = navigationUrl(route)

  if (!finalUrl)
    return new NextResponse("Misconfigured: missing CTA url", { status: 500 })

  if (!landing_page)
    return html200(renderDefaultRedirectPage(finalUrl))

  const handler = ROUTE_HANDLERS[type]
  if (!handler)
    return new NextResponse(`Unknown route type: ${type}`, { status: 400 })

  const raw = readLandingHtml(landing_page)
  if (!raw) return new NextResponse(`Landing not found: ${landing_page}`, { status: 500 })

  return html200(handler(raw, finalUrl))
}

/**
 * Shared handler for /g/<paf> (new standard) and /go/<paf> (legacy forever).
 * Campaign-level resolve only (no visitor headers, no t=). CTA follows cta.use.
 */
export async function handleCampaignPafGet(
  request: NextRequest,
  paf: string,
  logTag: "g" | "go"
): Promise<NextResponse> {
  const legacyUrl = LEGACY_PAF_REDIRECTS[paf]
  if (legacyUrl) return NextResponse.redirect(legacyUrl, { status: 301 })

  let resolved: ResolveResult
  try {
    resolved = await resolveCampaignPaf(paf)
  } catch (err) {
    console.error(`[${logTag}] resolve error:`, err)
    return new NextResponse("Internal error", { status: 500 })
  }

  if (!resolved.found) return NextResponse.redirect(new URL("/not-found", request.url))
  if (!resolved.active) return NextResponse.redirect(new URL("/expired", request.url))

  return serveCampaignLanding(resolved.route!)
}

/** Trim + lowercase path segments before resolve (CRM also normalizes). */
export function normalizePathSegment(value: string): string {
  return value.trim().toLowerCase()
}
