import type { CollectionEntry } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL, AUTHOR } from '../consts';
import { generateCanonicalUrl, generateImageUrl } from './seo';

// Enhanced structured data options
export interface StructuredDataOptions {
  title: string;
  description: string;
  path: string;
  type?: 'website' | 'article' | 'category' | 'tag' | 'recipe';
  // Article-specific fields
  pubDate?: Date;
  updatedDate?: Date;
  heroImage?: string;
  keywords?: string[];
  minutesRead?: string; // Reading time from remark plugin
  // Collection-specific fields
  posts?: CollectionEntry<'blog'>[];
  identifier?: string;
  // Enhanced fields for better SEO
  category?: string[];
  tags?: string[];
  tableOfContents?: boolean;
  hasComments?: boolean;
  featured?: boolean;
  draft?: boolean;
  inLanguage?: string;
  wordCount?: number;
  // Recipe-specific fields (omit from JSON-LD when empty)
  recipeIngredient?: string[];
  recipeInstructions?: string[];
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  recipeYield?: string;
  recipeCategory?: string;
  recipeCuisine?: string;
}

/**
 * Antonio, as every schema on Notes names him. antoniwan.online holds the full
 * Person under the same @id; Notes points at it instead of describing him again.
 */
export const authorRef = {
  '@type': 'Person',
  '@id': AUTHOR.id,
  name: AUTHOR.name,
  alternateName: AUTHOR.alternateName,
  url: AUTHOR.url,
};

function presentString(value?: string): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function presentList(value?: string[]): string[] | undefined {
  if (!value?.length) return undefined;
  const cleaned = value.map((item) => item.trim()).filter(Boolean);
  return cleaned.length > 0 ? cleaned : undefined;
}

/** Accept ISO-8601 durations or a minute count; omit anything else. */
export function toIso8601Duration(value?: string): string | undefined {
  const trimmed = presentString(value);
  if (!trimmed) return undefined;
  if (/^P/i.test(trimmed)) return trimmed.toUpperCase();
  const minutes = Number(trimmed);
  if (Number.isFinite(minutes) && minutes > 0) return `PT${Math.round(minutes)}M`;
  return undefined;
}

