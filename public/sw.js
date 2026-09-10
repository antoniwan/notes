/**
 * Service worker for Notes.
 *
 * ## The offline promise
 *
 * Everything you have already looked at stays readable offline: the article
 * pages you opened, the images in them, the browse pages you navigated through,
 * and the site's CSS, JS, and fonts. Anything you have never opened is not
 * available offline, and the offline page says so.
 *
 * It deliberately does NOT pre-download the whole site. Measured against this
 * build, reader-facing output is roughly 118 MB — 25.9 MB of article HTML across
 * 129 posts (about 205 KB per page), 67.3 MB of images, and about 24 MB of
 * listing pages. Precaching that on a first visit would cost a reader more data
 * than most phone plans enjoy, take minutes, and be re-fetched on every deploy.
 * Caching as you read gets the same practical result — your reading is available
 * offline — for a few hundred KB per article.
 *
 * `/social/` (30.3 MB of Open Graph cards) is never cached: those exist for
 * crawlers and link previews, and a reader never displays one.
 *
 * ## Cache layout
 *
 * Every cache name begins with CACHE_PREFIX. Activation deletes only caches
 * carrying that prefix from an older version, so a cache belonging to anything
 * else on this origin survives an upgrade.
 */

const DEBUG = self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1';

const SW_VERSION = new URL(self.location.href).searchParams.get('v') || 'dev';
const CACHE_PREFIX = 'notes-';
const SHELL_CACHE = `${CACHE_PREFIX}shell-v${SW_VERSION}`;
const ASSET_CACHE = `${CACHE_PREFIX}assets-v${SW_VERSION}`;
const PAGE_CACHE = `${CACHE_PREFIX}pages-v${SW_VERSION}`;
const IMAGE_CACHE = `${CACHE_PREFIX}images-v${SW_VERSION}`;

const OWNED_CACHES = new Set([SHELL_CACHE, ASSET_CACHE, PAGE_CACHE, IMAGE_CACHE]);

/**
 * Entry ceilings. The Cache API returns keys in insertion order, so trimming
 * from the front is FIFO, not true LRU — a page you reread often can still be
 * evicted. That is an accepted trade for not tracking access times.
 */
const CACHE_LIMITS = {
  [ASSET_CACHE]: 120,
  [PAGE_CACHE]: 120,
  [IMAGE_CACHE]: 250,
};

/** Small enough to fetch on install without making the first visit feel slow. */
const SHELL_FILES = [
  '/',
  '/offline.html',
  '/images/default.avif',
  '/favicon.ico',
  '/favicon.svg',
  '/apple-touch-icon.png',
];

const ASSET_EXTENSIONS = /\.(css|js|mjs|woff2?|ttf|otf|eot)$/i;
// AVIF is this site's primary image format. Its absence from the old matcher
// meant no article image was ever cached.
const IMAGE_EXTENSIONS = /\.(avif|webp|png|jpe?g|gif|svg|ico)$/i;

function log(...args) {
  if (DEBUG) console.log('[sw]', ...args);
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(SHELL_CACHE);
      // Individually, so one missing file cannot fail the whole install the way
      // cache.addAll() would.
      await Promise.all(
        SHELL_FILES.map(async (file) => {
          try {
            const response = await fetch(file, { cache: 'reload' });
            if (response.ok) await cache.put(file, response);
          } catch (error) {
            log('shell fetch failed', file, error);
          }
        }),
      );
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names.map((name) => {
          // Only this worker's own caches are eligible for deletion. The old
          // code deleted every cache on the origin except its current two.
          if (!name.startsWith(CACHE_PREFIX)) return undefined;
          if (OWNED_CACHES.has(name)) return undefined;
          log('deleting stale cache', name);
          return caches.delete(name);
        }),
      );
      await self.clients.claim();
    })(),
  );
});

/** Drops the oldest entries once a cache passes its ceiling. */
async function trimCache(cacheName) {
  const limit = CACHE_LIMITS[cacheName];
  if (!limit) return;
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length <= limit) return;
  const excess = keys.slice(0, keys.length - limit);
  await Promise.all(excess.map((key) => cache.delete(key)));
  log('trimmed', cacheName, 'by', excess.length);
}

