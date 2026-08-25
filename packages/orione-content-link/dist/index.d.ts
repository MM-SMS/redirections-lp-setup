import { NextRequest, NextResponse } from "next/server";
/**
 * If path is `/c/{code}`, resolve and return a redirect (or error) Response.
 * Otherwise return `null` so the brand can run its own middleware (e.g. Supabase).
 */
export declare function handleContentLink(request: NextRequest): Promise<NextResponse | null>;
/** Drop-in Next.js middleware: only handles `/c/{code}`, else `next()`. */
export declare function middleware(request: NextRequest): Promise<NextResponse>;
/**
 * Reference matcher only — do NOT `export { config } from "orione-content-link"`.
 * Next.js requires `export const config = { … }` inline in the app's middleware.ts
 * (static AST analysis). The postinstall template writes that locally.
 */
export declare const CONTENT_LINK_MATCHER: readonly ["/c/:code*"];
/** @deprecated Kept for older imports; prefer inline config in app middleware.ts */
export declare const config: {
    matcher: string[];
};
export type ContentLinkFallback = (request: NextRequest) => Response | Promise<Response>;
/**
 * Optional helper if you prefer a factory over calling `handleContentLink` yourself.
 * Supabase example:
 *   export const middleware = createMiddleware({ fallback: updateSession })
 */
export declare function createMiddleware(options?: {
    fallback?: ContentLinkFallback;
}): (request: NextRequest) => Promise<Response>;
//# sourceMappingURL=index.d.ts.map