import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL, AUTHOR } from '../consts';

export async function GET(context) {
  const posts = await getCollection('blog');
  const publishedPosts = posts.filter(
    (post) => !post.data.draft && post.data.published !== false,
  );

  // Sort by publication date (newest first)
  const sortedPosts = publishedPosts.sort(
    (a, b) => new Date(b.data.pubDate) - new Date(a.data.pubDate),
  );

  const feed = {
    version: 'https://jsonfeed.org/version/1.1',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    home_page_url: SITE_URL,
    feed_url: `${SITE_URL}/feed.json`,
    language: 'en-US',
    favicon: `${SITE_URL}/favicon.ico`,
    icon: `${SITE_URL}/images/default.avif`,
    authors: [
      {
        name: AUTHOR.name,
        email: AUTHOR.email,
        url: AUTHOR.url,
      },
    ],
    items: sortedPosts.map((post) => {
      // Get the full content for the feed
      let fullContent = post.body || post.data.description;

      // Build the full item content with image if available
      if (post.data.heroImage) {
        const imageUrl = post.data.heroImage.startsWith('http')
          ? post.data.heroImage
          : `${SITE_URL}${post.data.heroImage}`;
        fullContent = `<img src="${imageUrl}" alt="${post.data.title}" style="max-width: 100%; height: auto; margin-bottom: 1rem;" />\n\n${fullContent}`;
      }

      // Add reading time if available
      if (post.data.minutesRead) {
        fullContent = `<p><em>Reading time: ${post.data.minutesRead}</em></p>\n\n${fullContent}`;
      }

      return {
        id: `${SITE_URL}/p/${post.id}/`,
        url: `${SITE_URL}/p/${post.id}/`,
        title: post.data.title,
        content_html: fullContent,
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
        tags: [...(post.data.category || []), ...(post.data.tags || [])],
        // Add image if hero image exists
        ...(post.data.heroImage && {
          image: post.data.heroImage.startsWith('http')
            ? post.data.heroImage
            : `${SITE_URL}${post.data.heroImage}`,
        }),
        // Add external URL if this is a repost
        ...(post.data.external_url && {
          external_url: post.data.external_url,
        }),
      };
    }),
  };

  return new Response(JSON.stringify(feed, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/feed+json',
      'Cache-Control': 'public, max-age=3600', // 1 hour cache
    },
  });
}
