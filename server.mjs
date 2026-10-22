#!/usr/bin/env node
/**
 * Production server runner for Venkat Sai Travels
 * Compatible with PM2, Docker, cPanel Node.js Application Manager, and direct node invocation.
 * Usage: node server.mjs
 */
import { main } from 'srvx/cli'

// If no arguments were passed, supply the default production serve arguments
if (process.argv.slice(2).length === 0) {
  process.argv.push('--prod', '-s', '../client', 'dist/server/server.js')
}

await main({
  usage: {
    command: 'srvx',
    docs: 'https://srvx.h3.dev',
    issues: 'https://github.com/h3js/srvx/issues',
  },
})
