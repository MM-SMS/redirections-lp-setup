# ⚙️ LP Preview App — Logic & Functionality

> 📌 **What is this**
>
> Explains how the **LP Preview** app works: the read-only UI on Vercel that lists CampaignsMng offers and opens prelander HTML from this repo. For developers and ops who browse offers, QA prelanders, or maintain the preview deploy.

---

## Overview

LP Preview is a separate Next.js app in `preview/` inside `MM-SMS/redirections-lp-setup`. Production URL: [https://offers.orione.io/](https://offers.orione.io/).

It shows live offers from CampaignsMng and serves static prelander files from `src/templates/public/lp/`. It does **not** run brand `/go/{paf}` redirects, does not inject route scripts, and does not change brand production traffic.

Offers and prelander metadata come from the CampaignsMng public API. Prelander HTML/assets are read from this GitHub repo at request time (bundled into the Vercel deploy).

---

## Flow / Diagram

### Browse an offer

1. User opens [https://offers.orione.io/](https://offers.orione.io/)
2. Preview server calls CampaignsMng `GET /api/public/offers` (server-side, with `AUTH_TOKEN`)
3. Home page renders the offer cards (name, id, prelander count, link count)
4. User opens `/offers/{offer_id}`
5. Same API data is used to list:
   - **Prelanders** — Open → `{origin}/lp/{prelander_id}/index.html`
   - **Affiliate links** — Open → real affiliate URL from CampaignsMng

### Open a prelander

1. Browser requests `/lp/{folder}/index.html` (or `/lp/{folder}/…` for assets)
2. Route handler `preview/app/lp/[...slug]/route.ts` reads from `src/templates/public/lp/`
3. File bytes are returned with the correct Content-Type (no Next static `public/` copy required)
4. HTML is **raw template** — no `routing_type` injectors, no live `affiliate_url` rewrite

```
Browser
  → offers.orione.io (Preview / Vercel)
      → CampaignsMng  GET /api/public/offers   (list offers / prelanders / links)
      → Disk           src/templates/public/lp  (serve LP HTML + assets)
```

---

## Components / Fields

### UI routes

| Route | Purpose |
| --- | --- |
| `/` | Offers list from CampaignsMng |
| `/offers/{offer_id}` | Prelanders + affiliate links for one offer |
| `/lp/[...slug]` | Static file server for prelander folders |

### API & env (Vercel project for Preview)

| Field / Param | Type | Description | Example |
| --- | --- | --- | --- |
| `AUTH_TOKEN` | string (secret) | Bearer token for CampaignsMng offers API. Not the brand `CAMPAIGNS_BRAND_TOKEN`. | `(Vercel secret)` |
| `OFFERS_API_URL` | string (URL) | API **origin only**. Path `/api/public/offers` is appended in code. | `https://orione.io` |
| Production URL | URL | Hosted Preview UI | `https://offers.orione.io` |

### Data shown on an offer page

| Field / Param | Type | Description | Example |
| --- | --- | --- | --- |
| `offer_id` | string | Offer key from CampaignsMng | `hlft` |
| `offer_name` | string | Display name | `HydraLift` |
| `prelanders.items[].id` | string | Folder name under `public/lp/` / templates | `hydralift_bridge_v1` |
| `prelanders.items[].name` | string | Label from CampaignsMng | `(API name)` |
| `affiliate_links.items[].url` | string | Affiliate / Sweeply URL | `https://…` |
| `affiliate_links.items[].code` | string | Link code shown as a tag | `(API code)` |

### Code map

| Path | Role |
| --- | --- |
| `preview/app/page.tsx` | Offers home |
| `preview/app/offers/[offer_id]/page.tsx` | Offer detail + Open / Copy |
| `preview/lib/offersApi.ts` | Fetch + parse `/api/public/offers` |
| `preview/app/lp/[...slug]/route.ts` | Serve LP files |
| `preview/lib/lpRoot.ts` | Root = `../src/templates/public/lp` |
| `src/templates/public/lp/{id}/` | Prelander source folders |

---

## Edge cases

| Situation | What happens |
| --- | --- |
| `AUTH_TOKEN` missing | Home/offer pages show: `AUTH_TOKEN is not set in the environment.` |
| API error / bad token | Empty state with error text (URL/status when available) |
| Offer id not in API response | `/offers/{id}` → Next.js **404** |
| Prelander in API but folder missing in repo | **Open** returns **404** from `/lp/...` |
| New LP folder only in Git, not in CampaignsMng | Not listed on Offers; still openable via `/lp/{folder}/index.html` if deployed |
| Relative asset paths in LP HTML | Break on `/go/{paf}` and can break in Preview; LPs must use `/lp/{folder}/...` |
| Preview vs live redirect | Preview = raw HTML; brand `/go` adds injectors (`clickbank_*` / `sweeply_hosted`) |

> 💡 **Tip**
>
> After adding a prelander folder in this repo, push and wait for the Preview Vercel deploy. Then open `/lp/{id}/index.html` directly. To show it under an offer card, set the same `prelander_id` in CampaignsMng (id must match the folder name, including case).

---

## Config / Code references

**Vercel**

- Root Directory: `preview/`
- Include source files outside Root Directory (needed for `src/templates/public/lp/**`)
- Env: `AUTH_TOKEN`, `OFFERS_API_URL` (Production at minimum) → Redeploy after changes

**Local**

```bash
cd preview
npm install
npm run dev -- -p 3010
```

Then open `http://localhost:3010/` and `http://localhost:3010/lp/{folder}/index.html`.

**Related package paths**

- Templates: `src/templates/public/lp/`
- Tracing include: `preview/next.config.js` → `outputFileTracingIncludes` for `/lp/[...slug]`

---

## Related

- **How to add Redirection Script to a brand** — wiring brands for `/go` and auto-deploy
- **How Redirection connects to CampaignsMng** — resolve API used by brand sites (not Preview)
- **GitHub repo** — `MM-SMS/redirections-lp-setup` (`preview/` app)
- **Live Preview** — [https://offers.orione.io/](https://offers.orione.io/)

---

Last updated: 2026-08-11  
Owner: {OWNER}