/** Stores a response and enforces the ceiling. Awaited by every caller. */
async function putAndTrim(cacheName, request, response) {
  const cache = await caches.open(cacheName);
  await cache.put(request, response);
  await trimCache(cacheName);
}

function isSameOrigin(url) {
  return url.origin === self.location.origin;
}

/** Open Graph artwork: crawler-facing, never displayed to a reader. */
function isSocialCard(url) {
  return url.pathname.startsWith('/social/');
}

function isDocumentRequest(request) {
  return request.mode === 'navigate' || (request.headers.get('accept') || '').includes('text/html');
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (!url.protocol.startsWith('http')) return;

  // Cross-origin traffic — comment avatars, embeds — is left entirely alone.
  // The old asset matcher keyed off the file extension and would happily store
  // another origin's files in this site's cache.
  if (!isSameOrigin(url)) return;

  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  if (isSocialCard(url)) return;

  if (IMAGE_EXTENSIONS.test(url.pathname)) {
    event.respondWith(cacheFirst(event, IMAGE_CACHE));
    return;
  }

  if (ASSET_EXTENSIONS.test(url.pathname)) {
    event.respondWith(cacheFirst(event, ASSET_CACHE));
    return;
  }

  if (isDocumentRequest(request)) {
    // Every browse page, not just '/' and '/p/'. Category, tag, Cookbook,
    // Everything, and the static pages were previously passed straight to the
    // network with no offline behavior at all.
    event.respondWith(handlePageRequest(event));
    return;
  }

  // Anything else (feeds, sitemap, manifest) goes to the network untouched.
});

/** Quotes and the Remark42 proxy are network-only; nothing is ever stored. */
async function handleApiRequest(request) {
  try {
    return await fetch(request);
  } catch {
    return new Response(JSON.stringify({ error: 'Offline - API unavailable' }), {
      status: 503,
      statusText: 'Service Unavailable',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    });
  }
}

/**
 * Serve from cache, then refresh in the background.
 *
 * The revalidation is attached to the event, so the browser keeps the worker
 * alive until the write finishes. Previously it was a floating promise whose
 * cache.put was never awaited, so a worker that shut down after responding could
 * lose the update.
 */
async function cacheFirst(event, cacheName) {
  const { request } = event;
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const revalidate = (async () => {
    try {
      const response = await fetch(request);
      if (response.ok) await putAndTrim(cacheName, request, response.clone());
      return response;
    } catch (error) {
      log('revalidate failed', request.url, error);
      return null;
    }
  })();

  if (cached) {
    event.waitUntil(revalidate);
    return cached;
  }

  const network = await revalidate;
  if (network) return network;

  // Offline with nothing stored. A placeholder is better than a broken image
  // for article artwork; everything else gets an honest error.
  if (IMAGE_EXTENSIONS.test(new URL(request.url).pathname)) {
    const fallback = await caches.match('/images/default.avif');
    if (fallback) return fallback;
  }
  return Response.error();
}

/**
 * Pages are network-first so a reader online always sees current content, with
 * the cached copy as the offline fallback.
 */
async function handlePageRequest(event) {
  const { request } = event;

  try {
    const response = await fetch(request);
    if (response.ok) {
      event.waitUntil(putAndTrim(PAGE_CACHE, request, response.clone()));
    }
    return response;
  } catch {
    const cached = await caches.match(request, { ignoreSearch: true });
    if (cached) return cached;

    const offline = await caches.match('/offline.html');
    if (offline) return offline;

    return new Response(
      '<!doctype html><meta charset="utf-8">' +
        '<title>Offline</title>' +
        '<p>This page is not available offline. Pages you have already opened are.</p>',
      { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
    );
  }
}

// No push, notification, or background-sync handlers: nothing in the site uses
// them. The previous background-sync handler walked the page cache deleting
// '/api/' entries, which cannot exist because API traffic is never stored.

self.addEventListener('message', (event) => {
  const data = event.data;
  if (!data) return;

  if (data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (data.type === 'GET_VERSION' && event.ports && event.ports[0]) {
    event.ports[0].postMessage({ version: SW_VERSION, caches: [...OWNED_CACHES] });
  }
});
