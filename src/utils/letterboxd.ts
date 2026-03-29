/**
 * Fetches recent diary entries from a Letterboxd RSS feed (build-time / server).
 * Expects LETTERBOXD_RSS_URL in env — same shape as https://letterboxd.com/{user}/rss/
 */

export interface LetterboxdWatch {
  filmTitle: string;
  filmYear: string;
  href: string;
  posterUrl: string | null;
  /** e.g. "4" or "3.5" for display + accessible label */
  memberRating: string | null;
  rewatch: boolean;
  watchedDate: string | null;
}

function extractTag(block: string, tag: string): string {
  const escaped = tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`<${escaped}[^>]*>([\\s\\S]*?)</${escaped}>`, 'i');
  const m = block.match(re);
  if (!m?.[1]) return '';
  return m[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, '$1').trim();
}

function extractPosterFromBlock(block: string): string | null {
  const desc = extractTag(block, 'description');
  const m = desc.match(/<img[^>]+src="([^"]+)"/i);
  return m?.[1] ?? null;
}

export async function fetchLetterboxdRecent(
  rssUrl: string,
  limit: number
): Promise<LetterboxdWatch[]> {
  if (!rssUrl?.trim()) return [];

  try {
    const res = await fetch(rssUrl.trim(), {
      headers: {
        Accept: 'application/rss+xml, application/xml, text/xml',
        'User-Agent': 'NotesAntoniwan/1.0 (+https://notes.antoniwan.online/about)',
      },
      signal: AbortSignal.timeout(12_000),
    });
    if (!res.ok) return [];

    const xml = await res.text();
    const chunks = xml.split(/<item>/i).slice(1);
    const out: LetterboxdWatch[] = [];

    for (const raw of chunks) {
      const block = raw.split(/<\/item>/i)[0] ?? raw;
      const filmTitle = extractTag(block, 'letterboxd:filmTitle');
      const link = extractTag(block, 'link');
      if (!filmTitle || !link) continue;

      const filmYear = extractTag(block, 'letterboxd:filmYear');
      const memberRating = extractTag(block, 'letterboxd:memberRating') || null;
      const rewatchRaw = extractTag(block, 'letterboxd:rewatch').toLowerCase();

      out.push({
        filmTitle,
        filmYear,
        href: link.replace(/\s+/g, '').trim(),
        posterUrl: extractPosterFromBlock(block),
        memberRating,
        rewatch: rewatchRaw === 'yes',
        watchedDate: extractTag(block, 'letterboxd:watchedDate') || null,
      });

      if (out.length >= limit) break;
    }

    return out;
  } catch {
    return [];
  }
}
