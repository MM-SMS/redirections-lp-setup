#!/usr/bin/env node
'use strict'

const { setup } = require('../src/setup')

const force = process.argv.includes('--force') || process.argv.includes('-f')

setup(process.cwd(), { force }).catch(err => {
  console.error('\x1b[31m[redirections-lp-setup] Fatal error:\x1b[0m', err.message)
  process.exit(1)
})
