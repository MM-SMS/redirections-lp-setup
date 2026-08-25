# orione-content-link

Next.js middleware for Orione **`/c/{code}`** content short links (SPEC 0328 / API 2.x).

Calls `GET /api/public/resolve/content` (v2 path; replaces deprecated `/api/public/content-link`).
Auth and response body are unchanged.

## Install (default — no DB / no flag)

Sites already using this package: **change nothing**. Behaviour stays the same.

```bash
npm install github:MM-SMS/orione-content-link#main
```

Postinstall writes / overwrites root `middleware.ts`:

```ts
export { middleware } from "orione-content-link"

export const config = {
  matcher: ["/c/:code*"],
}
```

## Install with Supabase / DB session

In the brand `package.json` add a flag (same file as dependencies):

```json
{
  "dependencies": {
    "orione-content-link": "github:MM-SMS/orione-content-link#main"
  },
  "orione-content-link": {
    "withDb": true,
    "updateSessionFrom": "@/lib/supabase/auth/middleware"
  }
}
```

Then `npm install`. Postinstall overwrites `middleware.ts` with content-link **plus** `updateSession`.

`updateSessionFrom` defaults to `@/lib/supabase/auth/middleware` if omitted.

Env overrides (optional):

- `ORIONE_CONTENT_LINK_WITH_DB=1`
- `ORIONE_CONTENT_LINK_UPDATE_SESSION_FROM=...`
- `ORIONE_CONTENT_LINK_SKIP_MIDDLEWARE=1` — never write the file

Peer: `next` >= 14.

## Env (brand Vercel)

| Variable | Required |
|----------|----------|
| `ORIONE_CONTENT_LINK_TOKEN` | Samples API key (`content-links:read`) |
| `CAMPAIGNS_MNG_URL` | `https://orione.io` or `https://dev.orione.io` |
| `ORIONE_CONTENT_LINK_FALLBACK_URL` | optional |
| `ORIONE_CONTENT_LINK_ARTICLE_PATHS` | optional |
| `ORIONE_CONTENT_LINK_NOT_FOUND_PATH` | optional, default `/not-found` |

## Publish (maintainers)

```bash
npm run build
# commit dist + templates + scripts, push to MM-SMS/orione-content-link
```
