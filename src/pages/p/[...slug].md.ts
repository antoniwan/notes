import type { APIRoute, GetStaticPaths } from 'astro';
import { type CollectionEntry, getCollection } from 'astro:content';
import { AUTHOR, SITE_URL } from '../../consts';
import { isCollectionPublic } from '../../utils/publishFilters';
import { isoDay, oneLine, stripMdxModuleLines } from '../../utils/llmsTxt';

export const prerender = true;

/** Same posts as `[...slug].astro`, served as markdown at `/p/<slug>.md`. */
export const getStaticPaths = (async () => {
  const posts = await getCollection('blog', ({ data }) => isCollectionPublic(data));
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) => {
  const { post } = props as { post: CollectionEntry<'blog'> };
  const { data } = post;

  const facts = [
    `- Author: ${data.author || AUTHOR.name}`,
    `- Published: ${isoDay(data.pubDate)}`,
    data.updatedDate ? `- Updated: ${isoDay(data.updatedDate)}` : null,
    `- Language: ${data.language.join(', ')}`,
    `- Canonical: ${SITE_URL}/p/${post.id}`,
  ].filter(Boolean);

  const body = `# ${oneLine(data.title)}

> ${oneLine(data.description)}

${facts.join('\n')}

${stripMdxModuleLines(post.body ?? '')}`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
