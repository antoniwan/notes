/**
 * Sync / verify the Remark42 external rewrite in vercel.json.
 *
 * Vercel cannot interpolate env vars into vercel.json destinations, so the
 * Railway (or other) upstream origin is written explicitly. Set
 * REMARK42_UPSTREAM_ORIGIN and run without --check to update vercel.json;
 * use --check in CI to catch drift.
 *
 * Usage:
 *   node scripts/sync-remark42-rewrite.mjs
 *   node scripts/sync-remark42-rewrite.mjs --check
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const vercelPath = path.join(root, 'vercel.json');
const checkOnly = process.argv.includes('--check');

/** Default production Remark42 origin (Railway). Override with REMARK42_UPSTREAM_ORIGIN. */
export const DEFAULT_REMARK42_UPSTREAM_ORIGIN = 'https://remark42-production-7df4.up.railway.app';

function normalizeOrigin(raw) {
  return String(raw || '')
    .trim()
    .replace(/\/+$/, '');
}

const origin =
  normalizeOrigin(process.env.REMARK42_UPSTREAM_ORIGIN) || DEFAULT_REMARK42_UPSTREAM_ORIGIN;

if (!/^https?:\/\//i.test(origin)) {
  console.error(`sync-remark42-rewrite: invalid origin "${origin}" (need http(s) URL)`);
  process.exit(1);
}

const expectedDestination = `${origin}/:path*`;
const expectedSource = '/api/remark42/:path*';

const raw = fs.readFileSync(vercelPath, 'utf8');
const config = JSON.parse(raw);
const rewrites = Array.isArray(config.rewrites) ? config.rewrites : [];
const remarkRewrite = rewrites.find((r) => r && r.source === expectedSource);

if (checkOnly) {
  if (!remarkRewrite) {
    console.error(`check-remark42-rewrite: missing rewrite source ${expectedSource}`);
    process.exit(1);
  }
  if (remarkRewrite.destination !== expectedDestination) {
    console.error('check-remark42-rewrite: destination mismatch');
    console.error(`  expected: ${expectedDestination}`);
    console.error(`  actual:   ${remarkRewrite.destination}`);
    console.error('Set REMARK42_UPSTREAM_ORIGIN and run: pnpm run sync-remark42-rewrite');
    process.exit(1);
  }
  console.log(`check-remark42-rewrite: OK → ${expectedDestination}`);
  process.exit(0);
}

const nextRewrite = { source: expectedSource, destination: expectedDestination };
if (!remarkRewrite) {
  config.rewrites = [...rewrites, nextRewrite];
} else {
  remarkRewrite.destination = expectedDestination;
  config.rewrites = rewrites;
}

fs.writeFileSync(vercelPath, `${JSON.stringify(config, null, 2)}\n`, 'utf8');
console.log(`sync-remark42-rewrite: wrote ${expectedDestination}`);
