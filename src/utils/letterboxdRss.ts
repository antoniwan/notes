export interface LetterboxdFeedItem {
  title: string;
  link: string;
  publishedAt?: string;
  summary?: string;
  /** RSS `dc:creator` when present. */
  creator?: string;
  /** `letterboxd:filmTitle` — clean title without stars. */
  filmTitle?: string;
  /** `letterboxd:filmYear` */
  filmYear?: number;
  /** `letterboxd:memberRating` (0.5 steps); absent on some entries (e.g. logged without stars). */
  memberRating?: number;
  /** `letterboxd:rewatch` */
  rewatch?: boolean;
  /** `letterboxd:memberLike` */
  memberLike?: boolean;
  /** `letterboxd:watchedDate` (YYYY-MM-DD). */
  watchedDate?: string;
  /** `tmdb:movieId` — public in RSS; genres are *not* included (would need a separate TMDB API call). */
  tmdbMovieId?: number;
  /** First poster `img` src from item `description`. */
  posterUrl?: string;
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

/** Match exact RSS tag names including namespace (e.g. `letterboxd:filmTitle`, `dc:creator`). */
function tagContent(block: string, fullTagName: string): string | undefined {
  const esc = fullTagName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`<${esc}>([^<]*)</${esc}>`, 'i');
  const m = block.match(re);
  const v = m?.[1]?.trim();
  return v || undefined;
}

function letterboxdField(block: string, field: string): string | undefined {
  return tagContent(block, `letterboxd:${field}`);
}

function tmdbMovieId(block: string): number | undefined {
  const raw = tagContent(block, 'tmdb:movieId');
  if (!raw) return undefined;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) ? n : undefined;
}

function posterFromDescription(descRaw: string | undefined): string | undefined {
  if (!descRaw) return undefined;
  const inner = descRaw.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/i, '$1');
  const m = inner.match(/<img[^>]+src=["']([^"']+)["']/i);
  const url = m?.[1]?.trim();
  if (!url) return undefined;
  try {
    new URL(url);
    return url;
  } catch {
    return undefined;
  }
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
    const creatorRaw = tagContent(block, 'dc:creator');

    const title = decodeXmlEntities(stripHtml(titleRaw));
    const link = decodeXmlEntities(linkRaw.replace(/\s+/g, '').trim());
    const publishedAt = pubRaw?.trim();
    const summary = descRaw ? stripHtml(descRaw).slice(0, 280) : undefined;
    const creator = creatorRaw ? decodeXmlEntities(creatorRaw) : undefined;

    const filmTitleRaw = letterboxdField(block, 'filmTitle');
    const filmTitle = filmTitleRaw ? decodeXmlEntities(filmTitleRaw) : undefined;
    const yearRaw = letterboxdField(block, 'filmYear');
    const filmYear = yearRaw ? parseInt(yearRaw, 10) : undefined;
    const ratingRaw = letterboxdField(block, 'memberRating');
    const memberRating = ratingRaw !== undefined ? parseFloat(ratingRaw) : undefined;
    const rewatchRaw = letterboxdField(block, 'rewatch');
    const rewatch = rewatchRaw === 'Yes' ? true : rewatchRaw === 'No' ? false : undefined;
    const likeRaw = letterboxdField(block, 'memberLike');
    const memberLike = likeRaw === 'Yes' ? true : likeRaw === 'No' ? false : undefined;
    const watchedDate = letterboxdField(block, 'watchedDate');
    const tmdbId = tmdbMovieId(block);
    const posterUrl = posterFromDescription(descRaw);

    if (title && link) {
      try {
        new URL(link);
        items.push({
          title,
          link,
          publishedAt,
          summary,
          creator,
          filmTitle,
          filmYear: Number.isFinite(filmYear) ? filmYear : undefined,
          memberRating:
            ratingRaw !== undefined && Number.isFinite(memberRating) ? memberRating : undefined,
          rewatch,
          memberLike,
          watchedDate,
          tmdbMovieId: tmdbId,
          posterUrl,
        });
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
