import { fetchOffers } from "../lib/offersApi"

export const dynamic = "force-dynamic"

const AVATAR_COLORS = [
  { bg: "#efeafc", fg: "#7c6fe0" },
  { bg: "#eaf1fe", fg: "#4f8ef7" },
  { bg: "#e8f8ef", fg: "#2bb673" },
  { bg: "#fdeaf3", fg: "#e85d9c" },
  { bg: "#fff3e3", fg: "#dd8a1f" },
  { bg: "#e7faf9", fg: "#1aa6a6" },
]

export default async function HomePage() {
  const result = await fetchOffers()
  const offers = result.ok ? Object.values(result.offers) : []

  return (
    <main className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Offers</h1>
          <p className="page-subtitle">
            Live offers from CampaignsMng. Each one lists its prelanders and affiliate links — open
            an offer to browse them. This is read-only and doesn&apos;t touch the{" "}
            <code>/go/[code]</code> redirection logic.
          </p>
        </div>
        {result.ok && <span className="count-badge">{result.offer_count} total</span>}
      </div>

      {!result.ok ? (
        <div className="empty-state">Couldn&apos;t load offers: {result.error}</div>
      ) : offers.length === 0 ? (
        <div className="empty-state">{result.message ?? "No offers yet."}</div>
      ) : (
        <div className="card-grid">
          {offers.map((offer, i) => {
            const color = AVATAR_COLORS[i % AVATAR_COLORS.length]
            return (
              <a key={offer.offer_id} className="item-card" href={`/offers/${offer.offer_id}`}>
                <div className="item-card-top">
                  <span className="item-avatar" style={{ background: color.bg, color: color.fg }}>
                    {offer.offer_name.charAt(0).toUpperCase()}
                  </span>
                  <span className="item-name">{offer.offer_name}</span>
                </div>
                <span className="item-meta">{offer.offer_id}</span>
                <div className="offer-counts">
                  <span className="tag">{offer.prelanders.count} prelanders</span>
                  <span className="tag">{offer.affiliate_links.count} links</span>
                </div>
              </a>
            )
          })}
        </div>
      )}
    </main>
  )
}
