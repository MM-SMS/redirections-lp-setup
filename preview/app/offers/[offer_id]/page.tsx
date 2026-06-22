import Link from "next/link"
import { notFound } from "next/navigation"
import { fetchOffers } from "../../../lib/offersApi"

export const dynamic = "force-dynamic"

export default async function OfferPage({ params }: { params: Promise<{ offer_id: string }> }) {
  const { offer_id } = await params
  const result = await fetchOffers()

  if (!result.ok) {
    return (
      <main className="page">
        <Link href="/" className="back-link">&larr; Back to offers</Link>
        <div className="empty-state">Couldn&apos;t load offers: {result.error}</div>
      </main>
    )
  }

  const offer = result.offers[offer_id]
  if (!offer) notFound()

  return (
    <main className="page">
      <Link href="/" className="back-link">&larr; Back to offers</Link>

      <div className="page-header">
        <div>
          <h1 className="page-title">{offer.offer_name}</h1>
          <p className="page-subtitle">
            <code>{offer.offer_id}</code>
          </p>
        </div>
      </div>

      <section className="section">
        <h2 className="section-title">Prelanders ({offer.prelanders.count})</h2>
        {offer.prelanders.status === "empty" ? (
          <div className="empty-state">{offer.prelanders.message}</div>
        ) : (
          <div className="row-list">
            {offer.prelanders.items.map(p => (
              <a key={p.id} className="row-item" href={`/lp/${p.id}/index.html`} target="_blank" rel="noopener noreferrer">
                <span className="row-title">{p.name}</span>
                <span className="row-meta">{p.id}</span>
              </a>
            ))}
          </div>
        )}
      </section>

      <section className="section">
        <h2 className="section-title">Affiliate links ({offer.affiliate_links.count})</h2>
        {offer.affiliate_links.status === "empty" ? (
          <div className="empty-state">{offer.affiliate_links.message}</div>
        ) : (
          <div className="row-list">
            {offer.affiliate_links.items.map((link, idx) => (
              <a key={idx} className="row-item" href={link.url} target="_blank" rel="noopener noreferrer">
                <span className="row-title">{link.name}</span>
                <span className="row-meta">{link.code}</span>
              </a>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
