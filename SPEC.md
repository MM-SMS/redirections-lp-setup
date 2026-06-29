# SPEC — How `redirections-lp-setup` actually works

This is the operational spec for this package: what lives where, what's wired to what, and the
exact steps for the two things people do most often — **adding a new landing page** and
**adding a new redirection/route variant**. `README.md` is the pitch; this is the manual.

---

## 1. The three systems involved

This package is only one of three moving parts. Confusing them is the most common source of
"why isn't this working":

| System | What it is | Where it lives |
|---|---|---|
| **`redirections-lp-setup`** (this repo) | A scaffolder. It owns template files (`src/templates/`) and copies them into a brand's Next.js project. It ships **no runtime logic of its own** — once copied, the files belong to the brand project. | This GitHub repo |
| **CampaignsMng** | The external system of record. It stores brands, campaigns/links, which landing page + route type + affiliate URL each link uses, and whether a link is active. The brand site never has DB access — it only calls CampaignsMng's public API. | Separate deployment (`CAMPAIGNS_MNG_URL`) |
| **Brand Next.js project** | The actual live site (e.g. a Vercel project). This is where the templates get installed and where traffic actually hits `/go/[code]`. | One per brand, on Vercel |

Everything under §6 ("what's managed outside this repo") is configured in CampaignsMng or
Vercel — never in this repo.

---

## 2. Request flow (what happens when a visitor hits `/go/<code>`)

Handled by `app/go/[code]/route.ts` (installed into the brand project, **never edit this file**):

1. `GET /go/<code>` — `<code>` is the link's `paf` (e.g. `pc3xxdxx`). This is **not** a campaign
   ID and **not** the brand token — it's just the short code from the link itself.
2. The route calls CampaignsMng: `GET {CAMPAIGNS_MNG_URL}/api/public/resolve?paf=<code>`,
   sending the brand's own `CAMPAIGNS_BRAND_TOKEN` as the `x-brand-token` header.
3. CampaignsMng looks up `paf` **scoped to the brand that owns that token** and returns:
   - `found` / `active`
   - `routing_type` — which handler in `ROUTE_HANDLERS` to use
   - `prelander_id` — which folder under `public/lp/` to render (or `null`)
   - `affiliate_url` — where the user ultimately needs to end up
   - `click_id` / `click_id_param` — present only when `found && active` (see below)
4. **SINGLE-CALL FLOW (SPEC 0155):** on a live resolve, CampaignsMng also records the click
   server-side in the background — there's no separate click call to make. It returns a
   freshly-minted `click_id` plus the partner pass-through param name `click_id_param`.
   `route.ts` appends `&{click_id_param}={click_id}` to `affiliate_url` (when `click_id_param`
   is non-`null`) before using it, so the affiliate partner echoes the id back in its
   conversion postback. The old `POST /api/public/click` call has been removed — that endpoint
   is deprecated server-side (now a no-op kept only for brand sites mid-migration).
5. Branching:
   - not found → redirect to `/not-found`
   - found but not active → redirect to `/expired`
   - found + active, no `affiliate_url` → hard `500` (misconfigured link, not a code bug)
   - found + active, `affiliate_url` but no `prelander_id` → generic countdown/redirect page
     (`lib/lp/config/defaultRedirectPage.ts`), route type is irrelevant here
   - found + active, both present → read `public/lp/<prelander_id>/index.html`, run it through
     the handler for `routing_type`, return the result

