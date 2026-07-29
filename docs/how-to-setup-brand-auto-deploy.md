# 📖 How to setup brand auto-deploy for Redirection Script updates

> 📌 **What is this**
>
> This guide explains how auto-deploy works when `redirections-lp-setup` is updated on GitHub, how Vercel Deploy Hooks are wired through GitHub Actions secrets, and what you must do when onboarding a **new brand** so it redeploys with everyone else. Intended for developers or tech ops who own brand Vercel projects and this package repo.

> ⚠️ **Prerequisites**
>
> Before you start, you must already have:
>
> - Admin / maintain access to the GitHub repo `MM-SMS/redirections-lp-setup` (Actions + Secrets)
> - Access to the brand’s **Vercel** project (Deploy Hooks)
> - The Redirection Script already installed on that brand (see **How to integrate Redirection Script**)
> - Permission to edit `.github/workflows/main.yml` and merge to `main`

---

## Overview — how auto-deploy works

This package repo does **not** deploy itself as the brand site. Instead:

1. Someone merges / pushes changes to the `main` branch of `MM-SMS/redirections-lp-setup`
2. GitHub Actions workflow **Trigger Vercel** runs (`.github/workflows/main.yml`)
3. The workflow sends an HTTP `POST` to **each brand’s Vercel Deploy Hook URL**
4. Each Deploy Hook URL is stored as a **GitHub Actions secret** (never hard-coded in the workflow file)
5. Vercel starts a redeploy of that brand’s project

So: **one push to this repo’s `main` → deploy hooks of all configured brands are called.**

That alone only starts a Vercel rebuild. Brands stay on the **latest Redirection Script** because each brand’s `package.json` **build** script pulls and applies the package with `--force` **before** `next build` (see Step 2 below). Together:

1. Push to package `main` → Actions calls every brand Deploy Hook
2. Each brand Vercel build runs scaffold `--force` → fresh files from GitHub
3. Then `next build` uses those fresh files

---

## Step 1 — Understand the GitHub Actions workflow

Open `.github/workflows/main.yml` in this repo.

Trigger:

```yaml
on:
  push:
    branches:
      - main
```

Job: each step `curl -X POST`’s one secret, for example:

```yaml
- name: Trigger Vercel BurnSong
  run: |
    curl -X POST "${{ secrets.VERCEL_DEPLOY_HOOK }}"

- name: Deploy Project Onyx
  run: curl -X POST "${{ secrets.VERCEL_DEPLOY_HOOK_ONYX }}"
```

Each `${{ secrets.VERCEL_DEPLOY_HOOK_* }}` resolves to a **Vercel Deploy Hook URL** stored in GitHub → **Settings → Secrets and variables → Actions**.

Current secret names used by the workflow include:

| GitHub secret | Brand / project (step name) |
| --- | --- |
| `VERCEL_DEPLOY_HOOK` | BurnSong |
| `VERCEL_DEPLOY_HOOK_ONYX` | Onyx |
| `VERCEL_DEPLOY_HOOK_SDAMG` | Sdamg |
| `VERCEL_DEPLOY_HOOK_RCMB` | Richmondbalance |
| `VERCEL_DEPLOY_HOOK_DSCV` | Discrevolt |
| `VERCEL_DEPLOY_HOOK_SLVR` | Silvermoon |
| `VERCEL_DEPLOY_HOOK_SNMS` | Sunmasterusa |
| `VERCEL_DEPLOY_HOOK_TTCR` | Top10Care |
| `VERCEL_DEPLOY_HOOK_HLTR` | healthyrations |
| `VERCEL_DEPLOY_HOOK_VTTW` | (see workflow step name) |

Secret **values** are the full Deploy Hook URLs from Vercel. They must stay in GitHub Secrets only — never commit them to the repo.

---

## Step 2 — Set the brand `package.json` build script

In **every** brand Next.js project, replace the normal Next.js build with a script that always pulls the latest Redirection Script from GitHub, forces an overwrite of scaffolded files, then builds:

```json
{
  "scripts": {
    "build": "npx --yes git@github.com:MM-SMS/redirections-lp-setup.git --force && next build"
  }
}
```

What this does on every Vercel deploy:

1. `npx --yes git@github.com:MM-SMS/redirections-lp-setup.git --force` — downloads the latest package from `main` and copies/overwrites template files into the brand project (`app/go/`, `lib/lp/`, `public/lp/`, etc.)
2. `next build` — builds the brand site using those fresh files

Do **not** leave a plain `"build": "next build"` on brands that should follow Redirection Script updates. Without the `npx … --force` prefix, Deploy Hooks only redeploy the old scaffold already in the brand tree.

> ⚠️ **Attention**
>
> `--force` overwrites package-owned files on **every** deploy. Do not keep brand-only edits inside files owned by the package (especially `lib/lp/config/*.ts`) unless you accept that those edits will be wiped on the next build.
>
> The Vercel build environment must be able to clone the private repo `MM-SMS/redirections-lp-setup` over SSH (GitHub deploy key / machine access as used by your org). If the build cannot reach GitHub, this step fails before `next build`.

Commit the updated `package.json` to the brand repo before relying on auto-deploy.

---

## Step 3 — Create a Vercel Deploy Hook for the brand

Do this on the **brand’s** Vercel project (the site that serves `/go/{paf}`):

1. Open the brand project in **Vercel**
2. Go to **Settings → Git → Deploy Hooks** (or **Settings → Deploy Hooks**, depending on the Vercel UI)
3. Create a new Deploy Hook:
   - **Name** — clear brand label, e.g. `redirections-lp-setup-main`
   - **Branch** — the production branch of that brand project (usually `main`)
