# orione-content-link

Next.js middleware for Orione **`/c/{code}`** content short links (SPEC 0328).

## Install

```bash
npm install github:MM-SMS/orione-content-link#main
```

On install the package **writes / overwrites** root `middleware.ts`:

```ts
export { middleware } from "orione-content-link"

export const config = {
  matcher: ["/c/:code*"],
}
```

(`config` must be inline — Next.js cannot re-export it from a package.)

To **keep** an existing custom/Supabase middleware:

```bash
ORIONE_CONTENT_LINK_SKIP_MIDDLEWARE=1 npm install github:MM-SMS/orione-content-link#main
```

Pin a commit when you want a fixed version:

```bash
npm install github:MM-SMS/orione-content-link#<commit>
```

Peer: `next` >= 14.

Vercel / CI with `--ignore-scripts`: postinstall won't run — commit `middleware.ts` yourself:

```ts
export { middleware } from "orione-content-link"

export const config = {
  matcher: ["/c/:code*"],
}
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

Install with skip, then wire `handleContentLink` before `updateSession` (see repo README / scaffolder docs).

## Publish (maintainers)

```bash
npm run build
# commit dist + templates + scripts, push to MM-SMS/orione-content-link
```
