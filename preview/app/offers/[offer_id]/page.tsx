import Link from "next/link"
import { headers } from "next/headers"
import { notFound } from "next/navigation"
import { fetchOffers } from "../../../lib/offersApi"
import { AVATAR_COLORS, colorForKey } from "../../../lib/avatarColor"
import { MonitorIcon, LinkIcon } from "../../../lib/icons"
import CopyButton from "./CopyButton"

export const dynamic = "force-dynamic"

const PRELANDER_COLOR = AVATAR_COLORS[0]
const AFFILIATE_COLOR = AVATAR_COLORS[1]

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

  const headerList = await headers()
  const host = headerList.get("host") ?? ""
  const proto = headerList.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https")
  const origin = `${proto}://${host}`
  const offerColor = colorForKey(offer.offer_id)

  return (
    <main className="page">
      <Link href="/" className="back-link">&larr; Back to offers</Link>

      <div className="page-header">
        <div className="item-card-top" style={{ marginBottom: 8 }}>
          <span className="item-avatar" style={{ background: offerColor.bg, color: offerColor.fg, width: 48, height: 48, fontSize: 18 }}>
            {offer.offer_name.charAt(0).toUpperCase()}
          </span>
          <div>
            <h1 className="page-title" style={{ marginBottom: 2 }}>{offer.offer_name}</h1>
            <code style={{ fontSize: 12, color: "#9aa3b5" }}>{offer.offer_id}</code>
          </div>
        </div>
        <span className="count-badge">
          {offer.prelanders.count} prelanders · {offer.affiliate_links.count} links
        </span>
      </div>

      <div className="sections-grid">
        <section className="section">
          <h2 className="section-title">Prelanders ({offer.prelanders.count})</h2>
          {offer.prelanders.status === "empty" ? (
            <div className="empty-state">{offer.prelanders.message}</div>
          ) : (
            <div className="card-grid card-grid-single">
              {offer.prelanders.items.map(p => {
                const openUrl = `${origin}/lp/${p.id}/index.html`
                return (
                  <div key={p.id} className="detail-card">
                    <div className="detail-card-top">
                      <span className="item-avatar" style={{ background: PRELANDER_COLOR.bg, color: PRELANDER_COLOR.fg }}>
                        <MonitorIcon />
                      </span>
                      <div className="detail-card-body">
                        <span className="item-name">{p.name}</span>
                        <span className="item-meta" style={{ marginBottom: 0 }}>{p.id}</span>
                      </div>
                    </div>
                    <span className="detail-url" title={openUrl}>{openUrl}</span>
                    <div className="detail-card-actions">
                      <a className="open-link" style={{ color: PRELANDER_COLOR.fg }} href={openUrl} target="_blank" rel="noopener noreferrer">
                        Open ↗
                      </a>
                      <CopyButton value={openUrl} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        <section className="section">
          <h2 className="section-title">Affiliate links ({offer.affiliate_links.count})</h2>
          {offer.affiliate_links.status === "empty" ? (
            <div className="empty-state">{offer.affiliate_links.message}</div>
          ) : (
            <div className="card-grid card-grid-single">
              {offer.affiliate_links.items.map((link, idx) => (
                <div key={idx} className="detail-card">
                  <div className="detail-card-top">
                    <span className="item-avatar" style={{ background: AFFILIATE_COLOR.bg, color: AFFILIATE_COLOR.fg }}>
                      <LinkIcon />
                    </span>
                    <div className="detail-card-body">
                      <span className="item-name">{link.name}</span>
                      <span className="tag">{link.code}</span>
                    </div>
                  </div>
                  <span className="detail-url" title={link.url}>{link.url}</span>
                  <div className="detail-card-actions">
                    <a className="open-link" style={{ color: AFFILIATE_COLOR.fg }} href={link.url} target="_blank" rel="noopener noreferrer">
                      Open ↗
                    </a>
                    <CopyButton value={link.url} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
