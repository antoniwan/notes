/**
 * IndexNow: notify participating search engines when production publishes.
 *
 * Runs from `astro:build:done` after the sitemap is written. Local builds,
 * CI, and Vercel previews skip the ping unless INDEXNOW_FORCE=1.
 *
 * Key file lives at `public/{INDEXNOW_KEY}.txt` (public by protocol design).
 * @see https://www.indexnow.org/documentation
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE_URL } from '../consts';

export const INDEXNOW_KEY = '3e725118-3860-4543-9a80-625eed302bb1';
export const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';
export const INDEXNOW_KEY_FILENAME = `${INDEXNOW_KEY}.txt`;

const INDEXNOW_BATCH_LIMIT = 10_000;

export type IndexNowLogger = {
  info: (message: string) => void;
  warn: (message: string) => void;
};

export type IndexNowPayload = {
  host: string;
  key: string;
  keyLocation: string;
  urlList: string[];
};

export function getIndexNowHost(siteUrl = SITE_URL): string {
  return new URL(siteUrl).host;
}

export function getIndexNowKeyLocation(siteUrl = SITE_URL): string {
  return new URL(`/${INDEXNOW_KEY_FILENAME}`, siteUrl).href.replace(/\/$/, '');
}

export function shouldSubmitIndexNow(env: NodeJS.ProcessEnv = process.env): boolean {
  const disabled = env.INDEXNOW_DISABLED;
  if (disabled === '1' || disabled === 'true') return false;
  const force = env.INDEXNOW_FORCE;
  if (force === '1' || force === 'true') return true;
  return env.VERCEL_ENV === 'production';
}

export function buildIndexNowPayload(urlList: string[], siteUrl = SITE_URL): IndexNowPayload {
  return {
    host: getIndexNowHost(siteUrl),
    key: INDEXNOW_KEY,
    keyLocation: getIndexNowKeyLocation(siteUrl),
    urlList,
  };
}

/** Page `<loc>` values from sitemap XML (skips sitemapindex files). */
export function extractSitemapPageUrls(xmlContents: string[]): string[] {
  const urls: string[] = [];
  const seen = new Set<string>();

  for (const xml of xmlContents) {
    if (!xml.includes('<url>') || xml.includes('<sitemapindex')) continue;
    for (const block of xml.matchAll(/<url\b[\s\S]*?<\/url>/gi)) {
      const loc = block[0].match(/<loc>\s*([^<]+?)\s*<\/loc>/i)?.[1]?.trim();
      if (!loc || seen.has(loc)) continue;
      seen.add(loc);
      urls.push(loc);
    }
  }

  return urls;
}

export function readSitemapXmlFiles(dir: URL): string[] {
  let root: string;
  try {
    root = fileURLToPath(dir);
  } catch {
    return [];
  }
  if (!fs.existsSync(root)) return [];

  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(root, { withFileTypes: true });
  } catch {
    return [];
  }

  const xmlContents: string[] = [];
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    if (!entry.name.startsWith('sitemap') || !entry.name.endsWith('.xml')) continue;
    try {
      xmlContents.push(fs.readFileSync(path.join(root, entry.name), 'utf8'));
    } catch {
      // ignore
    }
  }
  return xmlContents;
}

export async function submitIndexNow(
  urlList: string[],
  options: { fetchImpl?: typeof fetch; siteUrl?: string } = {},
): Promise<{ status: number; ok: boolean }> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const payload = buildIndexNowPayload(urlList, options.siteUrl);
  const res = await fetchImpl(INDEXNOW_ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
  });
  return { status: res.status, ok: res.status === 200 || res.status === 202 };
}

export async function pingIndexNowFromSitemapDir(
  dir: URL,
  options: {
    logger?: IndexNowLogger;
    env?: NodeJS.ProcessEnv;
    fetchImpl?: typeof fetch;
  } = {},
): Promise<'skipped' | 'empty' | 'submitted' | 'failed'> {
  const env = options.env ?? process.env;
  const logger = options.logger ?? { info() {}, warn() {} };

  if (!shouldSubmitIndexNow(env)) {
    logger.info('IndexNow skipped (not a production publish)');
    return 'skipped';
  }

  try {
    const urls = extractSitemapPageUrls(readSitemapXmlFiles(dir));
    if (urls.length === 0) {
      logger.warn('IndexNow skipped (no sitemap URLs found)');
      return 'empty';
    }

    let lastStatus = 0;
    for (let i = 0; i < urls.length; i += INDEXNOW_BATCH_LIMIT) {
      const batch = urls.slice(i, i + INDEXNOW_BATCH_LIMIT);
      const result = await submitIndexNow(batch, { fetchImpl: options.fetchImpl });
      lastStatus = result.status;
      if (!result.ok) {
        logger.warn(`IndexNow failed (${result.status}) for ${batch.length} URLs`);
        return 'failed';
      }
    }
    logger.info(`IndexNow submitted ${urls.length} URLs (${lastStatus})`);
    return 'submitted';
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logger.warn(`IndexNow failed: ${message}`);
    return 'failed';
  }
}

/** Astro integration: ping IndexNow after a production sitemap build. */
export function indexNowIntegration() {
  return {
    name: 'indexnow',
    hooks: {
      'astro:build:done': async ({ dir, logger }: { dir: URL; logger: IndexNowLogger }) => {
        try {
          await pingIndexNowFromSitemapDir(dir, { logger });
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          logger.warn(`IndexNow failed: ${message}`);
        }
      },
    },
  };
}