**The brand token answers "whose links is this," not "which link/campaign."** The token scopes
the *brand* (so one Vercel deployment can only ever read/click its own brand's links). The
specific link is selected by `paf` in the URL path. Two different brands could reuse the same
`paf` string and never collide, because each brand's deployment carries a different token.

---

## 3. Adding a new landing page (LP)

The folder name **is** the lookup key. There is no separate mapping file — `route.ts` does
literally this:

```ts
path.join(process.cwd(), "public", "lp", prelander_id, "index.html")
```

`prelander_id` is a string CampaignsMng returns verbatim, and it becomes the path segment as-is.
If the folder name and the `prelander_id` configured in CampaignsMng don't match **exactly**
(case-sensitive, no trailing slash, no typos), the visitor gets a `500: Landing not found`.

**Steps:**

1. Pick a folder name. Convention used by all existing LPs is
   `camelCaseOfferName_v<version>`, e.g. `aquaTower_v1`, `lulutox_v3`. The code does not enforce
   this format — it'll accept any string — but staying consistent matters because a human has to
   type/select the same string into CampaignsMng later.
2. Create the folder in the brand project at `public/lp/<yourFolderName>/`:
   ```
   public/lp/yourOffer_v1/
   ├── index.html
   └── sources/        ← css, js, images — anything index.html references
   ```
3. Make sure `index.html` has a closing `</body>` tag — route handlers inject their `<script>`
   by string-replacing `</body>`. No `</body>` means the injected script silently never runs.
4. In CampaignsMng, on the link/campaign for this brand, set `prelander_id` to
   `yourOffer_v1` — **exactly** the folder name from step 2.
5. Also set `routing_type` on that link to one of the keys in `ROUTE_HANDLERS` (see §4), and
   `affiliate_url`.
6. Test by visiting `/go/<that link's paf>` on the live brand site (or via the `preview` app —
   see §7 — to check the raw HTML without going through CampaignsMng).

No deploy is needed purely for adding an LP folder *if* it's already present in the brand repo —
but if you're adding it for the first time, it has to be committed/pushed to the brand project
and deployed before CampaignsMng links to it, or visitors hit a `500`.

There's no automatic sync between "LPs that exist in CampaignsMng" and "LP folders that exist in
the brand repo." Keeping `prelander_id` values and folder names in lockstep is a manual
discipline, not something the code checks for you.

---

## 4. Adding a new redirection/route variant

A "route type" (`clickbank_bridge`, `clickbank_hosted`, `sweeply_hosted`, ...) is just a function
that takes the raw LP HTML + the affiliate URL and returns modified HTML (almost always: inject a
`<script>` before `</body>`). New variants live in
**`src/templates/lib/lp/config/`** in this repo (which becomes `lib/lp/config/` in the brand
project after install).

**Steps:**

1. Create `src/templates/lib/lp/config/yourTypeConfig.ts`:
   ```ts
   export function injectYourType(html: string, url: string): string {
     const script = `<script>/* your behavior, using ${JSON.stringify("url-or-similar")} */<\/script>`
     return html.replace("</body>", script + "\n</body>")
   }
   ```
   Keep tunable values (delays, selectors) in a top-level `const X_SETTINGS = {...}` object in
   the same file — that's the pattern every existing config follows
   (`BRIDGE_SETTINGS`, `HOSTED_SETTINGS`) and it's what a brand owner edits later without
   touching the function body.
2. Open `src/templates/lib/lp/settings.ts` and wire it in — this file is nothing but a registry:
   ```ts
   import { injectYourType } from "@/lib/lp/config/yourTypeConfig"

   export const ROUTE_HANDLERS: Record<string, (html: string, url: string) => string> = {
     clickbank_bridge: injectClickBankBridgeScript,
     clickbank_hosted: injectClickBankHostedScript,
     sweeply_hosted:   injectSweeplyHostedScript,
     your_type:        injectYourType,   // ← add this line
   }
   ```
   The object key (`your_type`) **must exactly match** the `routing_type` string CampaignsMng
   will send for this variant. This is the only place that mapping is defined — there's no
   separate enum or config elsewhere.
3. That's it. Nothing else needs to change:
   - `RouteType` (`export type RouteType = keyof typeof ROUTE_HANDLERS`) updates automatically
     because it's derived from the object, not hand-maintained.
   - `app/go/[code]/route.ts` looks the handler up dynamically
     (`ROUTE_HANDLERS[type]`) — it has zero awareness of individual route types and never needs
     editing.
4. If this is a genuinely new *kind* of variant (not just a new LP using an existing variant),
   someone also has to add the `routing_type` value as a selectable option inside CampaignsMng
   itself — that's outside this repo (see §6).
5. Push to this repo's `main`. Existing brand projects only pick up the new file once they
   reinstall the package and re-run `npx redirections-lp-setup --force` (§5) — pushing here does
   **not** silently patch already-deployed brand projects.

---

## 5. `lib/lp/settings.ts` — what it actually is

It is **only** a `Record<string, handlerFn>` plus a derived type. There is no other logic in
this file by design, and it should stay that way — if you find yourself adding `if` statements
here, that logic belongs in the individual config file instead, not in the registry.

```ts
export const ROUTE_HANDLERS: Record<string, (html: string, url: string) => string> = {
  clickbank_bridge: injectClickBankBridgeScript,
  clickbank_hosted: injectClickBankHostedScript,
  sweeply_hosted:   injectSweeplyHostedScript,
}

export type RouteType = keyof typeof ROUTE_HANDLERS
```

- **Key** = the exact `routing_type` string CampaignsMng returns for a link.
- **Value** = a function `(html, url) => html`, imported from `lib/lp/config/*.ts`.
- `route.ts` does `const handler = ROUTE_HANDLERS[type]`; if the key doesn't exist (typo, or a
  `routing_type` configured in CampaignsMng that has no matching handler here), the visitor gets
  `400: Unknown route type: <type>`. That error means settings.ts and CampaignsMng have drifted
  out of sync — always the first thing to check.
