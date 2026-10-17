import { readFileSync, existsSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { describe, expect, it } from 'vitest';

const about = readFileSync('src/pages/about.astro', 'utf8');

describe('Movies migration', () => {
  it('removes the diary component and build-time feed dependency from Notes', () => {
    expect(about).not.toContain('LatestWatched');
    expect(about).not.toContain('fetchLetterboxdRecent');
    expect(about).not.toContain('about-films');
    expect(existsSync('src/components/LatestWatched.astro')).toBe(false);
    expect(existsSync('src/utils/letterboxd.ts')).toBe(false);
    expect(readFileSync('.env.example', 'utf8')).not.toContain('LETTERBOXD_');
  });

  it('preserves the old About movie-section anchor without redirecting the biography', () => {
    const script = about.match(/<script is:inline>([\s\S]*?)<\/script>/)?.[1];
    expect(script).toBeTruthy();
    for (const hash of ['', '#about-contact-heading', '#about-watched-heading']) {
      const destinations: string[] = [];
      runInNewContext(script!, {
        window: { location: { hash, replace: (url: string) => destinations.push(url) } },
      });
      expect(destinations).toEqual(
        hash === '#about-watched-heading'
          ? ['https://antoniwan.online/collections/movies#latest-watches']
          : [],
      );
    }
  });
});
