#!/usr/bin/env node
/**
 * Write / overwrite <project>/middleware.ts from templates/middleware.ts.
 *
 * Runs as:
 *   - npm postinstall (when this package is installed into a brand app)
 *   - `npx orione-content-link-ensure` / brand "prebuild" script
 *
 * Env:
 *   ORIONE_CONTENT_LINK_SKIP_MIDDLEWARE=1 — never write (keep Supabase/custom)
 *
 * IMPORTANT: `next build` does NOT run this. Only install / prebuild / this CLI.
 */
const fs = require("fs")
const path = require("path")

const log = (msg) => console.log(`[orione-content-link] ${msg}`)

if (process.env.ORIONE_CONTENT_LINK_SKIP_MIDDLEWARE === "1") {
  log("ORIONE_CONTENT_LINK_SKIP_MIDDLEWARE=1 — skipped writing middleware.ts")
  process.exit(0)
}

const packageRoot = path.resolve(__dirname, "..")

/**
 * Where to put middleware.ts.
 * During dependency postinstall, cwd is often node_modules/orione-content-link
 * and INIT_CWD / npm_config_local_prefix point at the brand app (when set).
 */
function findProjectRoot() {
  if (process.env.INIT_CWD) return path.resolve(process.env.INIT_CWD)
  if (process.env.npm_config_local_prefix) {
    return path.resolve(process.env.npm_config_local_prefix)
  }

  let dir = process.cwd()
  const marker = `${path.sep}node_modules${path.sep}orione-content-link`
  const idx = dir.lastIndexOf(marker)
  if (idx !== -1) return dir.slice(0, idx)

  // Walk up: first package.json that lists this package as a dependency
  for (;;) {
    const pkgFile = path.join(dir, "package.json")
    if (fs.existsSync(pkgFile)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgFile, "utf8"))
        const deps = {
          ...pkg.dependencies,
          ...pkg.devDependencies,
          ...pkg.optionalDependencies,
        }
        if (deps["orione-content-link"] && path.resolve(dir) !== packageRoot) {
          return dir
        }
      } catch {
        /* ignore */
      }
    }
    const parent = path.dirname(dir)
    if (parent === dir) break
    dir = parent
  }

  return process.cwd()
}

const projectRoot = findProjectRoot()

// Installing this package's own deps in its git checkout — don't write here
if (
  path.resolve(projectRoot) === packageRoot &&
  !packageRoot.includes(`${path.sep}node_modules${path.sep}`)
) {
  log("in package repo — skip writing middleware.ts")
  process.exit(0)
}

const template = path.join(packageRoot, "templates", "middleware.ts")
const dest = path.join(projectRoot, "middleware.ts")

if (!fs.existsSync(template)) {
  log(`templates/middleware.ts missing under ${packageRoot} — skipped`)
  process.exit(0)
}

const existed = fs.existsSync(dest)
fs.copyFileSync(template, dest)
log(existed ? `overwrote ${dest}` : `wrote ${dest}`)
