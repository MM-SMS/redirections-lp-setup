import fs from "fs"
import { LP_ROOT } from "../lib/lpRoot"

const AVATAR_COLORS = [
  { bg: "#efeafc", fg: "#7c6fe0" },
  { bg: "#eaf1fe", fg: "#4f8ef7" },
  { bg: "#e8f8ef", fg: "#2bb673" },
  { bg: "#fdeaf3", fg: "#e85d9c" },
  { bg: "#fff3e3", fg: "#dd8a1f" },
  { bg: "#e7faf9", fg: "#1aa6a6" },
]

function listLandingPages(): string[] {
  try {
    return fs
      .readdirSync(LP_ROOT, { withFileTypes: true })
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name)
      .sort()
  } catch {
    return []
  }
}

export default function HomePage() {
  const lps = listLandingPages()

  return (
    <main className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Landing pages</h1>
          <p className="page-subtitle">
            Every landing page bundled in <code>public/lp</code> — the same HTML files the{" "}
            <code>/go/[code]</code> redirect route serves to real traffic once a campaign is wired up
            in CampaignsMng. This page is read-only and just for browsing: click a card to open that
            page exactly as a visitor would see it, with no campaign, affiliate URL, or redirect
            script involved. Nothing here changes the live redirection logic.
          </p>
        </div>
        <span className="count-badge">{lps.length} total</span>
      </div>

      {lps.length === 0 ? (
        <div className="empty-state">No landing pages found in public/lp.</div>
      ) : (
        <div className="lp-grid">
          {lps.map((lp, i) => {
            const color = AVATAR_COLORS[i % AVATAR_COLORS.length]
            return (
              <a key={lp} className="lp-card" href={`/lp/${lp}/index.html`} target="_blank" rel="noopener noreferrer">
                <div className="lp-card-top">
                  <span className="lp-avatar" style={{ background: color.bg, color: color.fg }}>
                    {lp.charAt(0).toUpperCase()}
                  </span>
                  <span className="lp-name">{lp}</span>
                </div>
                <span className="lp-path">public/lp/{lp}/index.html</span>
                <span className="lp-open" style={{ color: color.fg }}>
                  Open ↗
                </span>
              </a>
            )
          })}
        </div>
      )}
    </main>
  )
}
