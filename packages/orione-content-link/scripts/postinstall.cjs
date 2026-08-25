#!/usr/bin/env node
/**
 * Write/overwrite root middleware.ts on install.
 *
 * Default (no flag) — same as before: content-link only template.
 *
 * With DB — brand package.json:
 *   "orione-content-link": {
 *     "withDb": true,
 *     "updateSessionFrom": "@/lib/supabase/auth/middleware"
 *   }
 *
 * Env:
 *   ORIONE_CONTENT_LINK_SKIP_MIDDLEWARE=1 — never write
 *   ORIONE_CONTENT_LINK_WITH_DB=1 — force with-db template
 *   ORIONE_CONTENT_LINK_UPDATE_SESSION_FROM — override import path when withDb
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

function readBrandConfig() {
  const pkgPath = path.join(projectRoot, "package.json")
  if (!fs.existsSync(pkgPath)) return {}
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"))
    const cfg = pkg["orione-content-link"]
    return cfg && typeof cfg === "object" ? cfg : {}
  } catch {
    return {}
  }
}

const brandCfg = readBrandConfig()
const withDb =
  process.env.ORIONE_CONTENT_LINK_WITH_DB === "1" ||
  brandCfg.withDb === true

const updateSessionFrom =
  process.env.ORIONE_CONTENT_LINK_UPDATE_SESSION_FROM ||
  brandCfg.updateSessionFrom ||
  "@/lib/supabase/auth/middleware"

const dest = path.join(projectRoot, "middleware.ts")
const existed = fs.existsSync(dest)

if (withDb) {
  const templatePath = path.join(packageRoot, "templates", "middleware.with-db.ts")
  if (!fs.existsSync(templatePath)) {
    log("templates/middleware.with-db.ts missing — skipped")
    process.exit(0)
  }
  let body = fs.readFileSync(templatePath, "utf8")
  body = body.split("__UPDATE_SESSION_FROM__").join(updateSessionFrom)
  fs.writeFileSync(dest, body)
  log(
    existed
      ? `overwrote ${dest} (withDb, updateSession from ${updateSessionFrom})`
      : `wrote ${dest} (withDb, updateSession from ${updateSessionFrom})`
  )
  process.exit(0)
}

// Default — unchanged standalone template
const template = path.join(packageRoot, "templates", "middleware.ts")
if (!fs.existsSync(template)) {
  log("templates/middleware.ts missing — skipped")
  process.exit(0)
}
fs.copyFileSync(template, dest)
log(existed ? `overwrote ${dest}` : `wrote ${dest}`)
