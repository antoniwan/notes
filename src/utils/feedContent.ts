import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { loadRenderers } from 'astro:container';
import { getContainerRenderer as getMDXRenderer } from '@astrojs/mdx';
import { render, type CollectionEntry } from 'astro:content';
import { SITE_URL, SEO_CONFIG } from '../consts';
import { generateImageUrl } from './seo';
import { SOCIAL_IMAGE_MANIFEST } from '../data/socialImageManifest';

type BlogPost = CollectionEntry<'blog'>;

let containerPromise: Promise<AstroContainer> | null = null;

async function getFeedContainer(): Promise<AstroContainer> {
  if (!containerPromise) {
    containerPromise = (async () => {
      const renderers = await loadRenderers([getMDXRenderer()]);
      return AstroContainer.create({ renderers });
    })();
  }
  return containerPromise;
}

/** Absolute social-safe image URL (JPEG/PNG when a manifest entry exists). */
export function feedImageUrl(heroImage?: string): string {
  return generateImageUrl(heroImage);
}

/** Web path of the social-safe image (for MIME detection). */
export function feedImagePath(heroImage?: string): string {
  const originalPath = heroImage || SEO_CONFIG.defaultImage;
  return SOCIAL_IMAGE_MANIFEST[originalPath] || originalPath;
}

export function enclosureMimeType(imagePath: string): string {
  const lower = imagePath.toLowerCase();
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.webp')) return 'image/webp';
  if (lower.endsWith('.gif')) return 'image/gif';
  if (lower.endsWith('.svg')) return 'image/svg+xml';
  if (lower.endsWith('.avif')) return 'image/avif';
  return 'image/jpeg';
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Strip scripts/styles/handlers and absolutize same-origin href/src for feed readers. */
export function prepareFeedHtml(html: string, siteUrl: string = SITE_URL): string {
  const base = siteUrl.replace(/\/+$/, '');
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, '')
    .replace(/<object\b[^>]*>[\s\S]*?<\/object>/gi, '')
    .replace(/\s(on\w+)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/(href|src)\s*=\s*("|\')\s*javascript:[^"']*\2/gi, '$1="#"')
    .replace(/(href|src)="(\/[^"]*)"/g, (_m, attr: string, path: string) => `${attr}="${base}${path}"`)
    .replace(/(href|src)='(\/[^']*)'/g, (_m, attr: string, path: string) => `${attr}='${base}${path}'`);
}

/** Render a collection entry to HTML suitable for RSS/JSON Feed. */
export async function renderPostFeedHtml(post: BlogPost): Promise<string> {
  const container = await getFeedContainer();
  const { Content } = await render(post);
  const raw = await container.renderToString(Content);
  return prepareFeedHtml(raw);
}

/** Full item body: optional reading-time + hero, then rendered HTML. */
export async function buildFeedItemHtml(post: BlogPost): Promise<string> {
  const parts: string[] = [];

  if (post.data.minutesRead) {
    parts.push(`<p><em>Reading time: ${escapeHtml(post.data.minutesRead)}</em></p>`);
  }

  if (post.data.heroImage) {
    const src = feedImageUrl(post.data.heroImage);
    const alt = escapeHtml(post.data.imageAlt || post.data.title);
    parts.push(`<img src="${src}" alt="${alt}" />`);
  }

  parts.push(await renderPostFeedHtml(post));
  return parts.join('\n');
}
