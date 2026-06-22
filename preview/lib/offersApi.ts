const OFFERS_API_URL = "https://dev.orione.io/api/public/offers"

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

  try {
    const res = await fetch(OFFERS_API_URL, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })
    const data = await res.json()

    if (!res.ok || data.ok === false)
      return { ok: false, error: data.message || data.error || `Request failed with status ${res.status}` }

    return data as OffersSuccess
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Unknown error fetching offers." }
  }
}