// Generate enhanced structured data with improved SEO
export function generateStructuredData(options: StructuredDataOptions) {
  const {
    title,
    description,
    path,
    type = 'website',
    pubDate,
    updatedDate,
    heroImage,
    keywords = [],
    minutesRead,
    posts = [],
    identifier,
    category = [],
    tags = [],
    tableOfContents = false,
    featured = false,
    draft = false,
    inLanguage = 'en-US',
    wordCount,
    recipeIngredient,
    recipeInstructions,
    prepTime,
    cookTime,
    totalTime,
    recipeYield,
    recipeCategory,
    recipeCuisine,
  } = options;

  const url = generateCanonicalUrl(path);
  const schemas: any[] = [];

  // Base WebSite schema for all pages (no SearchAction — site search is client-only)
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    inLanguage: 'en-US',
    publisher: authorRef,
  });

  // Type-specific schemas
  if (type === 'article' && pubDate) {
    // Enhanced BlogPosting schema
    const articleSchema = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: title,
      description: description,
      image: generateImageUrl(heroImage),
      datePublished: pubDate.toISOString(),
      dateModified: updatedDate?.toISOString() || pubDate.toISOString(),
      author: authorRef,
      publisher: authorRef,
      keywords: keywords.join(', '),
      timeRequired: (() => {
        if (minutesRead && typeof minutesRead === 'string') {
          // Extract minutes from "X min read" format
          const match = minutesRead.match(/(\d+)/);
          return match ? `PT${match[1]}M` : undefined;
        }
        return undefined;
      })(),
      url: url,
      inLanguage,
      // Prefer primary category; otherwise a short tag summary; else a stable default.
      articleSection:
        category.length > 0
          ? category[0]
          : tags.length > 0
            ? tags.slice(0, 3).join(', ')
            : 'Personal Growth',
      ...(typeof wordCount === 'number' && wordCount > 0 && { wordCount }),
      // Enhanced article properties
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': url,
      },
      isPartOf: {
        '@type': 'Blog',
        name: SITE_TITLE,
        url: SITE_URL,
      },
      // Content classification
      ...(category.length > 0 && {
        about: category.map((cat) => ({
          '@type': 'Thing',
          name: cat,
        })),
      }),
      // Enhanced metadata
      ...(featured && { isAccessibleForFree: true }),
      ...(draft && { isAccessibleForFree: false }),
      // Reading experience indicators
      ...(tableOfContents && {
        hasPart: {
          '@type': 'WebPageElement',
          name: 'Table of Contents',
          description: 'Structured navigation for this article',
        },
      }),
    };

    schemas.push(articleSchema);
  } else if (type === 'recipe') {
    const ingredients = presentList(recipeIngredient);
    const instructions = presentList(recipeInstructions);
    const prep = toIso8601Duration(prepTime);
    const cook = toIso8601Duration(cookTime);
    const total = toIso8601Duration(totalTime);
    const yieldValue = presentString(recipeYield);
    const dishCategory = presentString(recipeCategory);
    const cuisine = presentString(recipeCuisine);
    const keywordValue = keywords.length > 0 ? keywords.join(', ') : undefined;

    const recipeSchema: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'Recipe',
      name: title,
      description,
      url,
      inLanguage,
      author: authorRef,
    };

    if (heroImage) recipeSchema.image = generateImageUrl(heroImage);
    if (pubDate) recipeSchema.datePublished = pubDate.toISOString();
    if (updatedDate) recipeSchema.dateModified = updatedDate.toISOString();
    if (keywordValue) recipeSchema.keywords = keywordValue;
    if (ingredients) recipeSchema.recipeIngredient = ingredients;
    if (instructions) {
      recipeSchema.recipeInstructions = instructions.map((text, index) => ({
        '@type': 'HowToStep',
        position: index + 1,
        text,
      }));
    }
    if (prep) recipeSchema.prepTime = prep;
    if (cook) recipeSchema.cookTime = cook;
    if (total) recipeSchema.totalTime = total;
    if (yieldValue) recipeSchema.recipeYield = yieldValue;
    if (dishCategory) recipeSchema.recipeCategory = dishCategory;
    if (cuisine) recipeSchema.recipeCuisine = cuisine;

    schemas.push(recipeSchema);
  } else if ((type === 'category' || type === 'tag') && posts.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: title,
      description: description,
      url: url,
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: posts.length,
        itemListElement: posts.map((post, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'BlogPosting',
            headline: post.data.title,
            description: post.data.description,
            url: generateCanonicalUrl(`/p/${post.id}`),
            datePublished: post.data.pubDate.toISOString(),
            dateModified: post.data.updatedDate?.toISOString() || post.data.pubDate.toISOString(),
            author: authorRef,
            image: generateImageUrl(post.data.heroImage),
            keywords: post.data.tags?.join(', '),
            articleSection: post.data.category?.join(', '),
            timeRequired: (() => {
              if (post.data.minutesRead && typeof post.data.minutesRead === 'string') {
                // Extract minutes from "X min read" format
                const match = post.data.minutesRead.match(/(\d+)/);
                return match ? `PT${match[1]}M` : undefined;
              }
              return undefined;
            })(),
          },
        })),
      },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: SITE_URL,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: type === 'category' ? 'Categories' : 'Topics',
            item: generateCanonicalUrl(type === 'category' ? '/category' : '/tag'),
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: title,
            item: url,
          },
        ],
      },
      inLanguage: 'en-US',
      ...(type === 'category' && identifier
        ? {
            about: {
              '@type': 'Thing',
              name: identifier,
              description: description,
            },
          }
        : {}),
      ...(type === 'tag' && identifier ? { keywords: identifier } : {}),
    });
  }

  return schemas.length === 1 ? schemas[0] : schemas;
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  if (!items.length) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// Generate Article schema for general content (alternative to BlogPosting)
export function generateArticleSchema(options: {
  headline: string;
  description: string;
  image?: string;
  datePublished: Date;
  dateModified?: Date;
  author: string;
  publisher: string;
  url: string;
  articleBody?: string;
  wordCount?: number;
  keywords?: string[];
  articleSection?: string;
}) {
  const {
    headline,
    description,
    image,
    datePublished,
    dateModified,
    author,
    publisher,
    url,
    articleBody,
    wordCount,
    keywords,
    articleSection,
  } = options;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    ...(image && { image: generateImageUrl(image) }),
    datePublished: datePublished.toISOString(),
    ...(dateModified && { dateModified: dateModified.toISOString() }),
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: publisher,
    },
    url,
    ...(articleBody && { articleBody }),
    ...(wordCount && { wordCount }),
    ...(keywords && keywords.length > 0 && { keywords: keywords.join(', ') }),
    ...(articleSection && { articleSection }),
    inLanguage: 'en-US',
  };
}

// Validate structured data for common issues
export function validateStructuredData(schema: any): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Basic validation
  if (!schema || typeof schema !== 'object') {
    errors.push('Schema must be a valid object');
    return { isValid: false, errors, warnings };
  }

  // Check required fields
  if (!schema['@context'] || schema['@context'] !== 'https://schema.org') {
    errors.push('Schema must include @context: https://schema.org');
  }

  if (!schema['@type']) {
    errors.push('Schema must include @type');
  }

  // Validate specific schema types
  if (schema['@type'] === 'BlogPosting') {
    if (!schema.headline) warnings.push('BlogPosting should include headline');
    if (!schema.author) warnings.push('BlogPosting should include author');
    if (!schema.datePublished) warnings.push('BlogPosting should include datePublished');
  }

  if (schema['@type'] === 'Recipe') {
    if (!schema.name) warnings.push('Recipe should include name');
    if (!schema.author) warnings.push('Recipe should include author');
  }

  if (schema['@type'] === 'Person') {
    if (!schema.name) warnings.push('Person should include name');
    if (!schema.url) warnings.push('Person should include url');
  }

  if (schema['@type'] === 'Organization') {
    if (!schema.name) warnings.push('Organization should include name');
    if (!schema.url) warnings.push('Organization should include url');
  }

  // Check for common issues
  if (schema.url && !schema.url.startsWith('http')) {
    warnings.push('URLs should be absolute URLs');
  }

  if (schema.image && !schema.image.startsWith('http')) {
    warnings.push('Image URLs should be absolute URLs');
  }

  // Check for circular references
  const checkCircular = (obj: any, path: string[] = []): boolean => {
    if (typeof obj === 'object' && obj !== null) {
      for (const key in obj) {
        if (path.includes(obj[key])) {
          warnings.push(`Potential circular reference detected at ${path.join('.')}.${key}`);
          return true;
        }
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          if (checkCircular(obj[key], [...path, key])) {
            return true;
          }
        }
      }
    }
    return false;
  };

  checkCircular(schema);

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}
