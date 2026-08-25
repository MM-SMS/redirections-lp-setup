/**
 * Usually written by `npm install orione-content-link`.
 * `config` must stay inline (Next.js static analysis — no re-export).
 */
export { middleware } from "orione-content-link"

export const config = {
  matcher: ["/c/:code*"],
}
