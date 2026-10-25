import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';
import { isFeedListedPost } from '../utils/recipes';
import { buildRssFeed } from '../utils/rssFeed';

export async function GET() {
  const publishedPosts = await getCollection('blog', (entry) => isFeedListedPost(entry));
  return buildRssFeed(publishedPosts, {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    selfPath: '/rss.xml',
    language: 'en-us',
  });
}
