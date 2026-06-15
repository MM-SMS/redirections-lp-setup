// ─────────────────────────────────────────────
// Route types — add new names here when adding new script injectors.
// ─────────────────────────────────────────────

export type RouteType =
  | "clickbankBridge"
  | "clickbankHosted"
  | "sweeplyHosted"

// ─────────────────────────────────────────────
// Domain → brand code map.
// Brand code = aff_sub1 value used in CampaignsMng.
// ─────────────────────────────────────────────

const DOMAIN_BRAND_MAP: Record<string, string> = {
  "vettawell.com":          "vttw",
  "silvermoonandastar.com": "slvr",
  "onyxsoundlab.com":       "onyx",
  "sunmasterusa.com":       "snms",
  "richmondbalance.com":    "rcmb",
  "discrevolt.net":         "dscv",
  "sdamg.com":              "sdmg",
  "healthyrations.com":     "hltr",
  "top10.care":             "ttcr",
  "burnsong.org":           "brns",
}

/**
 * Resolve the brand code from the incoming Host header.
 * Strips port and leading www. before looking up.
 * Throws if the domain is not in the map (catches misconfigured deploys early).
 */
export function getBrand(host: string): string {
  const domain = host.split(":")[0].replace(/^www\./i, "").toLowerCase()
  const brand = DOMAIN_BRAND_MAP[domain]
  if (!brand) throw new Error(`[lp] Unknown domain: ${domain}`)
  return brand
}