4. Save and **copy the generated URL**

The URL looks like:

```
https://api.vercel.com/v1/integrations/deploy/XXXXXXXX
```

Treat it as a secret. Anyone with the URL can trigger a production redeploy.

> 🚨 **Critical**
>
> Do not paste Deploy Hook URLs into chat, PRs, or the workflow YAML as plain text. Store them only in GitHub Actions secrets.

---

## Step 4 — Add the Deploy Hook URL as a GitHub secret

In the `MM-SMS/redirections-lp-setup` GitHub repository:

1. Go to **Settings → Secrets and variables → Actions**
2. Click **New repository secret**
3. Name it with a clear brand suffix, following the existing pattern:

```
VERCEL_DEPLOY_HOOK_<BRAND_CODE>
```

Examples of the pattern already in use: `VERCEL_DEPLOY_HOOK_ONYX`, `VERCEL_DEPLOY_HOOK_TTCR`.

4. Paste the Vercel Deploy Hook URL as the secret **value**
5. Save

Use a short uppercase code in the secret name so the workflow stays readable.

---

## Step 5 — Add a new step in the GitHub Actions workflow

Edit `.github/workflows/main.yml` and add one step that posts to the new secret:

```yaml
- name: Deploy Project YourBrandName
  run: curl -X POST "${{ secrets.VERCEL_DEPLOY_HOOK_YOURBRAND }}"
```

Rules:

- The secret name in `${{ secrets.... }}` must **exactly** match the GitHub secret created in Step 4
- Put the step next to the other brand deploy steps in the same `deploy` job
- Commit and merge this change to `main` (the same branch that triggers the workflow)

After merge, the next push to `main` (including this merge, if it lands on `main`) will call the new brand hook together with the others.

---

## Step 6 — Verify auto-deploy for the new brand

1. Make a trivial push to `main` on `redirections-lp-setup`, **or** re-run the latest **Trigger Vercel** workflow from the **Actions** tab
2. Open **GitHub → Actions → Trigger Vercel** and confirm the new step is green (curl succeeded)
3. Open the brand’s **Vercel → Deployments** and confirm a new deployment was triggered by the Deploy Hook

If the Actions step fails:

- Secret name mismatch between workflow and GitHub Secrets
- Empty / wrong Deploy Hook URL
- Deleted or regenerated hook in Vercel (create a new hook, update the secret)

If Actions is green but Vercel does not deploy:

- Hook points at the wrong Vercel project or wrong branch
- Vercel project permissions / paused project

---

## Step 7 — Remember this when adding the script to a new brand

When you integrate Redirection Script on a **new** brand, treat auto-deploy setup as part of onboarding — not an optional later cleanup.

Checklist for each new brand:

1. Integrate the script into the brand Next.js project (`npx redirections-lp-setup`, env vars, `/not-found`, `/expired`, CampaignsMng link) — see **How to integrate Redirection Script**
2. Set the brand **`package.json` `build`** script to pull + `--force` + `next build` (Step 2)
3. Create a **Vercel Deploy Hook** on that brand project
4. Store the hook URL in **GitHub Actions secrets** on `MM-SMS/redirections-lp-setup`
5. Add a matching **`curl` step** in `.github/workflows/main.yml`
6. Merge to `main` and verify the brand redeploys from the workflow **and** that the Vercel build log shows the scaffold `--force` step before `next build`

If you skip Deploy Hook + Actions wiring, the brand will **not** redeploy automatically when this package’s `main` is updated.

If you skip the custom `build` script, a Deploy Hook redeploy will **not** pull fresh Redirection Script files.

---

## What happens when the script is updated

Typical update flow:

1. Change templates / injectors / LPs in `redirections-lp-setup`
2. Merge / push those changes to `main`
3. GitHub Actions runs and **calls every stored brand Deploy Hook**
4. Each brand Vercel project starts a deploy
5. During that deploy, the brand `build` script runs  
   `npx --yes git@github.com:MM-SMS/redirections-lp-setup.git --force && next build`  
   so the brand always scaffolds the latest package files, then builds with them

Summary:

| Action | Who / where | Result |
| --- | --- | --- |
| Push to package `main` | `MM-SMS/redirections-lp-setup` | Actions fires all Deploy Hooks |
| Deploy Hooks | Vercel brand projects | Redeploy starts |
| Brand `build` script | Each brand `package.json` | Pulls latest package with `--force`, then `next build` |
| Live site | Brand domain | Serves the updated Redirection Script |

---

> ✅ **Result / How to verify**
>
> Auto-deploy for a brand is correctly configured when **all** of the following are true:
>
> 1. Brand `package.json` uses  
>    `"build": "npx --yes git@github.com:MM-SMS/redirections-lp-setup.git --force && next build"`
> 2. The brand Vercel project has a Deploy Hook for its production branch
> 3. That hook URL is stored as a GitHub Actions secret on `MM-SMS/redirections-lp-setup`
> 4. `.github/workflows/main.yml` has a `curl -X POST` step referencing that exact secret
> 5. A push to `main` (or a manual workflow re-run) shows the brand step green in **Actions**
> 6. The brand’s Vercel **Deployments** list shows a new deployment triggered by the hook
> 7. The Vercel build log for that deployment shows the scaffold `--force` step succeeding before `next build`

---

## Related

- **How to integrate Redirection Script** — first-time install on a brand Next.js project (includes the `build` script step)
- **GitHub Actions workflow** — `.github/workflows/main.yml` in `MM-SMS/redirections-lp-setup`
- **Vercel Deploy Hooks docs** — Vercel project Settings → Deploy Hooks

---

Last updated: 2026-07-16  
Owner: {OWNER}
