const SEASONS = ['Spring', 'Summer', 'Fall', 'Winter'] as const;

export type Season = (typeof SEASONS)[number];

export interface SeasonalChapter<T> {
  id: string;
  title: string;
  year: number;
  season: Season;
  posts: T[];
}

/** UTC calendar seasons; January and February belong to the prior year's winter. */
export function groupPostsBySeason<T extends { id: string; data: { pubDate: Date } }>(
  posts: readonly T[],
): SeasonalChapter<T>[] {
  const chapters = new Map<string, SeasonalChapter<T>>();
  const seenIds = new Set<string>();

  for (const post of posts) {
    // Repeated inputs keep their first occurrence, including its publication date.
    if (seenIds.has(post.id)) continue;
    seenIds.add(post.id);

    const date = post.data.pubDate;
    if (!Number.isFinite(date.getTime())) {
      throw new RangeError(`Invalid publication date for post "${post.id}"`);
    }

    const month = date.getUTCMonth();
    const year = date.getUTCFullYear() - (month < 2 ? 1 : 0);
    const season = SEASONS[Math.floor(((month + 10) % 12) / 3)];
    const id = `${season.toLowerCase()}-${year}`;

    let chapter = chapters.get(id);
    if (!chapter) {
      chapter = { id, title: `${season} ${year}`, year, season, posts: [] };
      chapters.set(id, chapter);
    }
    chapter.posts.push(post);
  }

  return [...chapters.values()]
    .sort((a, b) => b.year - a.year || SEASONS.indexOf(b.season) - SEASONS.indexOf(a.season))
    .map((chapter) => ({
      ...chapter,
      posts: chapter.posts.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime()),
    }));
}

export interface ReadingProgress {
  total: number;
  read: number;
  remaining: number;
  percentage: number;
}

export function getReadingProgress(
  slugs: readonly string[],
  isRead: (slug: string) => boolean,
): ReadingProgress {
  const uniqueSlugs = [...new Set(slugs)];
  const total = uniqueSlugs.length;
  const read = uniqueSlugs.filter((slug) => isRead(slug)).length;

  return {
    total,
    read,
    remaining: total - read,
    percentage: total > 0 ? Math.round((read / total) * 100) : 0,
  };
}
