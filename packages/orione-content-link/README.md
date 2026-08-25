# orione-content-link

Next.js middleware for Orione **`/c/{code}`** content short links (SPEC 0328).

## Install

```bash
npm install github:MM-SMS/orione-content-link#main
```

On install the package **writes `middleware.ts`** into the brand project root
(re-export of this package). If `middleware.ts` already exists, it is **not**
overwritten (so Supabase brands stay safe).

Pin a commit/tag when you want a fixed version:

```bash
npm install github:MM-SMS/orione-content-link#v1.1.0
```

Peer: `next` >= 14.

### Force / skip writing middleware.ts

```bash
ORIONE_CONTENT_LINK_FORCE_MIDDLEWARE=1 npm install github:MM-SMS/orione-content-link#main
ORIONE_CONTENT_LINK_SKIP_MIDDLEWARE=1 npm install ...   # never write the file
```

Vercel / CI often use `npm ci --ignore-scripts` — then copy once locally or drop:

```ts
export { middleware, config } from "orione-content-link"
```

## Env (brand Vercel)

| Variable | Required |
|----------|----------|
| `ORIONE_CONTENT_LINK_TOKEN` | Samples API key (`content-links:read`) |
| `CAMPAIGNS_MNG_URL` | `https://orione.io` or `https://dev.orione.io` |
| `ORIONE_CONTENT_LINK_FALLBACK_URL` | optional |
| `ORIONE_CONTENT_LINK_ARTICLE_PATHS` | optional |
| `ORIONE_CONTENT_LINK_NOT_FOUND_PATH` | optional, default `/not-found` |

## Brand with Supabase (manual)

Install with skip, or leave existing middleware and wire yourself:

```ts
import { updateSession } from "@/lib/supabase/auth/middleware"
import { handleContentLink } from "orione-content-link"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const content = await handleContentLink(request)
  if (content) return content
  return updateSession(request)
}
```

## Publish (maintainers)

```bash
npm run build
# commit dist + templates + scripts, push to MM-SMS/orione-content-link
```
