#!/usr/bin/env node
'use strict'

const { setup } = require('../src/setup')

setup(process.cwd()).catch(err => {
  console.error('\x1b[31m[redirections-lp-setup] Fatal error:\x1b[0m', err.message)
  process.exit(1)
})
