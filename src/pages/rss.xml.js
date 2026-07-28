import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL, AUTHOR } from '../consts';
import { isFeedEligiblePost } from '../utils/publishFilters';

export async function GET() {
  const posts = await getCollection('blog');
  const publishedPosts = posts.filter((post) => isFeedEligiblePost(post.data));

  // Sort by publication date (newest first)
  const sortedPosts = publishedPosts.sort(
    (a, b) => new Date(b.data.pubDate) - new Date(a.data.pubDate),
  );

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: SITE_URL,
    language: 'en-US',
    lastBuildDate: new Date(),
    ttl: 60, // 1 hour cache
    managingEditor: `${AUTHOR.email} (${AUTHOR.name})`,
    webMaster: `${AUTHOR.email} (${AUTHOR.name})`,
    image: {
      url: `${SITE_URL}/images/default.avif`,
      title: SITE_TITLE,
      link: SITE_URL,
      width: 1200,
      height: 630,
    },
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
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.pubDate,
        updatedDate: post.data.updatedDate,
        link: `${SITE_URL}/p/${post.id}`,
        guid: `${SITE_URL}/p/${post.id}`,
        categories: post.data.category || [],
        author: post.data.author || AUTHOR.name,
        content: fullContent,
        // Add image enclosure if hero image exists
        ...(post.data.heroImage && {
          enclosure: {
            url: post.data.heroImage.startsWith('http')
              ? post.data.heroImage
              : `${SITE_URL}${post.data.heroImage}`,
            type: enclosureMimeType(post.data.heroImage),
            length: 0, // Length is optional for images
          },
        }),
        // Add comments URL if comments are enabled
        ...(post.data.showComments !== false && {
          comments: `${SITE_URL}/p/${post.id}#comments`,
        }),
      };
    }),
  });
}

function enclosureMimeType(imagePath) {
  const lower = imagePath.toLowerCase();
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.webp')) return 'image/webp';
  if (lower.endsWith('.gif')) return 'image/gif';
  if (lower.endsWith('.avif')) return 'image/avif';
  if (lower.endsWith('.svg')) return 'image/svg+xml';
  return 'image/jpeg';
}
