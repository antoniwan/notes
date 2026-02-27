import type { CollectionEntry } from 'astro:content';
import {
  SITE_TITLE,
  SITE_DESCRIPTION,
  SITE_URL,
  AUTHOR,
  SOCIAL_LINKS,
  SEO_CONFIG,
} from '../consts';
import { generateCanonicalUrl, generateImageUrl } from './seo';

// Enhanced structured data options
export interface StructuredDataOptions {
  title: string;
  description: string;
  path: string;
  type?: 'website' | 'article' | 'category' | 'tag';
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
    hasComments = false,
    featured = false,
    draft = false,
  } = options;

  const url = generateCanonicalUrl(path);
  const schemas: any[] = [];

  // Base WebSite schema for all pages
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    inLanguage: 'en-US',
    publisher: {
      '@type': 'Person',
      name: AUTHOR.name,
      url: AUTHOR.url,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    dateModified: new Date().toISOString(),
  });

  // Enhanced Organization schema
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SEO_CONFIG.organizationName,
    url: SITE_URL,
    inLanguage: 'en-US',
    logo: {
      '@type': 'ImageObject',
      url: generateImageUrl(SEO_CONFIG.organizationLogo),
      width: SEO_CONFIG.organizationLogoWidth,
      height: SEO_CONFIG.organizationLogoHeight,
    },
    sameAs: Object.values(SOCIAL_LINKS),
    dateModified: new Date().toISOString(),
    // Enhanced organization details
    description: SITE_DESCRIPTION,
    foundingDate: '2024', // Adjust based on your actual founding date
    areaServed: 'Worldwide',
    serviceType: 'Personal Blog & Content Creation',
  });

  // Enhanced Person schema for author
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: AUTHOR.name,
    url: AUTHOR.url,
    inLanguage: 'en-US',
    sameAs: [SOCIAL_LINKS.twitter, SOCIAL_LINKS.github, SOCIAL_LINKS.bluesky],
    jobTitle: 'Software Engineer & Writer',
    worksFor: {
      '@type': 'Organization',
      name: SEO_CONFIG.organizationName,
    },
    knowsAbout: [
      'Software Development',
      'Personal Growth',
      'Mental Health',
      'Parenting',
      'Technology',
      'Thinking',
      'Fatherhood',
      'Masculinity',
      'Culture',
      'Modern Collapse',
      'Philosophy',
      'Cultural Navigation',
    ],
    // Enhanced author details
    description:
      'Software engineer and writer exploring fatherhood, masculinity, and modern life through raw, unfiltered reflection.',
    alumniOf: {
      '@type': 'Organization',
      name: 'Software Engineering Community',
    },
    hasOccupation: {
      '@type': 'Occupation',
      name: 'Software Engineer',
      description: "Building digital solutions and exploring technology's impact on modern life",
    },
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
      author: {
        '@type': 'Person',
        name: AUTHOR.name,
        url: AUTHOR.url,
      },
      publisher: {
        '@type': 'Organization',
        name: SEO_CONFIG.organizationName,
        url: SITE_URL,
        logo: {
          '@type': 'ImageObject',
          url: generateImageUrl(SEO_CONFIG.organizationLogo),
        },
      },
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
      inLanguage: 'en-US',
      articleSection: category.length > 0 ? category[0] : 'Personal Growth',
      wordCount: description.split(' ').length + keywords.join(' ').split(' ').length,
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
      ...(tags.length > 0 && {
        articleSection: tags.slice(0, 3).join(', '), // Use first 3 tags as article section
      }),
      // Enhanced metadata
      ...(featured && { isAccessibleForFree: true }),
      ...(draft && { isAccessibleForFree: false }),
      ...(hasComments && {
        commentCount: 0, // You can make this dynamic if you track comments
        comment: [], // You can populate this with actual comments if available
      }),
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

    // Add breadcrumb schema for blog posts
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: SITE_URL,
        },
        ...(category.length > 0
          ? [
              {
                '@type': 'ListItem',
                position: 2,
                name: category[0],
                item: generateCanonicalUrl(`/category/${category[0]}/`),
              },
            ]
          : []),
        {
          '@type': 'ListItem',
          position: category.length > 0 ? 3 : 2,
          name: title,
          item: url,
        },
      ],
    };

    schemas.push(breadcrumbSchema);
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
            author: {
              '@type': 'Person',
              name: AUTHOR.name,
              url: AUTHOR.url,
            },
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
            name: type === 'category' ? 'Categories' : 'Tags',
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
      dateModified: new Date().toISOString(),
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

// Generate FAQ schema for content that might benefit from it
export function generateFAQSchema(questions: Array<{ question: string; answer: string }>) {
  if (!questions || questions.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  };
}