- Adding a handler here is the **entire** "new script" task on the code side — see §4. No edits
  to `route.ts`, no new env vars, no new types to hand-write.

---

## 6. What's managed *outside* this repo

None of the following lives in this codebase. They're listed here because forgetting one of
them is the usual reason something that "should just work" doesn't.

| Where | What gets configured there |
|---|---|
| **CampaignsMng → brand page** | Generating/regenerating `CAMPAIGNS_BRAND_TOKEN` for this brand. Regenerating invalidates the old token immediately. |
| **CampaignsMng → link/campaign** | `paf` (the code in `/go/<code>`), `prelander_id` (must match an LP folder name exactly), `routing_type` (must match a `ROUTE_HANDLERS` key exactly), `affiliate_url`, active/inactive state. |
| **CampaignsMng (product-level)** | Adding a brand-new `routing_type` *option* — needed once per new variant, in addition to wiring the handler in this repo (§4). |
| **Vercel → brand project → Environment Variables** | `CAMPAIGNS_MNG_URL`, `CAMPAIGNS_BRAND_TOKEN`. Per-brand-project — never shared across brands. |
| **Brand project repo** | `app/not-found/page.tsx` and `app/expired/page.tsx` — not provided by this package, must exist or those redirects 404. |
| **This repo → GitHub → Secrets** (`.github/workflows/main.yml`) | `VERCEL_DEPLOY_HOOK` / `VERCEL_DEPLOY_HOOK_ONYX` — every push to `main` here fires these webhooks, which trigger a redeploy of the currently linked brand Vercel projects. Adding a brand whose project should auto-redeploy on template changes means adding its deploy hook URL as a new secret + a new `curl` step in that workflow. This only redeploys; it does **not** re-copy template files into the brand repo — that still requires `npx redirections-lp-setup --force` to be run/committed in the brand repo first. |

---

## 7. The `preview` app (read-only, doesn't touch `/go`)

`preview/` is a separate local Next.js app for browsing what's configured in CampaignsMng
without going near the redirect logic:

- `preview/app/page.tsx` + `preview/app/offers/[offer_id]/page.tsx` — list offers, their
  prelanders and affiliate links, by calling CampaignsMng's `/api/public/offers` directly
  (needs its own `AUTH_TOKEN` env var, unrelated to `CAMPAIGNS_BRAND_TOKEN`).
- `preview/app/lp/[...slug]/route.ts` — serves files straight out of
  `src/templates/public/lp/` at request time, so you can open
  `http://localhost:<port>/lp/<folderName>/index.html` and eyeball a new LP before it's ever
  wired to a real link.

Useful for checking step 6 of §3 (does the LP render correctly) without needing a real
CampaignsMng link yet. It never calls `/go/[code]` and has no effect on production behavior.

---

## 8. Updating an already-deployed brand project

Pushing to this repo changes the *template source*. A brand project only sees those changes
after someone, in the brand repo:

```bash
npm install git+https://github.com/YOUR_ORG/redirections-lp-setup.git   # pull latest package
npx redirections-lp-setup --force                                       # overwrite + add + remove files
git diff                                                                 # review before committing
```

`--force` overwrites every previously-installed file (so hand-edited tunables in
`lib/lp/config/*.ts` get clobbered — that's what the `git diff` step is for), adds anything new
(e.g. a freshly added LP folder or route config), and deletes anything that's no longer in the
template set. New LP folders added to `src/templates/public/lp/` in this repo only reach a brand
site through this `--force` flow — copying them manually works too, but then the manifest
(`.redirections-lp-manifest.json`) won't know about them for future cleanup.

---

## 9. Quick checklist

**New LP, existing route type:**
1. Add `public/lp/<name>/` (brand repo) or `src/templates/public/lp/<name>/` (this repo, if it
   should ship to everyone).
2. CampaignsMng: set `prelander_id` = `<name>` on the link.
3. Deploy / re-run setup.

**New route variant:**
1. `src/templates/lib/lp/config/xConfig.ts` — export `injectX(html, url)`.
2. `src/templates/lib/lp/settings.ts` — import it, add one key to `ROUTE_HANDLERS`.
3. CampaignsMng (product-level): add the `routing_type` option if it doesn't exist.
4. Push → brand repos run `npx redirections-lp-setup --force` to receive it.
5. CampaignsMng: set `routing_type` on the relevant link to the new key.
