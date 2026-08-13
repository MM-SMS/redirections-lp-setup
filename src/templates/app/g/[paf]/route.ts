import { NextRequest } from "next/server"
import { handleCampaignPafGet } from "@/lib/lp/serveCampaign"

/**
 * New standard campaign link: /g/<paf>
 * Same handler as legacy /go — CRM Affiliate route should be set to /g after deploy.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ paf: string }> }
) {
  const { paf } = await params
  return handleCampaignPafGet(request, paf, "g")
}
