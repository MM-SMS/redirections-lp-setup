# redirections-lp-setup

Private npm package that scaffolds the **redirections landing-page system** (ClickBank Bridge, ClickBank Hosted, Sweeply Hosted) into any Next.js project.

When you run the setup command it checks whether all required files and folders already exist in your project. Anything missing is created automatically — existing files are never overwritten.

---

## How it works

The system serves landing pages from your Next.js project and injects a small script into each page depending on the campaign type:

| Route type | What it does |
|---|---|
| `clickbank_bridge` | Shows the landing page, then after a short delay redirects the user to the ClickBank sales page via `window.location.replace` |
| `clickbank_hosted` | Shows the landing page and silently preloads the ClickBank checkout in a hidden iframe |
| `sweeply_hosted` | Shows the landing page and rewrites the CTA button `href` with the affiliate URL |

Traffic hits `/go/[code]` (e.g. `/go/pc3xxdxx`). The route handler:

1. Calls the **CampaignsMng public API** (`/api/public/resolve`) to look up the campaign, authenticating with this brand's own token.
2. Reads the matching HTML file from `public/lp/`, looks up the inject function for the route type, and returns the page.
3. Fires a click event to CampaignsMng (`/api/public/click`) in the background — never blocks the response.

The brand site never touches the database directly.

---

## Auth model

Each brand has **its own token** (`CAMPAIGNS_BRAND_TOKEN`), generated on that brand's page in CampaignsMng (owner only). The token identifies the brand server-side, so requests only ever send `paf` — never a brand code.

This means:

- **One token per brand deployment.** Don't reuse the same token across multiple brand sites — each Vercel project needs its own value, copied from that brand's page in CampaignsMng.
- A token only ever reads its own brand's links. There's no `brand` query param or body field anymore.
- Regenerating a token on the brand page invalidates the old one immediately — update `CAMPAIGNS_BRAND_TOKEN` in Vercel right after regenerating, or the deployment starts getting `401`s.

---

## Adding a new route type

Route types are registered in `lib/lp/settings.ts` — `route.ts` never needs to be touched.

**Steps:**

1. Create `lib/lp/config/yourTypeConfig.ts` and export an inject function with this exact signature:
   ```ts
   export function injectYourType(html: string, url: string): string {
     // modify html, return it
   }
   ```
2. Open `lib/lp/settings.ts`, import the function and add one entry to `ROUTE_HANDLERS`. The key must exactly match the `routing_type_id` value CampaignsMng will send for this type:
   ```ts
   import { injectYourType } from "@/lib/lp/config/yourTypeConfig"

   export const ROUTE_HANDLERS = {
     clickbank_bridge: injectClickBankBridgeScript,
     clickbank_hosted: injectClickBankHostedScript,
     sweeply_hosted:   injectSweeplyHostedScript,
     your_type:        injectYourType,            // ← add this
   }
   ```
3. That's it. The `RouteType` union and the dispatch in `route.ts` update automatically.

---

## Folder structure installed into your project

```
your-nextjs-project/
├── app/
│   └── go/
│       └── [code]/
│           └── route.ts                        ← Next.js route handler (never edit this)
├── lib/
│   └── lp/
│       ├── settings.ts                         ← route handler registry
│       └── config/
│           ├── clickbankBridgeConfig.ts         ← Bridge script injector
│           ├── clickbankHostedConfig.ts         ← Hosted iframe injector
│           └── sweeplyHostedConfig.ts           ← Sweeply CTA injector
└── public/
    └── lp/
        ├── aquaTower_v1/
        ├── brainSong_v1/
        ├── citrusBurn_v1/
        ├── energyRevolution_v1/
        ├── geniusSong_v1/
        ├── lulutox_v1/
        ├── lulutox_v2/
        ├── transitPage_v1/
        └── waterFreedom_v1/
```

Each landing page folder contains an `index.html` and a `sources/` folder with all assets (images, CSS, JS).

A `.redirections-lp-manifest.json` file is also written to the project root after each run — the setup tool uses it to track which files it owns (for cleanup on `--force`).

---

## Package structure (inside this repo)

