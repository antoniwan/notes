import { describe, expect, it } from 'vitest';
import {
  EXTERNAL_LINK_CLASS,
  isExternalHref,
  rehypeExternalLinks,
} from './rehypeExternalLinks.mjs';

type UnistNode = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: UnistNode[];
};

const link = (href: string, children: UnistNode[] = [{ type: 'text', value: 'x' }]): UnistNode => ({
  type: 'element',
  tagName: 'a',
  properties: { href },
  children,
});

describe('isExternalHref', () => {
  it('treats other hosts as external, including the author’s other sites', () => {
    expect(isExternalHref('https://epoch.ai/about')).toBe(true);
    expect(isExternalHref('https://antoniwan.online/')).toBe(true);
  });

  it('treats Notes, relative links, anchors and mail links as internal', () => {
    expect(isExternalHref('https://notes.antoniwan.online/p/panda-and-wolf')).toBe(false);
    expect(isExternalHref('/about#how-i-write')).toBe(false);
    expect(isExternalHref('#cyber-samurai')).toBe(false);
    expect(isExternalHref('mailto:hi@example.com')).toBe(false);
  });
});

describe('rehypeExternalLinks', () => {
  it('adds the class to external links and keeps existing classes', () => {
    const external = link('https://epoch.ai/about');
    external.properties!.className = ['link'];
    const internal = link('/about');
    const tree: UnistNode = {
      type: 'root',
      children: [{ type: 'element', tagName: 'p', children: [external, internal] }],
    };

    rehypeExternalLinks()(tree);

    expect(external.properties?.className).toEqual(['link', EXTERNAL_LINK_CLASS]);
    expect(internal.properties?.className).toBeUndefined();
  });

  it('skips a link that only wraps an image', () => {
    const imageLink = link('https://example.com/photo', [
      { type: 'element', tagName: 'img', properties: { src: '/a.png' }, children: [] },
    ]);
    const tree: UnistNode = { type: 'root', children: [imageLink] };

    rehypeExternalLinks()(tree);

    expect(imageLink.properties?.className).toBeUndefined();
  });
});
