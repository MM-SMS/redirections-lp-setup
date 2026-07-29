# 📖 How to integrate Redirection Script

> 📌 **What is this**
>
> This guide explains how to install the redirections landing-page system on a brand’s Next.js site (Vercel). After integration, traffic to `/go/{paf}` resolves the link via CampaignsMng, serves the correct landing page, injects the route script, and tracks the click. Intended for developers or tech ops who own a brand project.

> ⚠️ **Prerequisites**
>
> Before you start, you must already have:
>
> - Access to the brand’s **Next.js** repository (App Router) and permission to push/deploy
> - Access to the brand’s **Vercel** project (Environment Variables + Deployments)
> - Access to **CampaignsMng** for this brand (owner permission to view/generate the brand token)
> - GitHub access to the private package `MM-SMS/redirections-lp-setup` (HTTPS with PAT, or SSH key)
> - **Node.js ≥ 18** installed locally
> - The brand domain already pointed at the Vercel project (DNS must already work for the site)

---

## Step 1 — Open the brand Next.js project

Clone or open the brand repository locally and confirm you are at the **project root** (the folder that contains `package.json` and `next.config.js` / `next.config.ts` / `next.config.mjs`).

```bash
cd /path/to/brand-nextjs-project
ls package.json next.config.*
```

All install and scaffold commands in this guide must be run from this root.

---

## Step 2 — Install the private package

Install `redirections-lp-setup` from GitHub into the brand project.

**Option A — SSH** (recommended if your machine has a GitHub SSH key):

```bash
npm install git+ssh://git@github.com:MM-SMS/redirections-lp-setup.git
```

**Option B — HTTPS** (uses credentials / personal access token):

```bash
npm install git+https://github.com/MM-SMS/redirections-lp-setup.git
```

Confirm the package appears in `package.json` dependencies (or `devDependencies`, depending on how npm resolved it).

---

## Step 3 — Run the scaffold command

From the brand project root, run:

```bash
npx redirections-lp-setup
```

The CLI will:

1. Check for a Next.js config file
2. Copy every file from the package templates into the matching paths in your project
3. **Skip** files that already exist (safe — nothing is overwritten on the first install)
4. Write `.redirections-lp-manifest.json` to track owned files
5. Print a summary and remind you about required env vars

You should see folders like `app/go/`, `lib/lp/`, and `public/lp/` appear (if they were missing).

> 💡 **Tip**
>
> Re-running `npx redirections-lp-setup` without `--force` is always safe. Existing files are never overwritten unless you explicitly pass `--force`.

---

## Step 4 — Generate the brand token in CampaignsMng

1. Open **CampaignsMng**
2. Open **this brand’s** page (the brand that owns the Vercel project)
3. Generate or copy **`CAMPAIGNS_BRAND_TOKEN`** (owner only)

Rules:

- **One token per brand / Vercel project** — do not reuse the same token on another brand
- Regenerating the token **invalidates the old one immediately** — update Vercel right away or the site starts returning `401`

> 🚨 **Critical**
>
> Never commit `CAMPAIGNS_BRAND_TOKEN` to git. Store it only in Vercel Environment Variables (or a local `.env` that is gitignored).

---

## Step 5 — Set environment variables in Vercel

In the brand’s Vercel project:

1. Go to **Settings → Environment Variables**
2. Add both variables below
3. Apply them to the environments you deploy (at least **Production**; add Preview if needed)
4. Save

```env
CAMPAIGNS_MNG_URL=https://campaignsmngprod.vercel.app
CAMPAIGNS_BRAND_TOKEN=your-brand-token-here
```

| Field / Param | Type | Description | Example |
| --- | --- | --- | --- |
| `CAMPAIGNS_MNG_URL` | string (URL) | Base URL of the CampaignsMng API. No trailing path. | `https://campaignsmngprod.vercel.app` |
| `CAMPAIGNS_BRAND_TOKEN` | string (secret) | Brand-scoped token from CampaignsMng. Identifies which brand’s links this site can resolve. | `(copied from brand page)` |

After changing env vars, trigger a **Redeploy** (or push a new commit) so the running deployment picks them up.

---

## Step 6 — Create `/not-found` and `/expired` pages

The route handler redirects unknown codes to `/not-found` and inactive/reverted codes to `/expired`. These pages are **not** shipped by the package — create them on the brand site.

Create:

```
app/not-found/page.tsx
app/expired/page.tsx
```

Keep the copy brand-specific (simple “page not found” / “link expired” messages are enough). Without these pages, failed resolves will land on a broken URL.

---

## Step 7 — Confirm landing pages exist under `public/lp/`

The scaffold copies standard LP folders into `public/lp/`. Each folder must contain:

```
public/lp/<prelander_id>/
├── index.html
└── sources/          ← CSS, JS, images referenced by index.html
```

Rules:

- Folder name **is** the lookup key — it must match CampaignsMng `prelander_id` **exactly** (case-sensitive)
- `index.html` must include a closing `</body>` tag — injectors insert scripts by replacing `</body>`; without it, the script silently never runs
- Naming convention: `camelCaseOfferName_vN` (e.g. `aquaTower_v1`, `lulutox_v3`)

---

## Step 8 — Configure the link in CampaignsMng

On the campaign/link for this brand, set:

