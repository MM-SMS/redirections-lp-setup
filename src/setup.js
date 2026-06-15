'use strict'

const fs   = require('fs')
const path = require('path')

// ─── colors (no dependencies) ────────────────────────────────────────────────
const c = {
  green:  s => `\x1b[32m${s}\x1b[0m`,
  yellow: s => `\x1b[33m${s}\x1b[0m`,
  cyan:   s => `\x1b[36m${s}\x1b[0m`,
  dim:    s => `\x1b[2m${s}\x1b[0m`,
  bold:   s => `\x1b[1m${s}\x1b[0m`,
}

// ─── recursively collect all files under a directory ─────────────────────────
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

// ─── main ─────────────────────────────────────────────────────────────────────
async function setup(projectRoot) {
  console.log('')
  console.log(c.bold('redirections-lp-setup'))
  console.log(c.dim(`Target: ${projectRoot}`))
  console.log('')

  // Sanity check — warn if this doesn't look like a Next.js project root
  const nextConfigExists =
    fs.existsSync(path.join(projectRoot, 'next.config.js'))  ||
    fs.existsSync(path.join(projectRoot, 'next.config.ts'))  ||
    fs.existsSync(path.join(projectRoot, 'next.config.mjs'))

  if (!nextConfigExists) {
    console.warn(
      c.yellow('⚠  No next.config found. Make sure you are running this from a Next.js project root.')
    )
    console.warn(c.yellow('   Continuing anyway…'))
    console.log('')
  }

  const templatesDir = path.join(__dirname, 'templates')
  const allFiles = collectFiles(templatesDir)

  let created = 0
  let skipped = 0

  for (const srcFile of allFiles) {
    const rel  = path.relative(templatesDir, srcFile)
    const dest = path.join(projectRoot, rel)

    if (fs.existsSync(dest)) {
      console.log(c.dim('  ✓ exists  ') + rel)
      skipped++
      continue
    }

    fs.mkdirSync(path.dirname(dest), { recursive: true })
    fs.copyFileSync(srcFile, dest)
    console.log(c.green('  + created ') + c.cyan(rel))
    created++
  }

  console.log('')
  console.log(c.bold('Done.'))
  console.log(`  ${c.green(created + ' created')}  ${c.dim(skipped + ' already existed')}`)
  console.log('')

  printEnvReminder()
}

function printEnvReminder() {
  console.log(c.bold('Required Vercel environment variables:'))
  console.log('')
  console.log('  ' + c.cyan('CAMPAIGNS_MNG_URL') + '      Base URL of the CampaignsMng API')
  console.log('  ' + c.dim('                         e.g. https://campaignsmngprod.vercel.app'))
  console.log('  ' + c.cyan('LINK_PUBLIC_SECRET') + '     Shared secret (x-link-secret header)')
  console.log('')
  console.log(c.dim('  Brand is resolved automatically from the request domain.'))
  console.log('')
}

module.exports = { setup }
