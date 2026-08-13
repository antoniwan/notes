#!/usr/bin/env node
/**
 * changelog-since.mjs
 *
 * Collects commits + changed paths since the previous package version so a
 * human or agent can write a CHANGELOG entry when bumping versions.
 *
 * Usage:
 *   pnpm changelog:since              # since previous version → HEAD
 *   pnpm changelog:since --from 6.2.0 # explicit previous version
 *   pnpm changelog:since --json       # machine-readable
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const asJson = args.includes('--json');
const fromIdx = args.indexOf('--from');
const explicitFrom = fromIdx >= 0 ? args[fromIdx + 1] : null;

function sh(cmd, cmdArgs, opts = {}) {
  return execFileSync(cmd, cmdArgs, {
    cwd: root,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    ...opts,
  }).trim();
}

function readPackageVersion() {
  return JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8')).version;
}

function versionsFromChangelog() {
  const path = resolve(root, 'CHANGELOG.md');
  if (!existsSync(path)) return [];
  const text = readFileSync(path, 'utf8');
  const versions = [];
  for (const match of text.matchAll(/^## \[([0-9]+\.[0-9]+\.[0-9]+)\]/gm)) {
    versions.push(match[1]);
  }
  return versions;
}

/** Find the commit that introduced `version` in package.json (first parent side). */
function commitForVersion(version) {
  // Prefer an explicit release-style commit subject
  try {
    const hit = sh('git', [
      'log',
      '--format=%H',
      '-1',
      `--grep=^v${version}\\b`,
      `--grep=version to ${version}`,
      `--grep="version": "${version}"`,
      '-E',
    ]);
    if (hit) return hit;
  } catch {
    // continue
  }

  // Walk history of package.json for the bump TO this version
  const log = sh('git', ['log', '-p', '-S', `"version": "${version}"`, '--format=%H', '--', 'package.json']);
  const hashes = log
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => /^[0-9a-f]{7,40}$/i.test(l));
  for (const hash of hashes) {
    try {
      const blob = sh('git', ['show', `${hash}:package.json`]);
      const v = JSON.parse(blob).version;
      if (v === version) return hash;
    } catch {
      // skip
    }
  }
  return null;
}

function previousVersion(current) {
  if (explicitFrom) return explicitFrom;

  const changelogVersions = versionsFromChangelog();
  // First changelog entry that is older than current
  for (const v of changelogVersions) {
    if (v !== current) return v;
  }

  // Fall back: scan package.json history for prior versions
  const log = sh('git', ['log', '--format=%H', '--', 'package.json']);
  const seen = new Set();
  for (const hash of log.split('\n').filter(Boolean)) {
    try {
      const blob = sh('git', ['show', `${hash}:package.json`]);
      const v = JSON.parse(blob).version;
      if (!seen.has(v)) {
        seen.add(v);
        if (v !== current) return v;
      }
    } catch {
      // skip
    }
  }
  return null;
}

function classifyPath(path) {
  if (path.startsWith('src/content/')) return 'content';
  if (path.startsWith('src/pages/') || path.startsWith('src/layouts/') || path.startsWith('src/components/'))
    return 'ui';
  if (path.startsWith('src/utils/') || path.startsWith('src/data/') || path.startsWith('astro.config'))
    return 'platform';
  if (path.startsWith('public/')) return 'assets';
  if (path.startsWith('docs/') || path === 'README.md' || path === 'CHANGELOG.md') return 'docs';
  if (path.startsWith('scripts/') || path.includes('test') || path.endsWith('.test.ts')) return 'tooling';
  if (path === 'package.json' || path.includes('lock') || path.startsWith('.github/')) return 'deps';
  return 'other';
}

const current = readPackageVersion();
const prev = previousVersion(current);
if (!prev) {
  console.error('changelog-since: could not determine previous version. Pass --from X.Y.Z');
  process.exit(1);
}

const fromCommit = commitForVersion(prev);
if (!fromCommit) {
  console.error(`changelog-since: could not find git commit for version ${prev}`);
  process.exit(1);
}

const range = `${fromCommit}..HEAD`;
const commits = sh('git', ['log', range, '--pretty=format:%h%x09%s'])
  .split('\n')
  .filter(Boolean)
  .map((line) => {
    const [hash, ...rest] = line.split('\t');
    return { hash, subject: rest.join('\t') };
  });

const nameStatus = sh('git', ['diff', '--name-status', range])
  .split('\n')
  .filter(Boolean)
  .map((line) => {
    const [status, ...paths] = line.split('\t');
    return { status, path: paths[paths.length - 1] };
  });

const byGroup = {};
for (const file of nameStatus) {
  const group = classifyPath(file.path);
  (byGroup[group] ||= []).push(file);
}

const payload = {
  currentVersion: current,
  previousVersion: prev,
  fromCommit,
  range,
  commits,
  files: nameStatus,
  groups: byGroup,
  hint: `Write CHANGELOG.md section ## [${current}] — YYYY-MM-DD from this diff. Prefer reader-facing bullets (Added/Changed/Fixed/Security). Skip noise (lockfile churn, fingerprints) unless it matters.`,
};

if (asJson) {
  console.log(JSON.stringify(payload, null, 2));
  process.exit(0);
}

console.log(`# Changelog draft context`);
console.log(`Current:  ${current}`);
console.log(`Previous: ${prev} @ ${fromCommit.slice(0, 7)}`);
console.log(`Range:    ${range}`);
console.log('');
console.log('## Commits');
if (!commits.length) console.log('(none)');
for (const c of commits) console.log(`- ${c.hash} ${c.subject}`);
console.log('');
console.log('## Files by group');
for (const [group, files] of Object.entries(byGroup).sort(([a], [b]) => a.localeCompare(b))) {
  console.log(`\n### ${group} (${files.length})`);
  for (const f of files) console.log(`- ${f.status}\t${f.path}`);
}
console.log('');
console.log('## Next step');
console.log(payload.hint);
