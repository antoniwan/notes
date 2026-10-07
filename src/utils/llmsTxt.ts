import type { CollectionEntry } from 'astro:content';
import { SITE_URL } from '../consts';

/**
 * Agent-facing surfaces, per the llms.txt proposal (https://llmstxt.org).
 * `/llms.txt` lists every public post; `/p/<slug>.md` serves each post as
 * markdown. Both read the same collection the HTML pages read.
 */

type Post = CollectionEntry<'blog'>;

/** Markdown URL for a post: the page URL with `.md` appended. */
export function postMarkdownUrl(post: Pick<Post, 'id'>): string {
  return `${SITE_URL}/p/${post.id}.md`;
}

/** One line of prose: collapse newlines and runs of spaces. */
export function oneLine(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

export function isoDay(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** `- [Title](url.md): YYYY-MM-DD. Description` */
export function llmsListItem(post: Post): string {
  const title = oneLine(post.data.title).replace(/[[\]]/g, '');
  return `- [${title}](${postMarkdownUrl(post)}): ${isoDay(post.data.pubDate)}. ${oneLine(post.data.description)}`;
}

/**
 * MDX bodies start with `import` lines for images and components. They mean
 * nothing outside the build, so the markdown copy drops them. Component tags in
 * the body stay; they are rare and still readable.
 */
export function stripMdxModuleLines(body: string): string {
  return body.replace(/^(import|export)\s.*$\n?/gm, '').trimStart();
}
