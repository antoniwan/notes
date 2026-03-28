export interface LetterboxdFeedItem {
  title: string;
  link: string;
  publishedAt?: string;
  summary?: string;
}

function stripHtml(html: string): string {
  return html
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function decodeXmlEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

/** Parse RSS 2.0 XML into normalized items (Letterboxd public feed). */
export function parseLetterboxdRssXml(xml: string): LetterboxdFeedItem[] {
  const items: LetterboxdFeedItem[] = [];
  const itemRegex = /<item\b[^>]*>([\s\S]*?)<\/item>/gi;
  let m: RegExpExecArray | null;
  while ((m = itemRegex.exec(xml)) !== null) {
    const block = m[1];
    const titleRaw = block.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? '';
    const linkRaw = block.match(/<link[^>]*>([\s\S]*?)<\/link>/i)?.[1] ?? '';
    const pubRaw = block.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i)?.[1];
    const descRaw = block.match(/<description[^>]*>([\s\S]*?)<\/description>/i)?.[1];

    const title = decodeXmlEntities(stripHtml(titleRaw));
    const link = decodeXmlEntities(linkRaw.replace(/\s+/g, '').trim());
    const publishedAt = pubRaw?.trim();
    const summary = descRaw ? stripHtml(descRaw).slice(0, 280) : undefined;

    if (title && link) {
      try {
        new URL(link);
        items.push({ title, link, publishedAt, summary });
      } catch {
        /* skip malformed link */
      }
    }
    if (items.length >= 24) break;
  }
  return items;
}

let cacheRssUrl: string | undefined;
let cacheItems: LetterboxdFeedItem[] | null = null;

/**
 * Fetches and parses the public Letterboxd RSS feed once per build (in-memory cache).
 * Returns [] when URL is missing, the response is not OK, or parsing/fetch fails.
 */
export async function getLetterboxdFeedItems(
  rssUrl: string | undefined,
): Promise<LetterboxdFeedItem[]> {
  const trimmed = rssUrl?.trim();
  if (!trimmed) return [];

  if (cacheItems !== null && cacheRssUrl === trimmed) {
    return cacheItems;
  }

  try {
    const res = await fetch(trimmed, {
      headers: { Accept: 'application/rss+xml, application/xml, text/xml, */*' },
    });
    if (!res.ok) {
      cacheRssUrl = trimmed;
      cacheItems = [];
      return [];
    }
    const text = await res.text();
    const items = parseLetterboxdRssXml(text).slice(0, 10);
    cacheRssUrl = trimmed;
    cacheItems = items;
    return items;
  } catch {
    cacheRssUrl = trimmed;
    cacheItems = [];
    return [];
  }
}
