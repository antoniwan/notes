#!/usr/bin/env node
/**
 * Token lint: keeps Notes on its rhythm and its layout widths.
 *
 *   pnpm run lint:tokens            fail if any count is above the baseline
 *   pnpm run lint:tokens --list     also print every finding as file:line
 *   pnpm run lint:tokens --update   write the current counts as the new baseline
 *
 * What it counts, in src/ stylesheets (global.css and each .astro <style>) and class attributes:
 * - line-height    a bare ratio or length; use a named step, var(--leading-*)
 * - spacing        a margin, padding, or gap off the 4px grid (rem not a multiple of 0.25, px of 4
 *                  from 4 up, em from 0.25 up outside round())
 * - max-width      a width a block sets for itself; text uses var(--measure) or var(--measure-title)
 * - tw-arbitrary   a Tailwind arbitrary width, line height, or spacing (max-w-[…], leading-[…], p-[…])
 * - tw-half-step   a Tailwind 6px or 10px half step (gap-1.5, px-2.5)
 *
 * The baseline (scripts/lint-tokens.baseline.json) holds today's counts. A count may only go down:
 * new code meets the rule, and old exceptions are paid off over time. Lower the baseline with
 * --update after a cleanup.
 */
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const baselineFile = path.join(root, 'scripts', 'lint-tokens.baseline.json');
const args = new Set(process.argv.slice(2));

const files = [];
const walk = (d) => {
  for (const n of readdirSync(d)) {
    const p = path.join(d, n);
    if (statSync(p).isDirectory()) {
      if (n !== 'content') walk(p);
    } else if (/\.(astro|css|ts|tsx)$/.test(n)) files.push(p);
  }
};
walk(path.join(root, 'src'));

const findings = {
  'line-height': [],
  spacing: [],
  'max-width': [],
  'tw-arbitrary': [],
  'tw-half-step': [],
};
const SPACING =
  /^(margin|padding)(-(top|right|bottom|left|block|inline|block-start|block-end|inline-start|inline-end))?$|^(gap|row-gap|column-gap)$/;
const WIDTH_OK =
  /^(none|100%|\d+%|max-content|min-content|fit-content|var\(--measure(-title)?\)|unset|inherit|initial)$/;

function offGrid(value) {
  if (/round\(/.test(value)) return false;
  for (const m of value.matchAll(/(-?\d*\.?\d+)(rem|px|em)\b/g)) {
    const x = Math.abs(parseFloat(m[1]));
    if (x === 0) continue;
    if (m[2] === 'rem' && (x * 16) % 4) return true;
    if (m[2] === 'px' && x >= 4 && x % 4) return true;
    if (m[2] === 'em' && x >= 0.25) return true;
  }
  return false;
}

for (const file of files) {
  const rel = path.relative(root, file).replaceAll('\\', '/');
  const text = readFileSync(file, 'utf8');
  const lineOf = (i) => text.slice(0, i).split('\n').length;

  // Stylesheets: global.css whole, .astro files only inside <style>.
  const blocks = [];
  if (file.endsWith('.css')) blocks.push([text, 0]);
  else if (file.endsWith('.astro'))
    for (const m of text.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g))
      blocks.push([m[1], m.index + m[0].indexOf(m[1])]);
  for (const [css, offset] of blocks) {
    let depthMedia = 0;
    for (const m of css.matchAll(/(@media[^{]*\{)|([a-z-]+)\s*:\s*([^;{}]+);/g)) {
      if (m[1]) {
        depthMedia++;
        continue;
      }
      const [, , prop, raw] = m;
      const value = raw.replace(/\s*!important\s*$/, '').trim();
      const where = `${rel}:${lineOf(offset + m.index)}`;
      if (
        prop === 'line-height' &&
        !/^(var\(--leading-[a-z]+\)|0|inherit|normal|initial|unset)$/.test(value)
      )
        findings['line-height'].push(`${where}  line-height: ${value}`);
      if (SPACING.test(prop) && offGrid(value))
        findings.spacing.push(`${where}  ${prop}: ${value}`);
      if (prop === 'max-width' && !WIDTH_OK.test(value))
        findings['max-width'].push(`${where}  max-width: ${value}`);
    }
    void depthMedia;
  }

  // Class attributes and @apply lines.
  for (const m of text.matchAll(
    /(?:class(?:Name)?(?::list)?\s*=\s*(?:\{[^}]*\}|"[^"]*"|'[^']*'|`[^`]*`))|@apply[^;]+;/g,
  )) {
    const where = `${rel}:${lineOf(m.index)}`;
    for (const c of m[0].matchAll(
      /(?:^|[\s"'`{:])(-?(?:[a-z0-9]+:)*(max-w|leading|p[xytrbl]?|m[xytrbl]?|gap(?:-[xy])?|space-[xy])-\[[^\]]+\])/g,
    ))
      findings['tw-arbitrary'].push(`${where}  ${c[1]}`);
    for (const c of m[0].matchAll(
      /(?:^|[\s"'`{:])(-?(?:[a-z0-9]+:)*(?:p[xytrbl]?|m[xytrbl]?|gap(?:-[xy])?|space-[xy])-(?:1|2|3)\.5)(?=[\s"'`}]|$)/g,
    ))
      findings['tw-half-step'].push(`${where}  ${c[1]}`);
  }
}

const counts = Object.fromEntries(Object.entries(findings).map(([k, v]) => [k, v.length]));
if (args.has('--update')) {
  writeFileSync(baselineFile, JSON.stringify(counts, null, 2) + '\n');
  console.log('lint:tokens baseline updated:', counts);
  process.exit(0);
}
let baseline = {};
try {
  baseline = JSON.parse(readFileSync(baselineFile, 'utf8'));
} catch {
  console.error('lint:tokens: no baseline; run with --update to write one.');
  process.exit(1);
}
let failed = false;
for (const [rule, n] of Object.entries(counts)) {
  const allowed = baseline[rule] ?? 0;
  const mark =
    n > allowed ? 'ABOVE BASELINE' : n < allowed ? 'below baseline: lower it with --update' : 'ok';
  if (n > allowed) failed = true;
  console.log(`${rule.padEnd(14)} ${String(n).padStart(4)} / ${String(allowed).padEnd(4)} ${mark}`);
  if (args.has('--list') || n > allowed) for (const f of findings[rule]) console.log(`  ${f}`);
}
if (failed) {
  console.error(
    '\nlint:tokens: a count went up. Use a token (var(--leading-*), var(--measure), the 4px scale) instead.',
  );
  process.exit(1);
}
console.log('lint:tokens: OK');
