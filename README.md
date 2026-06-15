# redirections-lp-setup

Private npm package that scaffolds the **redirections landing-page system** (ClickBank Bridge, ClickBank Hosted, Sweeply Hosted) into any Next.js project.

When you run the setup command it checks whether all required files and folders already exist in your project. Anything missing is created automatically — existing files are never overwritten.

---

## How it works

The system serves landing pages from your Next.js project and injects a small script into each page depending on the campaign type:

| Route type | What it does |
|---|---|
| `clickbankBridge` | Shows the landing page, then after a short delay redirects the user to the ClickBank sales page via `window.location.replace` |
| `clickbankHosted` | Shows the landing page and silently preloads the ClickBank checkout in a hidden iframe |
| `sweeplyHosted` | Shows the landing page and rewrites the CTA button `href` with the affiliate URL |

Traffic hits `/go/[code]` (e.g. `/go/pc3xxdxx`). The route handler:

1. Detects the brand automatically from the request domain (e.g. `burnsong.org` → `brns`).
2. Calls the **CampaignsMng public API** (`/api/public/resolve`) to look up the campaign.
3. Reads the matching HTML file from `public/lp/`, injects the right script, and returns the page.
4. Fires a click event to CampaignsMng (`/api/public/click`) in the background — never blocks the response.

The brand site never touches the database directly.

---

## Brand detection

Brand code is resolved automatically from the deployment domain — no per-project config needed.

| Domain | Brand code |
|---|---|
| `vettawell.com` | `vttw` |
| `silvermoonandastar.com` | `slvr` |
| `onyxsoundlab.com` | `onyx` |
| `sunmasterusa.com` | `snms` |
| `richmondbalance.com` | `rcmb` |
| `discrevolt.net` | `dscv` |
| `sdamg.com` | `sdmg` |
| `healthyrations.com` | `hltr` |
| `top10.care` | `ttcr` |
| `burnsong.org` | `brns` |

To add a new brand, add a row to `DOMAIN_BRAND_MAP` in `lib/lp/settings.ts`.

---

## Folder structure installed into your project

```
your-nextjs-project/
├── app/
│   └── go/
│       └── [code]/
│           └── route.ts                        ← Next.js route handler (main entry point)
├── lib/
│   └── lp/
│       ├── settings.ts                         ← Domain→brand map + RouteType
│       ├── config/
│       │   ├── clickbankBridgeConfig.ts         ← Bridge script injector
│       │   ├── clickbankHostedConfig.ts         ← Hosted iframe injector
│       │   └── sweeplyHostedConfig.ts           ← Sweeply CTA injector
│       └── routes/
│           └── routes.json                     ← Reference config example
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
│       │       ├── config/
│       │       │   ├── clickbankBridgeConfig.ts
│       │       │   ├── clickbankHostedConfig.ts
│       │       │   └── sweeplyHostedConfig.ts
│       │       └── routes/
│       │           └── routes.json
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

## Updating the package

Re-install the package and re-run setup with `--force`. That's it.

```bash
# 1. pull the latest package
npm install git+https://github.com/YOUR_ORG/redirections-lp-setup.git
# or SSH:
npm install git+ssh://git@github.com:YOUR_ORG/redirections-lp-setup.git

# 2. overwrite all template files in your project
npx redirections-lp-setup --force
```

`--force` overwrites every file that came from the package. Files that don't exist yet are created normally. The summary shows how many were created vs updated.

> **Note:** if you've manually edited any config file (e.g. tuned timings in `lib/lp/config/*.ts`), `--force` will overwrite those edits. Check the diff before committing:
> ```bash
> git diff
> ```

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
4. Print a summary and remind you about required env vars.

Safe to re-run at any time.

---

## What you need after setup

### Environment variables

Set these in **Vercel** (Project Settings → Environment Variables). No `.env.local` needed on brand sites — these come from Vercel.

```env
# Base URL of the CampaignsMng API
CAMPAIGNS_MNG_URL=https://campaignsmngprod.vercel.app

# Shared secret — must match LINK_PUBLIC_SECRET set on CampaignsMng
LINK_PUBLIC_SECRET=your-shared-secret-here
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

### `clickbankBridge`
Shows the LP then replaces the page with the affiliate URL after `500 ms`. Scroll is blocked during the delay. Adjust `BRIDGE_SETTINGS` in `lib/lp/config/clickbankBridgeConfig.ts`.

### `clickbankHosted`
Shows the LP and preloads the ClickBank checkout in a hidden `1×1` iframe `2000 ms` after page load. Adjust `HOSTED_SETTINGS` in `lib/lp/config/clickbankHostedConfig.ts`.

### `sweeplyHosted`
Shows the LP and injects the affiliate URL into `#checkout_cta` and all `a.button-main` links. Edit `lib/lp/config/sweeplyHostedConfig.ts` to target different selectors.
