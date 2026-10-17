import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { describe, expect, it } from 'vitest';
import { mainNavigation } from '../data/navigation';
import { buildSeoRedirects } from './seoRouting';

const destinations = {
  '/books': 'https://antoniwan.online/projects',
  '/library': 'https://antoniwan.online/collections/books',
  '/library/books': 'https://antoniwan.online/collections/books',
};

describe('Collections migration', () => {
  it('redirects catalogues without creating a second authored-book home', () => {
    const redirects = buildSeoRedirects();
    for (const [source, destination] of Object.entries(destinations))
      expect(redirects[source]).toBe(destination);
    const paths = mainNavigation.flatMap((item) =>
      item.dropdown ? item.dropdown.items.map((link) => link.href) : [item.href],
    );
    expect(mainNavigation.map((item) => item.label)).not.toContain('Collections');
    expect(
      paths.some((path) => /cookbook|collections|\/books|\/library|\/recipes/.test(path)),
    ).toBe(false);
    expect(readFileSync('src/components/Footer.astro', 'utf8')).not.toContain(
      "label: 'Collections'",
    );
    expect(readFileSync('src/components/MobileNav.astro', 'utf8')).not.toContain(
      'id="mobile-menu-collections"',
    );
    expect(readFileSync('src/pages/index.astro', 'utf8')).not.toContain('class="home-books"');
  });

  it('handles old catalogue requests before accessing offline caches', () => {
    const handlers = new Map<string, (event: unknown) => void>();
    runInNewContext(readFileSync('public/sw.js', 'utf8'), {
      self: {
        location: new URL('https://notes.antoniwan.online/sw.js?v=6.36.0'),
        addEventListener: (name: string, handler: (event: unknown) => void) =>
          handlers.set(name, handler),
      },
      URL,
      Response,
      Set,
      console,
      caches: new Proxy(
        {},
        {
          get() {
            throw new Error('Moved catalogues must not use the old cache');
          },
        },
      ),
    });
    for (const [source, destination] of Object.entries(destinations))
      for (const suffix of ['', '/']) {
        let response: Response | undefined;
        handlers.get('fetch')!({
          request: {
            method: 'GET',
            url: `https://notes.antoniwan.online${source}${suffix}?q=meditations&status=in-progress`,
          },
          respondWith: (value: Response) => {
            response = value;
          },
        });
        expect(response?.status).toBe(301);
        expect(response?.headers.get('location')).toBe(
          destination + '?q=meditations&status=in-progress',
        );
      }
  });
});
