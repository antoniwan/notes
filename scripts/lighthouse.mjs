#!/usr/bin/env node
/**
 * Runs Lighthouse against a static server this script starts and stops itself.
 *
 * The previous `lighthouse` and `audit-performance` package scripts pointed at
 * http://localhost:4321 and assumed somebody had already started a server there.
 * When nothing was listening they failed with a connection error; worse, if an
 * unrelated dev server happened to be on that port they measured whatever it was
 * serving.
 *
 * Scope is the same as `scripts/serve-dist.mjs`: prerendered pages from
 * `dist/client`, over plain HTTP, from localhost. It does not exercise
 * `/api/quotes` or any Vercel redirect, rewrite, header, or compression, and it
 * says nothing about real network conditions. Treat the numbers as a local
 * comparison baseline, not as field performance.
 *
 * Usage:
 *   node scripts/lighthouse.mjs [--performance-only] [--path=/some/route]
 *
 * Lighthouse itself is not a project dependency. It is fetched on demand through
 * `npx`, so this needs network access on first run.
 */

import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

import { createDistServer, listen, repoRoot, staticRoot } from './serve-dist.mjs';

const PORT = Number(process.env.LIGHTHOUSE_PORT ?? 4321);
const HOST = '127.0.0.1';
const isWindows = process.platform === 'win32';

const args = process.argv.slice(2);
const performanceOnly = args.includes('--performance-only');
const pathArg = args.find((arg) => arg.startsWith('--path='));
const targetPath = pathArg ? pathArg.slice('--path='.length) : '/';

const outputPath = performanceOnly
  ? resolve(repoRoot, 'reports/performance-audit.json')
  : resolve(repoRoot, 'reports/lighthouse-report.html');

function fail(message) {
  console.error(`lighthouse: ${message}`);
  process.exit(1);
}

// The target URL is concatenated into a shelled-out command on Windows, so keep
// it to characters that cannot end the command or start another one.
if (!/^\/[\w\-./?=&%]*$/.test(targetPath)) {
  fail(`--path must be a plain site path, got: ${targetPath}`);
}

let server;

function stopServer() {
  server?.close();
}

async function main() {
  await mkdir(dirname(outputPath), { recursive: true });

  server = createDistServer();
  const origin = await listen(server, { host: HOST, port: PORT }).catch((error) => {
    const hint = error?.message?.includes('in use') ? ' Set LIGHTHOUSE_PORT to pick another.' : '';
    fail(`${error?.message ?? error}${hint}`);
  });

  console.log(`lighthouse: serving ${staticRoot} at ${origin}`);

  const lighthouseArgs = [
    '--yes',
    'lighthouse',
    `${origin}${targetPath}`,
    performanceOnly ? '--only-categories=performance' : null,
    performanceOnly ? '--output=json' : '--output=html',
    `--output-path=${outputPath}`,
    '--chrome-flags=--headless=new',
  ].filter(Boolean);

  const exitCode = await new Promise((done) => {
    const lighthouse = spawn('npx', lighthouseArgs, {
      cwd: repoRoot,
      shell: isWindows,
      stdio: 'inherit',
    });
    lighthouse.on('error', (error) => fail(`could not start Lighthouse: ${error.message}`));
    lighthouse.on('close', done);
  });

  stopServer();

  if (exitCode !== 0) fail(`Lighthouse exited with code ${exitCode}.`);
  console.log(`lighthouse: report written to ${outputPath}`);
}

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    stopServer();
    process.exit(1);
  });
}
process.on('exit', stopServer);

main().catch((error) => {
  stopServer();
  fail(error?.message ?? String(error));
});
