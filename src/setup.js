'use strict'

const fs   = require('fs')
const path = require('path')

// ─── colors (no dependencies) ────────────────────────────────────────────────
const c = {
  green:  s => `\x1b[32m${s}\x1b[0m`,
  red:    s => `\x1b[31m${s}\x1b[0m`,
  yellow: s => `\x1b[33m${s}\x1b[0m`,
  cyan:   s => `\x1b[36m${s}\x1b[0m`,
  dim:    s => `\x1b[2m${s}\x1b[0m`,
  bold:   s => `\x1b[1m${s}\x1b[0m`,
}

const MANIFEST_FILE = '.redirections-lp-manifest.json'

// ─── helpers ─────────────────────────────────────────────────────────────────

function collectFiles(dir) {
  const results = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...collectFiles(full))
    } else {
      results.push(full)
    }
  }
  return results
}

function readManifest(projectRoot) {
  try {
    return JSON.parse(fs.readFileSync(path.join(projectRoot, MANIFEST_FILE), 'utf-8'))
  } catch {
    return []
  }
}

function writeManifest(projectRoot, relPaths) {
  fs.writeFileSync(
    path.join(projectRoot, MANIFEST_FILE),
    JSON.stringify([...relPaths].sort(), null, 2)
  )
}

// Walk up and remove any empty directories left after deleting a file,
// stopping at the project root.
function cleanEmptyDirs(dir, projectRoot) {
  if (dir === projectRoot) return
  try {
    if (fs.readdirSync(dir).length === 0) {
      fs.rmdirSync(dir)
      cleanEmptyDirs(path.dirname(dir), projectRoot)
    }
  } catch {
    // dir already gone or unreadable
  }
}

// ─── main ─────────────────────────────────────────────────────────────────────
async function setup(projectRoot, { force = false } = {}) {
  console.log('')
  console.log(c.bold('redirections-lp-setup') + (force ? c.yellow(' --force') : ''))
  console.log(c.dim(`Target: ${projectRoot}`))
  console.log('')

  // Sanity check — warn if this doesn't look like a Next.js project root
  const nextConfigExists =
    fs.existsSync(path.join(projectRoot, 'next.config.js'))  ||
    fs.existsSync(path.join(projectRoot, 'next.config.ts'))  ||
    fs.existsSync(path.join(projectRoot, 'next.config.mjs'))

  if (!nextConfigExists) {
    console.warn(c.yellow('⚠  No next.config found. Make sure you are running this from a Next.js project root.'))
    console.warn(c.yellow('   Continuing anyway…'))
    console.log('')
  }

  const templatesDir   = path.join(__dirname, 'templates')
  const srcFiles       = collectFiles(templatesDir)
  const newTemplateRels = srcFiles.map(f => path.relative(templatesDir, f))

  // On --force, read what was installed last time so we can remove stale files.
  const oldManifest = force ? readManifest(projectRoot) : []

  let created = 0
  let updated = 0
  let skipped = 0

  for (const srcFile of srcFiles) {
    const rel  = path.relative(templatesDir, srcFile)
    const dest = path.join(projectRoot, rel)

    if (fs.existsSync(dest)) {
      if (!force) {
        console.log(c.dim('  ✓ exists  ') + rel)
        skipped++
        continue
      }
      console.log(c.yellow('  ↺ updated ') + c.cyan(rel))
      updated++
    } else {
      console.log(c.green('  + created ') + c.cyan(rel))
      created++
    }

    fs.mkdirSync(path.dirname(dest), { recursive: true })
    fs.copyFileSync(srcFile, dest)
  }

  // Remove files that were installed before but are no longer in the templates.
  let removed = 0
  if (force && oldManifest.length > 0) {
    const stale = oldManifest.filter(rel => !newTemplateRels.includes(rel))
    if (stale.length > 0) console.log('')
    for (const rel of stale) {
      const dest = path.join(projectRoot, rel)
      if (fs.existsSync(dest)) {
        fs.unlinkSync(dest)
        cleanEmptyDirs(path.dirname(dest), projectRoot)
        console.log(c.red('  - removed ') + rel)
        removed++
      }
    }
  }

  // Write updated manifest.
  writeManifest(projectRoot, newTemplateRels)

  console.log('')
  console.log(c.bold('Done.'))
  if (force) {
    const parts = [
      created  ? c.green(created  + ' created') : '',
      updated  ? c.yellow(updated + ' updated') : '',
      removed  ? c.red(removed    + ' removed') : '',
    ].filter(Boolean)
    console.log('  ' + (parts.join('  ') || 'nothing changed'))
  } else {
    console.log(`  ${c.green(created + ' created')}  ${c.dim(skipped + ' already existed')}`)
  }
  console.log('')

  printEnvReminder()
}

function printEnvReminder() {
  console.log(c.bold('Required Vercel environment variables:'))
  console.log('')
  console.log('  ' + c.cyan('CAMPAIGNS_MNG_URL') + '         Base URL of the CampaignsMng API')
  console.log('  ' + c.dim('                            e.g. https://campaignsmngprod.vercel.app'))
  console.log('  ' + c.cyan('CAMPAIGNS_BRAND_TOKEN') + '     This brand\'s own token (x-brand-token header)')
  console.log('')
  console.log(c.yellow('  ⚠  CAMPAIGNS_BRAND_TOKEN is unique per brand.'))
  console.log(c.dim('     Generate it on this brand\'s page in CampaignsMng — do not reuse'))
  console.log(c.dim('     the same token across multiple brand deployments.'))
  console.log('')
}

module.exports = { setup }
