// Resolved automatically at build time — no manual bumping needed.
// On Vercel: the short git commit SHA of the deployed build (e.g. "a1b2c3d").
// Locally / non-Vercel: falls back to "local".
export const LP_SCRIPT_VERSION =
  process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "local"
