import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL } from '../consts';
import { isFeedListedPost } from '../utils/recipes';

/** How many posts `/latest.json` lists. */
const LATEST_COUNT = 10;

/**
 * The newest posts as a small JSON Feed: title, link, date, and summary, with
 * no post bodies. `/feed.json` carries every post in full (over 1 MB), which
 * is too much for another site to fetch on each page view. antoniwan.online
 * reads this file to keep its "Writing" list current between its own builds.
 */
export async function GET() {
  const posts = (await getCollection('blog', (entry) => isFeedListedPost(entry)))
    .sort((a, b) => new Date(b.data.pubDate).valueOf() - new Date(a.data.pubDate).valueOf())
    .slice(0, LATEST_COUNT);

  const feed = {
    version: 'https://jsonfeed.org/version/1.1',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    home_page_url: SITE_URL,
    feed_url: `${SITE_URL}/latest.json`,
    language: 'en-US',
    items: posts.map((post) => ({
      id: `${SITE_URL}/p/${post.id}`,
      url: `${SITE_URL}/p/${post.id}`,
      title: post.data.title,
      summary: post.data.description,
      date_published: post.data.pubDate.toISOString(),
    })),
  };

  return new Response(JSON.stringify(feed), {
    status: 200,
    headers: { 'Content-Type': 'application/feed+json' },
  });
}
