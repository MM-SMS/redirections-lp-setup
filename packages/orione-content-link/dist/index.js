import { NextResponse } from "next/server";
/**
 * Orione /c/{code} content short links — Edge-safe helpers for Next.js middleware.
 *
 * OpenAPI / SPEC 0328:
 *   GET {CAMPAIGNS_MNG_URL}/api/public/content-link?code=&host=
 *   Auth: Samples API key (content-links:read) — NOT brand token
 *         Authorization: Bearer <token>
 *
 * Env (brand Vercel):
 *   ORIONE_CONTENT_LINK_TOKEN
 *   CAMPAIGNS_MNG_URL
 *   ORIONE_CONTENT_LINK_FALLBACK_URL       (optional)
 *   ORIONE_CONTENT_LINK_ARTICLE_PATHS      (optional, comma paths)
 *   ORIONE_CONTENT_LINK_NOT_FOUND_PATH     (optional, default /not-found)
 *
 * Brand without other middleware:
 *   export { middleware, config } from "orione-content-link"
 *
 * Brand with Supabase (or anything else) — wire manually:
 *   const hit = await handleContentLink(request)
 *   if (hit) return hit
 *   return updateSession(request)
 */
function normalizeHost(host) {
    return host.trim().toLowerCase().split(":")[0];
}
/** Apex for CRM lookup / same-brand check: strip www. and dev. */
function apexHost(host) {
    let h = normalizeHost(host);
    if (h.startsWith("www."))
        h = h.slice(4);
    if (h.startsWith("dev."))
        h = h.slice(4);
    if (h.startsWith("www."))
        h = h.slice(4);
    return h;
}
function hostsMatch(a, b) {
    return apexHost(a) === apexHost(b);
}
function normalizeArticlePath(path) {
    let p = path.trim();
    if (!p.startsWith("/"))
        p = `/${p}`;
    p = p.replace(/\/+$/, "");
    return p || "/";
}
async function computeContentCode(articlePath) {
    const normalized = normalizeArticlePath(articlePath);
    const data = new TextEncoder().encode(normalized);
    const hash = await crypto.subtle.digest("SHA-256", data);
    const bytes = new Uint8Array(hash);
    let binary = "";
    for (const b of bytes)
        binary += String.fromCharCode(b);
    const b64 = btoa(binary)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
    return b64.slice(0, 8);
}
function readEnv() {
    const token = process.env.ORIONE_CONTENT_LINK_TOKEN;
    const apiBase = process.env.CAMPAIGNS_MNG_URL?.replace(/\/$/, "");
    if (!token || !apiBase)
        return null;
    return {
        token,
        apiBase,
        fallbackUrl: process.env.ORIONE_CONTENT_LINK_FALLBACK_URL?.trim() || "",
        notFoundPath: process.env.ORIONE_CONTENT_LINK_NOT_FOUND_PATH?.trim() || "/not-found",
        articlePaths: process.env.ORIONE_CONTENT_LINK_ARTICLE_PATHS?.split(",")
            .map((s) => s.trim())
            .filter(Boolean),
    };
}
async function fetchContentLink(code, host, token, apiBase) {
    const url = new URL(`${apiBase}/api/public/content-link`);
    url.searchParams.set("code", code);
    url.searchParams.set("host", apexHost(host));
    const res = await fetch(url.toString(), {
        method: "GET",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            "x-api-token": token,
        },
        cache: "no-store",
    });
    if (res.status === 503)
        return "unavailable";
    if (res.status === 401)
        return "unauthorized";
    if (!res.ok)
        return { found: false };
    return (await res.json());
}
function articleUrl(host, path) {
    const p = path.startsWith("/") ? path : `/${path}`;
    return `https://${normalizeHost(host)}${p}`;
}
function pickFallback(host, fallbackUrl, articlePaths) {
    if (fallbackUrl)
        return fallbackUrl;
    if (articlePaths?.length) {
        return articleUrl(host, articlePaths[articlePaths.length - 1]);
    }
    return null;
}
async function findLocalPath(articlePaths, code) {
    if (!articlePaths?.length)
        return null;
    for (const p of articlePaths) {
        if ((await computeContentCode(p)) === code)
            return normalizeArticlePath(p);
    }
    return null;
}
async function resolveContentRedirect(request, code) {
    const cfg = readEnv();
    const base = new URL(request.url);
    if (!cfg) {
        return new NextResponse("Content link env not configured", { status: 500 });
    }
    const host = request.headers.get("host") ?? request.nextUrl.hostname;
    let longUrl = null;
    const api = await fetchContentLink(code, host, cfg.token, cfg.apiBase);
    if (api === "unauthorized") {
        return new NextResponse("Invalid ORIONE_CONTENT_LINK_TOKEN (need Samples API key with content-links:read)", { status: 401 });
    }
    if (api === "unavailable") {
        const local = await findLocalPath(cfg.articlePaths, code);
        if (local)
            longUrl = articleUrl(host, local);
    }
    else if (api.found) {
        longUrl = api.long_url;
    }
    else {
        return NextResponse.redirect(new URL(cfg.notFoundPath, base), 302);
    }
    if (!longUrl) {
        const fb = pickFallback(host, cfg.fallbackUrl, cfg.articlePaths);
        if (!fb) {
            return NextResponse.redirect(new URL(cfg.notFoundPath, base), 302);
        }
        return NextResponse.redirect(fb, 302);
    }
    try {
        const longHost = new URL(longUrl).hostname;
        if (!hostsMatch(host, longHost)) {
            const fb = pickFallback(host, cfg.fallbackUrl, cfg.articlePaths);
            if (!fb) {
                return NextResponse.redirect(new URL(cfg.notFoundPath, base), 302);
            }
            return NextResponse.redirect(fb, 302);
        }
    }
    catch {
        return NextResponse.redirect(new URL(cfg.notFoundPath, base), 302);
    }
    return NextResponse.redirect(longUrl, 302);
}
/**
 * If path is `/c/{code}`, resolve and return a redirect (or error) Response.
 * Otherwise return `null` so the brand can run its own middleware (e.g. Supabase).
 */
export async function handleContentLink(request) {
    const match = request.nextUrl.pathname.match(/^\/c\/([^/]+)\/?$/);
    if (!match)
        return null;
    const code = decodeURIComponent(match[1]);
    return resolveContentRedirect(request, code);
}
/** Drop-in Next.js middleware: only handles `/c/{code}`, else `next()`. */
export async function middleware(request) {
    const hit = await handleContentLink(request);
    return hit ?? NextResponse.next();
}
/**
 * Reference matcher only — do NOT `export { config } from "orione-content-link"`.
 * Next.js requires `export const config = { … }` inline in the app's middleware.ts
 * (static AST analysis). The postinstall template writes that locally.
 */
export const CONTENT_LINK_MATCHER = ["/c/:code*"];
/** @deprecated Kept for older imports; prefer inline config in app middleware.ts */
export const config = {
    matcher: ["/c/:code*"],
};
/**
 * Optional helper if you prefer a factory over calling `handleContentLink` yourself.
 * Supabase example:
 *   export const middleware = createMiddleware({ fallback: updateSession })
 */
export function createMiddleware(options) {
    const fallback = options?.fallback;
    return async function contentLinkMiddleware(request) {
        const hit = await handleContentLink(request);
        if (hit)
            return hit;
        if (fallback)
            return fallback(request);
        return NextResponse.next();
    };
}
