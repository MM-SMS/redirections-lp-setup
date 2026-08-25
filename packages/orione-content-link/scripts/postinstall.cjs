#!/usr/bin/env node
/**
 * On install into a brand app: write root middleware.ts (re-export).
 * Skips if middleware.ts already exists (Supabase / custom) unless FORCE=1.
 *
 * Env:
 *   ORIONE_CONTENT_LINK_FORCE_MIDDLEWARE=1  — overwrite existing middleware.ts
 *   ORIONE_CONTENT_LINK_SKIP_MIDDLEWARE=1   — never write
 */
const fs = require("fs")
const path = require("path")

const log = (msg) => console.log(`[orione-content-link] ${msg}`)

if (process.env.ORIONE_CONTENT_LINK_SKIP_MIDDLEWARE === "1") {
  log("ORIONE_CONTENT_LINK_SKIP_MIDDLEWARE=1 — skipped writing middleware.ts")
  process.exit(0)
}

// Directory of the app that ran `npm install` (not node_modules/…)
const projectRoot = process.env.INIT_CWD || process.cwd()
const packageRoot = path.resolve(__dirname, "..")

// Installing this package's own deps — don't write middleware into the package repo
if (path.resolve(projectRoot) === path.resolve(packageRoot)) {
  process.exit(0)
}

const template = path.join(packageRoot, "templates", "middleware.ts")
const dest = path.join(projectRoot, "middleware.ts")

if (!fs.existsSync(template)) {
  log("templates/middleware.ts missing — skipped")
  process.exit(0)
}

const force = process.env.ORIONE_CONTENT_LINK_FORCE_MIDDLEWARE === "1"

if (fs.existsSync(dest) && !force) {
  log(`middleware.ts already exists at ${dest} — left untouched`)
  log("Set ORIONE_CONTENT_LINK_FORCE_MIDDLEWARE=1 to overwrite")
  process.exit(0)
}

fs.copyFileSync(template, dest)
log(force ? `overwrote ${dest}` : `wrote ${dest}`)
