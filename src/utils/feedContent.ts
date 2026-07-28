import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { loadRenderers } from 'astro:container';
import { getContainerRenderer as getMDXRenderer } from '@astrojs/mdx';
import { render, type CollectionEntry } from 'astro:content';
import { SEO_CONFIG } from '../consts';
import { generateImageUrl } from './seo';
import { SOCIAL_IMAGE_MANIFEST } from '../data/socialImageManifest';
import { prepareFeedHtml } from './feedHtml';

export { enclosureMimeType, prepareFeedHtml } from './feedHtml';

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

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
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
