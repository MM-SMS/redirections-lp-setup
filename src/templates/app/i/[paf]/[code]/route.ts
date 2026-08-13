import { NextRequest, NextResponse } from "next/server"
import {
  normalizePathSegment,
  resolveRecipientLink,
  serveCampaignLanding,
} from "@/lib/lp/serveCampaign"

/**
 * Per-recipient personal link: /i/<paf>/<code>
 * resolve?paf=&t= with visitor header forwarding (IP/UA/referer for CRM click journal).
 * Unknown paf OR unknown/foreign code → CRM found:false → /not-found.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ paf: string; code: string }> }
) {
  const raw = await params
  const paf = normalizePathSegment(raw.paf)
  const code = normalizePathSegment(raw.code)

  let resolved: Awaited<ReturnType<typeof resolveRecipientLink>>
  try {
    resolved = await resolveRecipientLink(paf, code, {
      forwardedFor: request.headers.get("x-forwarded-for") ?? "",
      userAgent: request.headers.get("user-agent") ?? "",
      referer: request.headers.get("referer") ?? "",
    })
  } catch (err) {
    console.error("[i] resolve error:", err)
    return new NextResponse("Internal error", { status: 500 })
  }

  if (resolved.invalidToken || !resolved.found)
    return NextResponse.redirect(new URL("/not-found", request.url))
  if (!resolved.active)
    return NextResponse.redirect(new URL("/expired", request.url))

  return serveCampaignLanding(resolved.route!)
}
