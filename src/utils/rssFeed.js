import rss from '@astrojs/rss';
import { SITE_TITLE, SITE_URL, AUTHOR } from '../consts';
import { buildFeedItemHtml, enclosureMimeType, feedImagePath, feedImageUrl } from './feedContent';

/**
 * The channel and items shared by the English feed and the Spanish one
 * (`/es/rss.xml`), so the two never drift apart.
 */
export async function buildRssFeed(publishedPosts, { title, description, selfPath, language }) {
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
        categories: [...new Set([...(post.data.category || []), ...(post.data.tags || [])])],
        // RSS 2.0 wants an address here; the name rides along in parentheses.
        author: `${AUTHOR.email} (${post.data.author || AUTHOR.name})`,
        content,
        ...(imagePath && {
          enclosure: {
            url: feedImageUrl(post.data.heroImage),
            type: enclosureMimeType(imagePath),
            length: 0,
          },
        }),
        ...(post.data.showComments !== false && {
          commentsUrl: `${SITE_URL}/p/${post.id}#comments`,
        }),
      };
    }),
  );

  return rss({
    title,
    description,
    site: SITE_URL,
    // @astrojs/rss only knows title, description, site and items at the channel
    // level; everything else has to go through customData or it is dropped.
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
    customData: [
      `<atom:link href="${SITE_URL}${selfPath}" rel="self" type="application/rss+xml"/>`,
      `<language>${language}</language>`,
      `<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
      '<ttl>60</ttl>',
      `<managingEditor>${AUTHOR.email} (${AUTHOR.name})</managingEditor>`,
      `<webMaster>${AUTHOR.email} (${AUTHOR.name})</webMaster>`,
      `<image><url>${feedImageUrl()}</url><title>${SITE_TITLE}</title><link>${SITE_URL}</link></image>`,
    ].join(''),
    items,
  });
}
