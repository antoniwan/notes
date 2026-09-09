import { afterEach, describe, expect, it, vi } from 'vitest';
import letterboxdFallback from '../data/letterboxdFallback.json';
import { fetchLetterboxdRecent } from './letterboxd';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('fetchLetterboxdRecent', () => {
  it('returns live items when the RSS parse succeeds', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => `<?xml version="1.0"?>
<rss><channel>
<item>
  <letterboxd:filmTitle>Live Film</letterboxd:filmTitle>
  <letterboxd:filmYear>2024</letterboxd:filmYear>
  <link>https://letterboxd.com/antoniwan/film/live-film/</link>
  <letterboxd:memberRating>4.0</letterboxd:memberRating>
  <letterboxd:rewatch>No</letterboxd:rewatch>
  <letterboxd:watchedDate>2026-09-01</letterboxd:watchedDate>
  <description><![CDATA[<img src="https://example.com/poster.jpg">]]></description>
</item>
</channel></rss>`,
      }),
    );

    const films = await fetchLetterboxdRecent('https://letterboxd.com/antoniwan/rss/', 12);
    expect(films).toHaveLength(1);
    expect(films[0]?.filmTitle).toBe('Live Film');
  });

  it('uses the committed fallback when the fetch fails', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('timeout')));

    const films = await fetchLetterboxdRecent('https://letterboxd.com/antoniwan/rss/', 3);
    expect(films).toHaveLength(3);
    expect(films[0]?.filmTitle).toBe(letterboxdFallback[0]?.filmTitle);
    expect(
      error.mock.calls.some(
        (call) =>
          String(call[0]).includes('LETTERBOXD FALLBACK') || String(call[0]).includes('last-known'),
      ),
    ).toBe(true);
  });

  it('uses the committed fallback when the feed is empty', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => '<rss><channel></channel></rss>',
      }),
    );

    const films = await fetchLetterboxdRecent('https://letterboxd.com/antoniwan/rss/', 2);
    expect(films).toHaveLength(2);
    expect(films.map((film) => film.filmTitle)).toEqual(
      letterboxdFallback.slice(0, 2).map((film) => film.filmTitle),
    );
  });
});
