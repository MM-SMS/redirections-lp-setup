# 📖 How to add Redirection Script to a brand

> 📌 **What is this**
>
> Short guide for wiring an existing (or new) brand Next.js site to the Redirection Script: build command, Orion brand token, Vercel env, Deploy Hook, and GitHub Actions auto-deploy. For developers or tech ops who own the brand repo and Vercel project.

> ⚠️ **Prerequisites**
>
> - Access to the brand **GitHub** repo (`package.json`)
> - Access to the brand **Vercel** project (Env + Deploy Hooks)
> - Access to **Orion / CampaignsMng** to generate the brand token
> - Maintain access to `MM-SMS/redirections-lp-setup` (Actions secrets + `.github/workflows/main.yml`)

---

## Step 1 — Set the brand `build` command (fastest path)

The simplest way to install the script on an **existing brand** is to edit `package.json` on GitHub — no local clone required.

1. Open the brand repo on GitHub
2. Open `package.json`
3. Replace the `build` script with:

```json
{
  "scripts": {
    "build": "npx --yes git@github.com:MM-SMS/redirections-lp-setup.git --force && next build"
  }
}
```

4. Commit to the brand production branch (usually `main`)

On every Vercel deploy, this pulls the latest package and scaffolds `/go`, `lib/lp/`, `public/lp/`, then runs `next build`.

You can set the same `build` script when **creating a new brand** (scaffold the Next.js app, then add this line before the first deploy).

**[Screenshot]** — brand GitHub `package.json` with the `build` field highlighted

> ⚠️ **Attention**
>
> `--force` overwrites package-owned files on every deploy. Do not keep brand-only edits inside those files.

---

## Step 2 — Generate the brand token in Orion and add it in Vercel

1. Open **Orion / CampaignsMng** → this brand
2. Generate or copy the **campaign / brand token** (`CAMPAIGNS_BRAND_TOKEN`)
3. In the brand **Vercel** project → **Settings → Environment Variables**, add:

```env
CAMPAIGNS_MNG_URL=https://campaignsmngprod.vercel.app
CAMPAIGNS_BRAND_TOKEN=your-brand-token-here
```

4. Apply at least to **Production**, save, then **Redeploy**

**[Screenshot]** — Orion brand page with token generate/copy  
**[Screenshot]** — Vercel Environment Variables with both keys (values masked)

> 🚨 **Critical**
>
> Never commit the token to git. One token per brand. Regenerating invalidates the old token immediately.

---

## Step 3 — Create a Vercel Deploy Hook

1. Brand Vercel project → **Settings → Git → Deploy Hooks**
2. Create a hook (name e.g. `redirections-lp-setup-main`, branch = production)
3. Copy the URL

**[Screenshot]** — Vercel Deploy Hooks screen with Create / copied URL masked

---

## Step 4 — Store the hook in GitHub Actions secrets

1. Open `MM-SMS/redirections-lp-setup` → **Settings → Secrets and variables → Actions**
2. **New repository secret**
3. Name: `VERCEL_DEPLOY_HOOK_<BRAND_CODE>` (e.g. `VERCEL_DEPLOY_HOOK_ONYX`)
4. Value: the Deploy Hook URL → Save

**[Screenshot]** — GitHub Actions secrets list with the new secret name

---

## Step 5 — Call the secret from `main.yml`

1. Edit `.github/workflows/main.yml` in `redirections-lp-setup`
2. Add a step next to the other brand deploys:

```yaml
- name: Deploy Project YourBrandName
  run: curl -X POST "${{ secrets.VERCEL_DEPLOY_HOOK_YOURBRAND }}"
```

3. Merge to `main`

From then on, every push to package `main` triggers this brand’s redeploy, and the brand `build` script pulls the updated script.

**[Screenshot]** — workflow file with the new `curl` step highlighted

---

> ✅ **Result / How to verify**
>
> 1. Brand `package.json` uses the `npx … --force && next build` command
> 2. Vercel has `CAMPAIGNS_MNG_URL` + `CAMPAIGNS_BRAND_TOKEN`
> 3. Deploy Hook exists; secret name matches the `main.yml` step
> 4. Push to package `main` (or re-run **Trigger Vercel**) → brand step green in Actions → new Vercel deployment
> 5. Vercel build log shows scaffold `--force` before `next build`
> 6. Smoke-test `https://{brand-domain}/go/{paf}` on a real CampaignsMng link

---

## Related

- **How to integrate Redirection Script** — full local install, `/not-found`, `/expired`, smoke tests
- **How to setup brand auto-deploy** — longer auto-deploy reference
- **GitHub Actions workflow** — `.github/workflows/main.yml` in `MM-SMS/redirections-lp-setup`

---

Last updated: 2026-08-05  
Owner: {OWNER}
