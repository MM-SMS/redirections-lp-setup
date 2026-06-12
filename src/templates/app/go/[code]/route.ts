import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { createClient } from "@/lib/supabase/redirects/server"
import { createClient as createServiceClient } from "@supabase/supabase-js"
import { injectClickBankBridgeScript } from "@/lib/lp/config/clickbankBridgeConfig"
import { injectClickBankHostedScript } from "@/lib/lp/config/clickbankHostedConfig"
import { injectSweeplyHostedScript } from "@/lib/lp/config/sweeplyHostedConfig"
import { BRAND, type RouteType } from "@/lib/lp/settings"

type CampaignRoute = {
  type: RouteType
  offer: string
  is_active: boolean
  sales_page?: string
  landing_page?: string
  redirect_url?: string
  external_url?: string
  preload_url?: string
}

// ─────────────────────────────────────────────
// Supabase lookup
// ─────────────────────────────────────────────


async function getRouteConfig(code: string, brand: string = BRAND): Promise<CampaignRoute | null> {
  try {
    const supabase = await createClient()

    // New schema: route_type, offer_id, affiliate_url, is_active
    // Don't filter by is_active here - we check it in the handler to show expired page
    const { data, error } = await supabase
      .from("redirects")
      .select("*")
      .eq("code", code)
      .eq("brand", brand)
      .single()

    if (error || !data) {
      console.log(`[v0] Supabase lookup failed for ${code}: ${error?.message}`)
      return null
    }

    console.log(`[v0] Found redirect: code=${code}, is_active=${data.is_active}, route_type=${data.route_type}`)

      // Update click count using service_role key (bypasses RLS)
      ; (async () => {
        const serviceRoleKey = process.env.SUPABASE_REDIRECT_SERVICE_ROLE_KEY
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_REDIRECT_URL

        if (!serviceRoleKey || !supabaseUrl) {
          console.error("[v0] Missing SUPABASE_REDIRECT_SERVICE_ROLE_KEY or SUPABASE_REDIRECT_URL for click tracking")
          return
        }

        const adminClient = createServiceClient(supabaseUrl, serviceRoleKey)

        const { error } = await adminClient
          .from("redirects")
          .update({
            click_count: (data.click_count || 0) + 1,
            last_clicked_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq("id", data.id)

        if (error) {
          console.error("[v0] Failed to update click_count:", error)
        } else {
          console.log("[v0] Click count updated for code:", code)
        }
      })()

    // Map new schema to CampaignRoute format
    // New columns: route_type, offer_id, affiliate_url, landing_page
    return {
      type: data.route_type,
      offer: data.offer_id,
      is_active: data.is_active,
      sales_page: data.landing_page,
      landing_page: data.landing_page,
      redirect_url: data.affiliate_url,
      external_url: data.affiliate_url,
      preload_url: data.affiliate_url,
    }
  } catch (error) {
    console.error("[v0] Supabase error:", error)
    return null
  }
}

// ─────────────────────────────────────────────
// Утилиты
// ─────────────────────────────────────────────

function readLandingHtml(salesPage: string): string | null {
  try {
    const filePath = path.join(process.cwd(), "public", "lp", salesPage, "index.html")
    return fs.readFileSync(filePath, "utf-8")
  } catch {
    return null
  }
}

function html200(body: string): NextResponse {
  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store, no-cache",
    },
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

  // Get route from Supabase
  const route = await getRouteConfig(code)

  if (!route || !route.is_active) {
    return NextResponse.redirect(new URL("/expired", request.url))
  }

  switch (route.type) {

    case "clickbankBridge": {
      const redirectUrl = route.redirect_url || route.external_url
      const salesPage = route.sales_page

      if (!redirectUrl || !salesPage) {
        return new NextResponse("Misconfigured: missing redirect_url or sales_page", { status: 500 })
      }
      const raw = readLandingHtml(salesPage)
      if (!raw) {
        return new NextResponse(`Landing not found: ${salesPage}`, { status: 500 })
      }
      return html200(injectClickBankBridgeScript(raw, redirectUrl))
    }

    case "clickbankHosted": {
      const preloadUrl = route.preload_url || route.external_url
      const salesPage = route.sales_page

      if (!preloadUrl || !salesPage) {
        return new NextResponse("Misconfigured: missing preload_url or sales_page", { status: 500 })
      }
      const raw = readLandingHtml(salesPage)
      if (!raw) {
        return new NextResponse(`Landing not found: ${salesPage}`, { status: 500 })
      }
      return html200(injectClickBankHostedScript(raw, preloadUrl))
    }

    case "sweeplyHosted": {
      const affiliateUrl = route.redirect_url || route.external_url
      const salesPage = route.sales_page

      if (!affiliateUrl || !salesPage) {
        return new NextResponse("Misconfigured: missing affiliate_url or sales_page", { status: 500 })
      }
      const raw = readLandingHtml(salesPage)
      if (!raw) {
        return new NextResponse(`Landing not found: ${salesPage}`, { status: 500 })
      }
      return html200(injectSweeplyHostedScript(raw, affiliateUrl))
    }

    default:
      return new NextResponse("Unknown route type", { status: 400 })
  }
}