// Generate HowTo schema for tutorial/instructional content
export function generateHowToSchema(options: {
  name: string;
  description: string;
  steps: Array<{ name: string; text: string; image?: string }>;
  totalTime?: string;
  tools?: string[];
  materials?: string[];
}) {
  const { name, description, steps, totalTime, tools, materials } = options;

  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    ...(totalTime && { totalTime }),
    ...(tools &&
      tools.length > 0 && {
        tool: tools.map((tool) => ({
          '@type': 'HowToTool',
          name: tool,
        })),
      }),
    ...(materials &&
      materials.length > 0 && {
        material: materials.map((material) => ({
          '@type': 'HowToMaterial',
          name: material,
        })),
      }),
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.image && {
        image: generateImageUrl(step.image),
      }),
    })),
  };
}

// Auto-detect FAQ content from markdown and generate schema
export function autoDetectFAQSchema(content: string): any | null {
  // Look for common FAQ patterns in markdown
  const faqPatterns = [
    // Q&A format with ## or ### headers
    /##\s*(?:Q|Question|FAQ|Frequently Asked Question)[:\s]*([^\n]+)/gi,
    /###\s*(?:Q|Question|FAQ|Frequently Asked Question)[:\s]*([^\n]+)/gi,
    // Bold questions followed by answers
    /\*\*([^*]+)\*\*\s*\n+([^*\n]+(?:\n[^*\n]+)*)/g,
    // Questions ending with question marks followed by answers
    /([^.!?]+\?)\s*\n+([^.!?]+(?:\n[^.!?]+)*)/g,
  ];

  const questions: Array<{ question: string; answer: string }> = [];

  // Try to extract questions and answers
  for (const pattern of faqPatterns) {
    const matches = content.matchAll(pattern);
    for (const match of matches) {
      if (match[1] && match[2]) {
        const question = match[1].trim();
        const answer = match[2].trim();

        // Filter out very short or very long Q&As
        if (
          question.length > 10 &&
          question.length < 200 &&
          answer.length > 20 &&
          answer.length < 1000
        ) {
          questions.push({ question, answer });
        }
      }
    }
  }

  // If we found reasonable FAQ content, generate schema
  if (questions.length >= 2) {
    return generateFAQSchema(questions);
  }

  return null;
}

// Generate Review schema for review/rating content
export function generateReviewSchema(options: {
  name: string;
  description: string;
  rating?: number;
  bestRating?: number;
  worstRating?: number;
  author: string;
  reviewBody: string;
  itemReviewed?: string;
}) {
  const {
    name,
    description,
    rating,
    bestRating = 5,
    worstRating = 1,
    author,
    reviewBody,
    itemReviewed,
  } = options;

  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    name,
    description,
    ...(rating && {
      reviewRating: {
        '@type': 'Rating',
        ratingValue: rating,
        bestRating,
        worstRating,
      },
    }),
    author: {
      '@type': 'Person',
      name: author,
    },
    reviewBody,
    ...(itemReviewed && {
      itemReviewed: {
        '@type': 'Thing',
        name: itemReviewed,
      },
    }),
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

// Enhanced structured data generation with automatic FAQ detection
export function generateEnhancedStructuredData(
  options: StructuredDataOptions & { content?: string },
) {
  const baseSchemas = generateStructuredData(options);

  // If we have content and it's an article, try to auto-detect FAQ content
  if (options.content && options.type === 'article') {
    const faqSchema = autoDetectFAQSchema(options.content);
    if (faqSchema) {
      // If baseSchemas is an array, add FAQ schema to it
      if (Array.isArray(baseSchemas)) {
        return [...baseSchemas, faqSchema];
      } else {
        return [baseSchemas, faqSchema];
      }
    }
  }

  return baseSchemas;
}

// Generate structured data for specific content types
export function generateContentTypeSpecificSchema(contentType: string, options: any) {
  switch (contentType) {
    case 'tutorial':
    case 'how-to':
      return generateHowToSchema(options);
    case 'review':
      return generateReviewSchema(options);
    case 'faq':
      return generateFAQSchema(options.questions || []);
    default:
      return null;
  }
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

// Generate structured data summary for debugging
export function generateStructuredDataSummary(schemas: any[]): string {
  const summary = schemas.map((schema, index) => {
    const validation = validateStructuredData(schema);
    return `Schema ${index + 1} (${schema['@type'] || 'Unknown'}): ${
      validation.isValid ? 'Valid' : 'Invalid'
    }${validation.errors.length > 0 ? ` - Errors: ${validation.errors.join(', ')}` : ''}${
      validation.warnings.length > 0 ? ` - Warnings: ${validation.warnings.join(', ')}` : ''
    }`;
  });

  return summary.join('\n');
}
