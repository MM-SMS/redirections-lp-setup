# orione-content-link

Next.js middleware for Orione **`/c/{code}`** content short links (SPEC 0328).

## Install

```bash
npm install github:MM-SMS/orione-content-link#main
```

### Important: install ≠ build

`next build` **does not** create `middleware.ts`. The file is written by:

1. **postinstall** when npm installs this package, and/or  
2. **prebuild** (recommended on Vercel) — runs before every build:

```json
{
  "scripts": {
    "prebuild": "orione-content-link-ensure",
    "build": "next build"
  },
  "dependencies": {
    "orione-content-link": "github:MM-SMS/orione-content-link#main"
  }
}
```

Without `prebuild`, if you delete `middleware.ts` and only redeploy, Vercel may reuse
a cached install and **not** re-run postinstall → file stays missing.

Written file:

```ts
export { middleware } from "orione-content-link"

export const config = {
  matcher: ["/c/:code*"],
}
```

(`config` must be inline — Next.js cannot re-export it from a package.)

Skip overwrite (Supabase/custom):

```bash
ORIONE_CONTENT_LINK_SKIP_MIDDLEWARE=1 npm install …
```

Or in Vercel env: `ORIONE_CONTENT_LINK_SKIP_MIDDLEWARE=1`.

Peer: `next` >= 14.

## Env (brand Vercel)

| Variable | Required |
|----------|----------|
| `ORIONE_CONTENT_LINK_TOKEN` | Samples API key (`content-links:read`) |
| `CAMPAIGNS_MNG_URL` | `https://orione.io` or `https://dev.orione.io` |
| `ORIONE_CONTENT_LINK_FALLBACK_URL` | optional |
| `ORIONE_CONTENT_LINK_ARTICLE_PATHS` | optional |
| `ORIONE_CONTENT_LINK_NOT_FOUND_PATH` | optional, default `/not-found` |

## Brand with Supabase (manual)

Set `ORIONE_CONTENT_LINK_SKIP_MIDDLEWARE=1`, wire `handleContentLink` yourself.

## Publish (maintainers)

```bash
npm run build
# push to MM-SMS/orione-content-link
```
