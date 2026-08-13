import { NextRequest } from "next/server"
import { handleCampaignPafGet } from "@/lib/lp/serveCampaign"

/**
 * Legacy campaign link: /go/<paf>
 * Kept forever for SMS already delivered. Same handler as /g.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params
  return handleCampaignPafGet(request, code, "go")
}
