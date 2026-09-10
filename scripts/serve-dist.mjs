#!/usr/bin/env node
/**
 * Serves the prerendered build output over plain HTTP.
 *
 * `astro preview` does not work in this repo: the Vercel adapter delegates
 * preview to the Vercel CLI, which is not a project dependency, so the command
 * fails with "Preview server process exited before becoming ready." This is the
 * dependency-free substitute, and `scripts/lighthouse.mjs` reuses it.
 *
 * What it serves: the prerendered pages and assets in `dist/client`.
 * What it does NOT reproduce: the on-demand `/api/quotes` route, Vercel's
 * redirects, rewrites, headers, or compression. Host behavior has to be checked
 * against a real deployment URL, not here.
 *
 * Usage:
 *   node scripts/serve-dist.mjs [--port=4321] [--host=127.0.0.1]
 */

import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const staticRoot = resolve(repoRoot, 'dist/client');

const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

/** Resolves a request path to a file inside the output, or null. */
function resolveFile(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0].split('#')[0]);
  // normalize() collapses "..", and the prefix check rejects anything that would
  // still escape the output directory.
  const candidate = resolve(staticRoot, `.${normalize(decoded)}`);
  if (candidate !== staticRoot && !candidate.startsWith(staticRoot + sep)) return null;

  if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;

  const indexFile = join(candidate, 'index.html');
  if (existsSync(indexFile) && statSync(indexFile).isFile()) return indexFile;

  return null;
}

export function createDistServer() {
  if (!existsSync(staticRoot)) {
    throw new Error(`no ${staticRoot}. Run \`pnpm run build\` first.`);
  }

  return createServer((request, response) => {
    const file = resolveFile(request.url ?? '/');

    if (!file) {
      const notFound = join(staticRoot, '404.html');
      if (existsSync(notFound)) {
        response.writeHead(404, { 'content-type': CONTENT_TYPES['.html'] });
        createReadStream(notFound).pipe(response);
        return;
      }
      response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
      response.end('Not found');
      return;
    }

    response.writeHead(200, {
      'content-type': CONTENT_TYPES[extname(file).toLowerCase()] ?? 'application/octet-stream',
      // No caching, so a rebuild is visible on reload without a hard refresh.
      'cache-control': 'no-store',
    });
    createReadStream(file).pipe(response);
  });
}

/** Starts the server, rejecting with a readable message on a busy port. */
export function listen(server, { host, port }) {
  return new Promise((ready, reject) => {
    server.once('error', (error) => {
      if (error?.code === 'EADDRINUSE') {
        reject(new Error(`port ${port} is already in use.`));
        return;
      }
      reject(error);
    });
    server.listen(port, host, () => ready(`http://${host}:${port}`));
  });
}

const isDirectRun = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  const args = process.argv.slice(2);
  const value = (name, fallback) => {
    const found = args.find((arg) => arg.startsWith(`--${name}=`));
    return found ? found.slice(name.length + 3) : fallback;
  };
  const host = value('host', '127.0.0.1');
  const port = Number(value('port', process.env.PREVIEW_PORT ?? 4321));

  try {
    const origin = await listen(createDistServer(), { host, port });
    console.log(`serve-dist: serving ${staticRoot}`);
    console.log(`serve-dist: ${origin}`);
    console.log(
      'serve-dist: prerendered pages only — /api/quotes and Vercel rules are not served.',
    );
  } catch (error) {
    console.error(`serve-dist: ${error?.message ?? error}`);
    process.exit(1);
  }
}
