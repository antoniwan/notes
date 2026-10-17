import { readFileSync, readdirSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { describe, expect, it } from 'vitest';
import { COOKBOOK_URL, cookbookRecipes, buildCookbookRedirects } from '../data/cookbook';
import { buildSeoRedirects } from './seoRouting';
import { mainNavigation } from '../data/navigation';

describe('Cookbook cutover', () => {
  it('accounts for every archived recipe and preserves all language-specific slugs', () => {
    const sources = readdirSync('src/content/p/recipes')
      .filter((file) => /\.mdx?$/.test(file))
      .map((file) => file.replace(/\.mdx?$/, ''))
      .sort();
    expect(cookbookRecipes.map((recipe) => recipe.slug).sort()).toEqual(sources);
    expect(cookbookRecipes).toHaveLength(40);
    expect(new Set(cookbookRecipes.map((recipe) => recipe.slug)).size).toBe(40);
    expect(cookbookRecipes.filter((recipe) => recipe.language === 'es')).toHaveLength(12);
    const redirects = buildSeoRedirects();
    for (const recipe of cookbookRecipes) {
      for (const prefix of ['/p/recipes/', '/blog/recipes/']) {
        expect(redirects[prefix + recipe.slug]).toBe(`${COOKBOOK_URL}/recipes/${recipe.slug}`);
        expect(redirects[prefix + recipe.slug + '.md']).toBe(
          `${COOKBOOK_URL}/recipes/${recipe.slug}.md`,
        );
      }
    }
    expect(redirects['/recipes']).toBe(COOKBOOK_URL + '/');
    expect(redirects['/p/lemon-pepper-chicken']).toBe(
      `${COOKBOOK_URL}/recipes/lemon-pepper-chicken`,
    );
  });

  it('puts Cookbook redirects before host and generic alias rules on Vercel', () => {
    const config = JSON.parse(readFileSync('vercel.json', 'utf8'));
    const genericIndex = config.redirects.findIndex(
      (rule: { source: string }) => rule.source === '/:path+/',
    );
    for (const source of [
      '/recipes',
      '/p/recipes/:slug',
      '/blog/recipes/:slug',
      '/p/lemon-pepper-chicken',
      '/blog/lemon-pepper-chicken',
    ]) {
      const index = config.redirects.findIndex(
        (rule: { source: string }) => rule.source === source,
      );
      expect(index).toBeGreaterThanOrEqual(0);
      expect(index).toBeLessThan(genericIndex);
      expect(config.redirects[index].statusCode).toBe(301);
      expect(config.redirects[index].destination).toMatch(
        /^https:\/\/cookbook\.antoniwan\.online\//,
      );
    }
    expect(
      mainNavigation.some((item) => item.label === 'Collections' || item.label === 'Cookbook'),
    ).toBe(false);
  });

  it('redirects migrated recipe requests before consulting offline caches', () => {
    const handlers = new Map<string, (event: unknown) => void>();
    runInNewContext(readFileSync('public/sw.js', 'utf8'), {
      self: {
        location: new URL('https://notes.antoniwan.online/sw.js?v=6.35.0'),
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
            throw new Error('Migrated recipes must not consult the Notes cache');
          },
        },
      ),
    });
    for (const [source, destination] of Object.entries(buildCookbookRedirects())) {
      for (const suffix of ['', '/']) {
        let response: Response | undefined;
        handlers.get('fetch')!({
          request: {
            method: 'GET',
            url: `https://notes.antoniwan.online${source}${suffix}?from=bookmark`,
          },
          respondWith: (value: Response) => {
            response = value;
          },
        });
        expect(response?.status).toBe(301);
        expect(response?.headers.get('location')).toBe(destination + '?from=bookmark');
      }
    }
  });
});
