import { getCollection } from 'astro:content';
import { SITE_TITLE } from '../../consts';
import { isSpanishListed } from '../../utils/publishFilters';
import { buildRssFeed } from '../../utils/rssFeed';

// The main feed is English only; Spanish readers follow this one.
export async function GET() {
  const posts = await getCollection('blog', ({ data }) => isSpanishListed(data));
  return buildRssFeed(posts, {
    title: `${SITE_TITLE} en español`,
    description: 'Ensayos, poemas y notas de Antonio Rodríguez Martínez, en español.',
    selfPath: '/es/rss.xml',
    language: 'es-pr',
  });
}