```
redirections-lp-setup/
├── bin/
│   └── redirections-lp-setup.js
├── src/
│   ├── setup.js
│   └── templates/                  ← mirrors project root 1-to-1
│       ├── app/
│       │   └── go/
│       │       └── [code]/
│       │           └── route.ts
│       ├── lib/
│       │   └── lp/
│       │       ├── settings.ts
│       │       └── config/
│       │           ├── clickbankBridgeConfig.ts
│       │           ├── clickbankHostedConfig.ts
│       │           └── sweeplyHostedConfig.ts
│       └── public/
│           └── lp/
│               └── (all landing page folders)
├── package.json
└── README.md
```

---

## Installation

This is a **private** package. Install it directly from the GitHub repository:

```bash
# via HTTPS (prompts for credentials / uses your personal access token)
npm install git+https://github.com/YOUR_ORG/redirections-lp-setup.git

# via SSH (if your machine has an SSH key added to GitHub)
npm install git+ssh://git@github.com:YOUR_ORG/redirections-lp-setup.git
```

Replace `YOUR_ORG` with your GitHub organisation or username.

---

## Running the setup

After installation, run the scaffold command from the **root of your Next.js project**:

```bash
npx redirections-lp-setup
```

The CLI will:

1. Check for `next.config.js/ts/mjs` (warns if not found).
2. Walk every file inside `src/templates/` and copy it to the same relative path in your project.
3. Skip any file that already exists — **never overwrites**.
4. Write `.redirections-lp-manifest.json` to track installed files.
5. Print a summary and remind you about required env vars.

Safe to re-run at any time.

---

## Updating the package

Re-install the package and re-run setup with `--force`. That's it.

```bash
# 1. pull the latest package
npm install git+https://github.com/YOUR_ORG/redirections-lp-setup.git
# or SSH:
npm install git+ssh://git@github.com:YOUR_ORG/redirections-lp-setup.git

# 2. overwrite all template files and clean up anything removed
npx redirections-lp-setup --force
```

`--force` does three things:

- **Overwrites** every file that came from the package (shown as `↺ updated`)
- **Creates** any new files that didn't exist yet (shown as `+ created`)
- **Removes** any files that were installed by a previous version but no longer exist in the current templates (shown as `- removed`), and cleans up empty directories left behind

The summary line shows the counts for all three. After running, do a `git diff` to review everything before committing.

> **Note:** if you've manually edited a config file (e.g. tuned timings in `lib/lp/config/*.ts`), `--force` will overwrite those edits. The `git diff` step is your safety net.

---

## What you need after setup

### Environment variables

Set these in **Vercel** (Project Settings → Environment Variables).

```env
# Base URL of the CampaignsMng API
CAMPAIGNS_MNG_URL=https://campaignsmngprod.vercel.app

# This brand's own token — generate it on this brand's page in CampaignsMng.
# Unique per brand. Do not reuse across multiple brand deployments.
CAMPAIGNS_BRAND_TOKEN=your-brand-token-here
```

No extra npm packages are required.

### `/not-found` and `/expired` pages

Unknown codes redirect to `/not-found`; inactive/reverted codes redirect to `/expired`. Create pages at:

```
app/not-found/page.tsx
app/expired/page.tsx
```

---

## Adding a new campaign

1. Add the landing page folder to `public/lp/yourOffer_v1/` (with `index.html` + `sources/`).
2. Create the campaign in **CampaignsMng** with the matching `prelander_id` set to `yourOffer_v1`.
3. Visit `/go/<paf>` in the browser to test.

No SQL or database access needed from the brand site.

---

## Route types reference

### `clickbank_bridge`
Shows the LP then replaces the page with the affiliate URL after `500 ms`. Scroll is blocked during the delay. Adjust `BRIDGE_SETTINGS` in `lib/lp/config/clickbankBridgeConfig.ts`.

### `clickbank_hosted`
Shows the LP and preloads the ClickBank checkout in a hidden `1×1` iframe `2000 ms` after page load. Adjust `HOSTED_SETTINGS` in `lib/lp/config/clickbankHostedConfig.ts`.

### `sweeply_hosted`
Shows the LP and injects the affiliate URL into `#checkout_cta` and all `a.button-main` links. Edit `lib/lp/config/sweeplyHostedConfig.ts` to target different selectors.
