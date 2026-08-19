import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { describe, expect, it, vi } from 'vitest';
import {
  INDEXNOW_ENDPOINT,
  INDEXNOW_FALLBACK_ENDPOINT,
  INDEXNOW_KEY,
  INDEXNOW_KEY_FILENAME,
  buildIndexNowPayload,
  extractSitemapPageUrls,
  pingIndexNowFromSitemapDir,
  readSitemapXmlFiles,
  shouldSubmitIndexNow,
} from './indexNow';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

function mockIndexNowFetch(postStatus = 200) {
  return vi.fn(async (url: string) => {
    if (String(url).includes(INDEXNOW_KEY_FILENAME)) {
      return new Response(INDEXNOW_KEY, { status: 200 });
    }
    return new Response('', { status: postStatus });
  });
}

describe('shouldSubmitIndexNow', () => {
  it('submits only on Vercel production by default', () => {
    expect(shouldSubmitIndexNow({})).toBe(false);
    expect(shouldSubmitIndexNow({ VERCEL_ENV: 'preview' })).toBe(false);
    expect(shouldSubmitIndexNow({ VERCEL_ENV: 'production' })).toBe(true);
  });

  it('honors force and disable flags', () => {
    expect(shouldSubmitIndexNow({ INDEXNOW_FORCE: '1' })).toBe(true);
    expect(shouldSubmitIndexNow({ VERCEL_ENV: 'production', INDEXNOW_DISABLED: '1' })).toBe(false);
  });
});

describe('IndexNow payload and sitemap parsing', () => {
  it('builds a protocol-valid payload', () => {
    const payload = buildIndexNowPayload(['https://notes.antoniwan.online/p/foo']);
    expect(payload).toEqual({
      host: 'notes.antoniwan.online',
      key: INDEXNOW_KEY,
      keyLocation: `https://notes.antoniwan.online/${INDEXNOW_KEY_FILENAME}`,
      urlList: ['https://notes.antoniwan.online/p/foo'],
    });
  });

  it('extracts page locs and ignores sitemap indexes', () => {
    const urls = extractSitemapPageUrls([
      `<?xml version="1.0"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>https://notes.antoniwan.online/sitemap-0.xml</loc></sitemap></sitemapindex>`,
      `<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://notes.antoniwan.online/</loc><lastmod>2026-08-12T00:00:00.000Z</lastmod></url><url><loc>https://notes.antoniwan.online/p/foo</loc></url></urlset>`,
    ]);
    expect(urls).toEqual([
      'https://notes.antoniwan.online/',
      'https://notes.antoniwan.online/p/foo',
    ]);
  });

  it('keeps the public key file in sync with INDEXNOW_KEY', () => {
    const keyPath = path.join(repoRoot, 'public', INDEXNOW_KEY_FILENAME);
    expect(fs.readFileSync(keyPath, 'utf8').trim()).toBe(INDEXNOW_KEY);
  });
});

describe('pingIndexNowFromSitemapDir', () => {
  it('skips when not a production publish', async () => {
    const fetchImpl = vi.fn();
    const result = await pingIndexNowFromSitemapDir(pathToFileURL(os.tmpdir()), {
      env: {},
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });
    expect(result).toBe('skipped');
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('posts sitemap URLs on production publish', async () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'indexnow-'));
    fs.writeFileSync(
      path.join(tmp, 'sitemap-0.xml'),
      `<urlset><url><loc>https://notes.antoniwan.online/p/foo</loc></url></urlset>`,
    );

    const fetchImpl = mockIndexNowFetch(200);
    const result = await pingIndexNowFromSitemapDir(pathToFileURL(tmp), {
      env: { VERCEL_ENV: 'production' },
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });

    expect(result).toBe('submitted');
    expect(fetchImpl).toHaveBeenCalledTimes(2);
    const call = fetchImpl.mock.calls[1] as unknown as [string, RequestInit];
    const [endpoint, init] = call;
    expect(endpoint).toBe(INDEXNOW_ENDPOINT);
    expect(JSON.parse(String(init.body))).toMatchObject({
      key: INDEXNOW_KEY,
      urlList: ['https://notes.antoniwan.online/p/foo'],
    });
  });

  it('skips a sitemap.xml directory next to real sitemap files', async () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'indexnow-'));
    fs.mkdirSync(path.join(tmp, 'sitemap.xml'));
    fs.writeFileSync(path.join(tmp, 'sitemap.xml', 'index.html'), '<html></html>');
    fs.writeFileSync(
      path.join(tmp, 'sitemap-0.xml'),
      `<urlset><url><loc>https://notes.antoniwan.online/p/foo</loc></url></urlset>`,
    );

    expect(readSitemapXmlFiles(pathToFileURL(tmp))).toHaveLength(1);

    const fetchImpl = mockIndexNowFetch(200);
    const result = await pingIndexNowFromSitemapDir(pathToFileURL(tmp), {
      env: { VERCEL_ENV: 'production' },
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });

    expect(result).toBe('submitted');
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it('skips when the live key file is not reachable yet', async () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'indexnow-'));
    fs.writeFileSync(
      path.join(tmp, 'sitemap-0.xml'),
      `<urlset><url><loc>https://notes.antoniwan.online/p/foo</loc></url></urlset>`,
    );

    const fetchImpl = vi.fn(async (_url: string) => new Response('not found', { status: 404 }));
    const result = await pingIndexNowFromSitemapDir(pathToFileURL(tmp), {
      env: { VERCEL_ENV: 'production' },
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });

    expect(result).toBe('skipped');
    expect(fetchImpl.mock.calls.map((call) => String(call[0]))).toEqual([
      `https://notes.antoniwan.online/${INDEXNOW_KEY_FILENAME}`,
    ]);
  });

  it('retries Bing when the shared endpoint returns 403', async () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'indexnow-'));
    fs.writeFileSync(
      path.join(tmp, 'sitemap-0.xml'),
      `<urlset><url><loc>https://notes.antoniwan.online/p/foo</loc></url></urlset>`,
    );

    const fetchImpl = vi.fn(async (url: string) => {
      if (String(url).includes(INDEXNOW_KEY_FILENAME)) {
        return new Response(INDEXNOW_KEY, { status: 200 });
      }
      if (String(url) === INDEXNOW_ENDPOINT) {
        return new Response('User is unauthorized to access the site', { status: 403 });
      }
      return new Response('', { status: 202 });
    });

    const result = await pingIndexNowFromSitemapDir(pathToFileURL(tmp), {
      env: { VERCEL_ENV: 'production' },
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });

    expect(result).toBe('submitted');
    expect(fetchImpl.mock.calls.map((call) => String(call[0]))).toEqual([
      `https://notes.antoniwan.online/${INDEXNOW_KEY_FILENAME}`,
      INDEXNOW_ENDPOINT,
      INDEXNOW_FALLBACK_ENDPOINT,
    ]);
  });

  it('does not throw when the output path is a file instead of a directory', async () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'indexnow-'));
    const file = path.join(tmp, 'not-a-dir');
    fs.writeFileSync(file, 'x');

    await expect(
      pingIndexNowFromSitemapDir(pathToFileURL(file), {
        env: { VERCEL_ENV: 'production' },
        fetchImpl: vi.fn() as unknown as typeof fetch,
      }),
    ).resolves.toBe('empty');
  });
});
