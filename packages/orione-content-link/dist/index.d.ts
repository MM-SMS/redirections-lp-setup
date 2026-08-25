import { NextRequest, NextResponse } from "next/server";
/**
 * If path is `/c/{code}`, resolve and return a redirect (or error) Response.
 * Otherwise return `null` so the brand can run its own middleware (e.g. Supabase).
 */
export declare function handleContentLink(request: NextRequest): Promise<NextResponse | null>;
/** Drop-in Next.js middleware: only handles `/c/{code}`, else `next()`. */
export declare function middleware(request: NextRequest): Promise<NextResponse>;
/** Matcher for content-only install (`export { middleware, config } from "…"`). */
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