| Field / Param | Type | Description | Example |
| --- | --- | --- | --- |
| `paf` | string | Short code used in `/go/{paf}` | `pc3xxdxx` |
| `prelander_id` | string | Exact folder name under `public/lp/` | `aquaTower_v1` |
| `routing_type` | string | Must match a key in `ROUTE_HANDLERS` | `clickbank_bridge` |
| `affiliate_url` | URL | Final destination / offer URL | `https://...` |
| active | boolean | Inactive links redirect to `/expired` | `true` |

Supported `routing_type` values after a standard install:

| routing_type | Behavior |
| --- | --- |
| `clickbank_bridge` | Show LP, then after ~500 ms redirect via `window.location.replace` |
| `clickbank_hosted` | Show LP and preload checkout in a hidden 1×1 iframe |
| `sweeply_hosted` | Show LP and rewrite CTA `#checkout_cta` / `a.button-main` hrefs |

---

## Step 9 — Set the `build` script so every deploy pulls the latest script

In the brand `package.json`, replace the normal Next.js build with:

```json
{
  "scripts": {
    "build": "npx --yes git@github.com:MM-SMS/redirections-lp-setup.git --force && next build"
  }
}
```

On every Vercel build this:

1. Downloads the latest `redirections-lp-setup` from GitHub
2. Runs scaffold with `--force` (overwrites package-owned files with the fresh version)
3. Runs `next build` using those files

This is required so auto-deploy (Deploy Hooks from this package’s `main`) always ships the newest Redirection Script — not only an old copy already committed in the brand repo.

> ⚠️ **Attention**
>
> `--force` runs on **every** production build. Local tweaks inside package-owned files will be overwritten on deploy.
> The Vercel build must have SSH access to the private repo `MM-SMS/redirections-lp-setup`.

Also wire GitHub Actions + Deploy Hooks for this brand — see **How to setup brand auto-deploy**.

---

## Step 10 — Commit, push, and deploy the brand project

Commit the scaffolded files, the updated `build` script, and brand pages, then deploy via your normal Vercel flow (git push or Vercel Deploy).

Typical paths to include:

```
app/go/[code]/
lib/lp/
public/lp/
app/not-found/
app/expired/
.redirections-lp-manifest.json
package.json
package-lock.json   # or yarn.lock / pnpm-lock.yaml
```

Do **not** commit secrets (`.env`, tokens).

---

## Step 11 — Smoke-test `/go/{paf}` on the live domain

Open the brand domain and test:

```
https://{BRAND_DOMAIN}/go/{paf}
```

Replace `{BRAND_DOMAIN}` and `{paf}` with real values, for example:

```
https://example-brand.com/go/pc3xxdxx
```

Expected for an **active** link with a valid `prelander_id`:

- The landing page HTML loads
- Browser console shows a build log similar to `[lp] build vxxxxxxx`
- Route behavior matches `routing_type` (redirect / iframe preload / CTA rewrite)

Also check failure paths:

| Scenario | Expected result |
| --- | --- |
| Unknown `paf` | Redirect to `/not-found` |
| Inactive / reverted link | Redirect to `/expired` |
| Wrong / missing env token | Resolve fails (often `401` / server error in logs) |
| `prelander_id` folder missing | `500: Landing not found: …` |
| Unknown `routing_type` | `400: Unknown route type: …` |

---

## Updating the package later

With the custom `build` script and brand auto-deploy wired:

1. Merge Redirection Script changes to `main` in `MM-SMS/redirections-lp-setup`
2. GitHub Actions calls each brand’s Vercel Deploy Hook
3. Each brand build runs  
   `npx --yes git@github.com:MM-SMS/redirections-lp-setup.git --force && next build`  
   and ships the fresh files

You do **not** need to manually re-run setup in every brand repo for routine script updates — as long as that `build` script and the Deploy Hook are in place.

For a local check on a brand machine (optional):

```bash
npx --yes git@github.com:MM-SMS/redirections-lp-setup.git --force
git diff
```

---

> ✅ **Result / How to verify**
>
> Integration is complete when **all** of the following are true:
>
> 1. `npx redirections-lp-setup` has been run and `app/go/[code]/route.ts`, `lib/lp/`, and `public/lp/` exist in the brand repo
> 2. Brand `package.json` uses  
>    `"build": "npx --yes git@github.com:MM-SMS/redirections-lp-setup.git --force && next build"`
> 3. Vercel has `CAMPAIGNS_MNG_URL` and `CAMPAIGNS_BRAND_TOKEN` set for the deployed environment
> 4. `app/not-found/page.tsx` and `app/expired/page.tsx` exist on the brand site
> 5. A CampaignsMng link for this brand has matching `paf` + `prelander_id` + `routing_type` + `affiliate_url` and is active
> 6. Visiting `https://{BRAND_DOMAIN}/go/{paf}` loads the LP and console shows `[lp] build v…`
> 7. Unknown / inactive codes land on `/not-found` and `/expired` respectively
> 8. Brand auto-deploy is wired (Deploy Hook + GitHub secret + Actions step) — see **How to setup brand auto-deploy**

---

## Related

- **How to setup brand auto-deploy** — GitHub Actions + Vercel Deploy Hooks for all brands when this package’s `main` updates
- **CampaignsMng — brand token & link fields** — where `CAMPAIGNS_BRAND_TOKEN`, `paf`, `prelander_id`, `routing_type`, and `affiliate_url` are managed
- **Adding a new landing page** — create `public/lp/{folder}/` and point `prelander_id` at that folder name
- **Route types reference** (`clickbank_bridge` / `clickbank_hosted` / `sweeply_hosted`) — behavior and config files under `lib/lp/config/`

---

Last updated: 2026-07-16  
Owner: {OWNER}
