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

Traffic hits `/go/[code]` (e.g. `/go/t7z`). The route handler looks up the `code` in Supabase, reads the matching HTML file from `public/lp/`, injects the right script, and returns the page. It also increments a click counter in Supabase asynchronously.

---

## Folder structure installed into your project

The package mirrors this exact structure into your project root:

```
your-nextjs-project/
├── app/
│   └── go/
│       └── [code]/
│           └── route.ts                        ← Next.js API route (main handler)
├── lib/
│   ├── supabase/
│   │   └── redirects/
│   │       └── server.ts                       ← Supabase client factory
│   └── lp/
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

The `src/templates/` folder mirrors the project structure exactly — what you see there is what gets copied into the target project:

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
│       │   ├── supabase/
│       │   │   └── redirects/
│       │   │       └── server.ts
│       │   └── lp/
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

Replace `YOUR_ORG` with your GitHub organisation or username and `redirections-lp-setup` with the actual repo name.

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
4. Print a summary and remind you about required env vars and Supabase setup.

Safe to re-run at any time.

---

## What you need after setup

### 1. npm dependency

```bash
npm install @supabase/supabase-js
```

### 2. Environment variables

Add to `.env.local`:

```env
# Supabase → Project Settings → API
NEXT_PUBLIC_SUPABASE_REDIRECT_URL=https://xxxxxxxxxxxx.supabase.co

# Anon / public key (safe to expose to the browser)
NEXT_PUBLIC_SUPABASE_REDIRECT_ANON_KEY=eyJ...

# Service role key — server-side only, never expose to the browser
SUPABASE_REDIRECT_SERVICE_ROLE_KEY=eyJ...
```

### 3. Supabase table

Run this SQL in your Supabase project (SQL Editor):

```sql
CREATE TABLE redirects (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  code              text        NOT NULL,
  brand             text        NOT NULL DEFAULT 'rcmb',
  route_type        text        NOT NULL,   -- 'clickbankBridge' | 'clickbankHosted' | 'sweeplyHosted'
  offer_id          text        NOT NULL,
  affiliate_url     text,
  landing_page      text,                   -- must match a folder name inside public/lp/
  is_active         boolean     NOT NULL DEFAULT true,
  click_count       integer     NOT NULL DEFAULT 0,
  last_clicked_at   timestamptz,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),
  UNIQUE (code, brand)
);
```

### 4. `/expired` page

Unknown or inactive codes redirect to `/expired`. Create a page at `app/expired/page.tsx` (or `page.jsx`) in your Next.js project.

---

## Adding a new campaign

1. Add the landing page folder to `public/lp/yourOffer_v1/` (with `index.html` + `sources/`).
2. Insert a row in the `redirects` table:

```sql
INSERT INTO redirects (code, brand, route_type, offer_id, affiliate_url, landing_page, is_active)
VALUES ('abc123', 'rcmb', 'clickbankBridge', 'yourOffer', 'https://hop.clickbank.net/...', 'yourOffer_v1', true);
```

3. Visit `/go/abc123` in the browser to test.

---

## Route types reference

### `clickbankBridge`
Shows the LP then replaces the page with the affiliate URL after `500 ms`. Scroll is blocked during the delay. Adjust `BRIDGE_SETTINGS` in `lib/lp/config/clickbankBridgeConfig.ts`.

### `clickbankHosted`
Shows the LP and preloads the ClickBank checkout in a hidden `1×1` iframe `2000 ms` after page load. Adjust `HOSTED_SETTINGS` in `lib/lp/config/clickbankHostedConfig.ts`.

### `sweeplyHosted`
Shows the LP and injects the affiliate URL into `#checkout_cta` and all `a.button-main` links. Edit `lib/lp/config/sweeplyHostedConfig.ts` to target different selectors.
