import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { buildWordIndex } from '../utils/browseSearch';
import { isTagListedPost } from '../utils/recipes';

/**
 * Every body word of the essays Browse lists, for Browse's full-text search.
 * Titles, descriptions, and topics are already in the page; this holds only
 * what they cannot.
 *
 * Browse fetches it once, on first intent, through a single shared promise.
 * Callers append `?v=<package version>` so a release busts both the HTTP cache
 * and the service worker's copy, as with search-index.json.
 */
export const GET: APIRoute = async () => {
  const posts = (await getCollection('blog', (entry) => isTagListedPost(entry))).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf() || a.id.localeCompare(b.id),
  );
  const index = buildWordIndex(posts.map((post) => ({ slug: post.id, body: post.body ?? '' })));

  return new Response(JSON.stringify(index), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      // Immutable per version because the URL carries one.
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
