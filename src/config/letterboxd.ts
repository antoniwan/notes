function normalizeEnv(value: string | undefined): string | undefined {
  const trimmed = typeof value === 'string' ? value.trim() : '';
  return trimmed || undefined;
}

export interface LetterboxdConfig {
  /** Public profile URL for plain links (footer, About, media review pages). */
  profileUrl?: string;
  /** Public RSS URL for optional “recent activity” on media review pages only. */
  rssUrl?: string;
}

/**
 * Reads optional Letterboxd URLs from the environment (build / SSR).
 * Set in `.env.local` (local), `.env`, or Vercel: `LETTERBOXD_PROFILE_URL`, `LETTERBOXD_RSS_URL`.
 */
export function getLetterboxdConfig(): LetterboxdConfig {
  return {
    profileUrl: normalizeEnv(import.meta.env.LETTERBOXD_PROFILE_URL as string | undefined),
    rssUrl: normalizeEnv(import.meta.env.LETTERBOXD_RSS_URL as string | undefined),
  };
}
