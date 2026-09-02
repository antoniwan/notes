import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL, AUTHOR } from '../consts';
import { isFeedEligiblePost } from '../utils/publishFilters';
import { buildFeedItemHtml, feedImageUrl } from '../utils/feedContent';

export async function GET() {
  const posts = await getCollection('blog');
  const publishedPosts = posts.filter((post) => isFeedEligiblePost(post.data));

  const sortedPosts = publishedPosts.sort(
    (a, b) => new Date(b.data.pubDate).valueOf() - new Date(a.data.pubDate).valueOf(),
  );

  const items = await Promise.all(
    sortedPosts.map(async (post) => {
      const contentHtml = await buildFeedItemHtml(post);

      return {
        id: `${SITE_URL}/p/${post.id}`,
        url: `${SITE_URL}/p/${post.id}`,
        title: post.data.title,
        content_html: contentHtml,
        content_text: post.data.description,
        summary: post.data.description,
        date_published: post.data.pubDate.toISOString(),
        date_modified: post.data.updatedDate?.toISOString() || post.data.pubDate.toISOString(),
        authors: [
          {
            name: post.data.author || AUTHOR.name,
            url: AUTHOR.url,
          },
        ],
        tags: post.data.tags || [],
        ...(post.data.heroImage && {
          image: feedImageUrl(post.data.heroImage),
        }),
      };
    }),
  );

  const feed = {
    version: 'https://jsonfeed.org/version/1.1',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    home_page_url: SITE_URL,
    feed_url: `${SITE_URL}/feed.json`,
    language: 'en-US',
    favicon: `${SITE_URL}/favicon.ico`,
    icon: feedImageUrl(),
    authors: [
      {
        name: AUTHOR.name,
        email: AUTHOR.email,
        url: AUTHOR.url,
      },
    ],
    items,
  };

  return new Response(JSON.stringify(feed, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/feed+json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
