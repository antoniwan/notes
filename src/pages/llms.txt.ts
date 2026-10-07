import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { AUTHOR, SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from '../consts';
import { isCollectionPublic, isSpanishPrimary } from '../utils/publishFilters';
import { isRecipePost } from '../utils/recipes';
import { llmsListItem } from '../utils/llmsTxt';

export const prerender = true;

export const GET: APIRoute = async () => {
  const posts = (await getCollection('blog', ({ data }) => isCollectionPublic(data))).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );

  const recipes = posts.filter((post) => isRecipePost(post));
  const spanish = posts.filter((post) => !isRecipePost(post) && isSpanishPrimary(post.data));
  const essays = posts.filter((post) => !isRecipePost(post) && !isSpanishPrimary(post.data));

  const body = `# ${SITE_TITLE} by ${AUTHOR.name}

> ${SITE_DESCRIPTION}

${SITE_TITLE} is the personal writing site of ${AUTHOR.name}. Most essays are in English; some are in Spanish, and some exist in both. Every post is also served as markdown at its URL plus \`.md\`, which is what the links below point to. Each link note starts with the publish date.

## Essays

${essays.map(llmsListItem).join('\n')}

## En español

${spanish.map(llmsListItem).join('\n')}

## Recipes

${recipes.map(llmsListItem).join('\n')}

## Optional

- [About](${SITE_URL}/about): who writes this site and why
- [Everything](${SITE_URL}/everything): every post, as an HTML index
- [RSS feed](${SITE_URL}/rss.xml): English essays with full text
- [JSON Feed](${SITE_URL}/feed.json): the same essays as JSON
- [antoniwan.online](${AUTHOR.url}): links to everything else ${AUTHOR.name} makes
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
