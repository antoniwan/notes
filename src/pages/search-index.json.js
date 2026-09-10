import { getSearchData } from '../data/searchIndex';

/**
 * The search corpus as a standalone asset (R19).
 *
 * It used to be inlined into every page as a JS string literal. Measured on the
 * build before this change, that was 83.4 KB raw / 19.2 KB gzip on a 47.8 KB
 * gzip article page — about 40% of each page's compressed HTML — repeated across
 * 261 of 262 pages.
 *
 * SearchBar fetches this once, on first intent, through a single shared promise.
 * Callers append `?v=<package version>` so a release busts both the HTTP cache
 * and the service worker's copy.
 */
export async function GET() {
  const data = await getSearchData();

  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      // Immutable per version because the URL carries one.
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
