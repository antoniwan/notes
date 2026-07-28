import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL, AUTHOR } from '../consts';
import { isFeedEligiblePost } from '../utils/publishFilters';
import {
  buildFeedItemHtml,
  enclosureMimeType,
  feedImagePath,
  feedImageUrl,
} from '../utils/feedContent';

export async function GET() {
  const posts = await getCollection('blog');
  const publishedPosts = posts.filter((post) => isFeedEligiblePost(post.data));

  const sortedPosts = publishedPosts.sort(
    (a, b) => new Date(b.data.pubDate).valueOf() - new Date(a.data.pubDate).valueOf(),
  );

  const items = await Promise.all(
    sortedPosts.map(async (post) => {
      const content = await buildFeedItemHtml(post);
      const imagePath = post.data.heroImage ? feedImagePath(post.data.heroImage) : null;

      return {
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.pubDate,
        updatedDate: post.data.updatedDate,
        link: `${SITE_URL}/p/${post.id}`,
        guid: `${SITE_URL}/p/${post.id}`,
        categories: post.data.category || [],
        author: post.data.author || AUTHOR.name,
        content,
        ...(imagePath && {
          enclosure: {
            url: feedImageUrl(post.data.heroImage),
            type: enclosureMimeType(imagePath),
            length: 0,
          },
        }),
        ...(post.data.showComments !== false && {
          comments: `${SITE_URL}/p/${post.id}#comments`,
        }),
      };
    }),
  );

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: SITE_URL,
    language: 'en-US',
    lastBuildDate: new Date(),
    ttl: 60,
    managingEditor: `${AUTHOR.email} (${AUTHOR.name})`,
    webMaster: `${AUTHOR.email} (${AUTHOR.name})`,
    image: {
      url: feedImageUrl(),
      title: SITE_TITLE,
      link: SITE_URL,
      width: 1200,
      height: 630,
    },
    items,
  });
}
