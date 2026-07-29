const OFFERS_API_PATH = "/api/public/offers"

function getOffersApiUrl(): string {
  const baseUrl = process.env.OFFERS_API_URL?.replace(/\/+$/, "") || "https://orione.io"
  return `${baseUrl}${OFFERS_API_PATH}`
}

export type Block<T> = {
  status: "present" | "empty"
  count: number
  items: T[]
  message?: string
}

export type PrelanderItem = { id: string; name: string }
export type AffiliateLinkItem = { name: string; url: string; code: string }

export type OfferEntry = {
  offer_id: string
  offer_name: string
  prelanders: Block<PrelanderItem>
  affiliate_links: Block<AffiliateLinkItem>
}

export type OffersSuccess = {
  ok: true
  offer_count: number
  offers: Record<string, OfferEntry>
  message?: string
}

export type OffersFailure = {
  ok: false
  error: string
}

export async function fetchOffers(): Promise<OffersSuccess | OffersFailure> {
  const token = process.env.AUTH_TOKEN
  if (!token) return { ok: false, error: "AUTH_TOKEN is not set in the environment." }

  const url = getOffersApiUrl()

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })

    const text = await res.text()
    let data: unknown
    try {
      data = JSON.parse(text)
    } catch {
      return {
        ok: false,
        error: `Non-JSON response from ${url} (status ${res.status}): ${text.slice(0, 200)}`,
      }
    }

    const parsed = data as { ok?: boolean; message?: string; error?: string }
    if (!res.ok || parsed.ok === false)
      return {
        ok: false,
        error:
          parsed.message ||
          parsed.error ||
          `Request to ${url} failed with status ${res.status}`,
      }

    return data as OffersSuccess
  } catch (err) {
    return {
      ok: false,
      error: `Fetch to ${url} failed: ${err instanceof Error ? err.message : "Unknown error"}`,
    }
  }
}
