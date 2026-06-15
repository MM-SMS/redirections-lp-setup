import { injectClickBankBridgeScript } from "@/lib/lp/config/clickbankBridgeConfig"
import { injectClickBankHostedScript } from "@/lib/lp/config/clickbankHostedConfig"
import { injectSweeplyHostedScript }   from "@/lib/lp/config/sweeplyHostedConfig"

// ─────────────────────────────────────────────
// Route handler registry.
// To add a new route type:
//   1. Create lib/lp/config/yourTypeConfig.ts  (export function injectYourType(html, url): string)
//   2. Import it here and add one line below.
//   3. That's it — route.ts picks it up automatically.
// ─────────────────────────────────────────────

export const ROUTE_HANDLERS: Record<string, (html: string, url: string) => string> = {
  clickbank_bridge: injectClickBankBridgeScript,
  clickbank_hosted: injectClickBankHostedScript,
  sweeply_hosted:   injectSweeplyHostedScript,
}

export type RouteType = keyof typeof ROUTE_HANDLERS

// ─────────────────────────────────────────────
// Domain → brand code map.
// To add a new brand: add one line to DOMAIN_BRAND_MAP.
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

export function getBrand(host: string): string {
  const domain = host.split(":")[0].replace(/^www\./i, "").toLowerCase()
  const brand = DOMAIN_BRAND_MAP[domain]
  if (!brand) throw new Error(`[lp] Unknown domain: ${domain}`)
  return brand
}
