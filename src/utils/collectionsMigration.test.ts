import { readFileSync } from 'node:fs';
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
});
