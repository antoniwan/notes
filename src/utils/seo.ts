import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL, AUTHOR, SEO_CONFIG } from '../consts';
import { SOCIAL_IMAGE_MANIFEST } from '../data/socialImageManifest';

// Simplified SEO configuration interface
export interface SEOConfig {
  title: string;
  description?: string;
  path?: string;
  heroImage?: string; // Primary image for social sharing
  imageAlt?: string;
  author?: string;
  keywords?: string[];
  pubDate?: Date;
  updatedDate?: Date;
  type?: 'website' | 'article';
  locale?: string;
  robots?: string;
}

// Simplified meta tags interface
export interface MetaTags {
  title: string;
  description: string;
  canonical: string;
  ogImage: string;
  ogImageAlt: string;
  author: string;
  keywords: string;
  pubDate?: string;
  updatedDate?: string;
  robots: string;
  locale: string;
  ogType: 'website' | 'article';
}

// Generate canonical URL
export function generateCanonicalUrl(path: string): string {
  return new URL(path, SITE_URL).href;
}

// Generate image URL for social/meta tags, with proper heroImage prioritization.
// Uses a build-time manifest to map AVIF (and other) originals to social-safe JPEG/PNG variants.
export function generateImageUrl(heroImage?: string): string {
  // Priority: heroImage > default social image
  const originalPath = heroImage || SEO_CONFIG.defaultImage;

  // If we have a generated social-safe variant for this path, prefer it.
  // Keys are web paths like "/foo/bar.avif".
  const socialPath = SOCIAL_IMAGE_MANIFEST[originalPath] || originalPath;

  return new URL(socialPath, SITE_URL).href;
}

// Detect Open Graph type
export function detectOGType(pubDate?: Date, type?: string): 'article' | 'website' {
  return pubDate || type === 'article' ? 'article' : 'website';
}

// Generate optimized meta tags
export function generateMetaTags(config: SEOConfig): MetaTags {
  const {
    title,
    description = SITE_DESCRIPTION,
    path,
    heroImage,
    imageAlt,
    author = AUTHOR.name,
    keywords = [],
    pubDate,
    updatedDate,
    type,
    locale = SEO_CONFIG.defaultLocale,
    robots = SEO_CONFIG.defaultRobots,
  } = config;

  // Special handling for homepage and different page types
  const isHomepage = path === '/' || path === '';
  const isAboutPage = path === '/about' || title.toLowerCase().includes('about antonio');
  const titleSuffix = 'Notes by Antonio Rodriguez Martinez';

  let fullTitle: string;
  if (isHomepage) {
    fullTitle = titleSuffix;
  } else if (isAboutPage) {
    fullTitle = 'About Antonio Rodriguez Martinez';
  } else {
    fullTitle = `${title} | ${titleSuffix}`;
  }
  const canonical = path ? generateCanonicalUrl(path) : '';
  const ogImage = generateImageUrl(heroImage);
  const ogImageAlt = imageAlt || `${title} - ${SITE_TITLE}`;
  const ogType = detectOGType(pubDate, type);

  return {
    title: fullTitle,
    description,
    canonical,
    ogImage,
    ogImageAlt,
    author,
    keywords: keywords.join(', '),
    pubDate: pubDate?.toISOString(),
    updatedDate: updatedDate?.toISOString(),
    robots,
    locale,
    ogType,
  };
}

// Generate keywords from tags and categories
export function generateKeywords(tags?: string[], categories?: string[]): string[] {
  const keywords: string[] = [];

  if (tags) keywords.push(...tags);
  if (categories) keywords.push(...categories);

  return [...new Set(keywords)]; // Remove duplicates
}

// Generate image alt text
export function generateImageAlt(title: string): string {
  return `${title} - ${SITE_TITLE}`;
}

// Generate enhanced sitemap data with priority and change frequency
export function generateSitemapData(
  urls: Array<{
    url: string;
    lastmod?: Date;
    changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    priority?: number;
    type?: 'article' | 'category' | 'tag' | 'page';
  }>,
) {
  return urls.map(({ url, lastmod, changefreq, priority, type }) => ({
    url,
    lastmod: lastmod?.toISOString(),
    changefreq: changefreq || (type === 'article' ? 'monthly' : 'weekly'),
    priority: priority || (type === 'article' ? 0.8 : 0.6),
  }));
}

// Generate robots.txt content with enhanced directives
export function generateRobotsTxt(sitemapUrl: string, additionalRules?: string[]) {
  const baseRules = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /api/',
    'Disallow: /admin/',
    'Disallow: /private/',
    'Disallow: /*.json$',
    'Disallow: /*.xml$',
    'Crawl-delay: 1',
    `Sitemap: ${sitemapUrl}`,
  ];

  return [...baseRules, ...(additionalRules || [])].join('\n');
}

// Generate enhanced meta description with better length optimization
export function generateOptimizedDescription(description: string, maxLength: number = 160): string {
  if (description.length <= maxLength) return description;

  // Try to break at sentence boundaries
  const sentences = description.split(/[.!?]+/);
  let optimized = '';

  for (const sentence of sentences) {
    const testLength = optimized.length + sentence.length + 1;
    if (testLength <= maxLength) {
      optimized += (optimized ? '. ' : '') + sentence;
    } else {
      break;
    }
  }

  // If we still don't have a good length, truncate at word boundary
  if (optimized.length < maxLength * 0.7) {
    const words = description.split(' ');
    optimized = '';

    for (const word of words) {
      const testLength = optimized.length + word.length + 1;
      if (testLength <= maxLength) {
        optimized += (optimized ? ' ' : '') + word;
      } else {
        break;
      }
    }
  }

  return optimized || description.substring(0, maxLength - 3) + '...';
}

// Constants for consistent usage
export const DEFAULT_ROBOTS = SEO_CONFIG.defaultRobots;
export const DEFAULT_LOCALE = SEO_CONFIG.defaultLocale;
