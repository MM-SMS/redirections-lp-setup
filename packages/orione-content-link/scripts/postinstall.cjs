#!/usr/bin/env node
/**
 * On install into a brand app: always write/overwrite root middleware.ts
 * (re-export of this package).
 *
 * Env:
 *   ORIONE_CONTENT_LINK_SKIP_MIDDLEWARE=1 — never write (keep Supabase/custom)
 */
const fs = require("fs")
const path = require("path")

const log = (msg) => console.log(`[orione-content-link] ${msg}`)

if (process.env.ORIONE_CONTENT_LINK_SKIP_MIDDLEWARE === "1") {
  log("ORIONE_CONTENT_LINK_SKIP_MIDDLEWARE=1 — skipped writing middleware.ts")
  process.exit(0)
}

const projectRoot = process.env.INIT_CWD || process.cwd()
const packageRoot = path.resolve(__dirname, "..")

if (path.resolve(projectRoot) === path.resolve(packageRoot)) {
  process.exit(0)
}

const template = path.join(packageRoot, "templates", "middleware.ts")
const dest = path.join(projectRoot, "middleware.ts")

if (!fs.existsSync(template)) {
  log("templates/middleware.ts missing — skipped")
  process.exit(0)
}

const existed = fs.existsSync(dest)
fs.copyFileSync(template, dest)
log(existed ? `overwrote ${dest}` : `wrote ${dest}`)
