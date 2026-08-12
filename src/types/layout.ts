import type { CollectionEntry } from 'astro:content';

export interface TocItem {
  level: number;
  text: string;
  slug: string;
}

export interface CategoryDisplayItem {
  id: string;
  name: string;
  icon?: string;
}

export interface BaseLayoutProps {
  title: string;
  description?: string;
  /**
   * Optional SEO-only description. When set, used for meta/OG/JSON-LD instead of
   * `description` (which may also render on-page as a subtitle).
   */
  metaDescription?: string;
  // Blog-specific props
  pubDate?: Date;
  updatedDate?: Date;
  heroImage?: string; // Primary image for social sharing
  minutesRead?: string; // Reading time from remark plugin
  tags?: string[];
  category?: string[];
  // SEO fields
  path?: string;
  imageAlt?: string;
  author?: string;
  keywords?: string[];
  type?: 'website' | 'article';
  robots?: string;
  hreflangAlternates?: Array<{ hreflang: string; href: string }>;
  /** BCP 47 / HTML lang for the document (defaults to en). */
  htmlLang?: 'en' | 'es';
  /** Open Graph locale (defaults to en_US). */
  locale?: string;
  /** schema.org inLanguage value (defaults to en-US). */
  inLanguage?: string;
  // Structured data specific
  structuredDataType?: 'website' | 'article' | 'category' | 'tag';
  structuredDataIdentifier?: string;
  posts?: CollectionEntry<'blog'>[]; // For category/tag pages
  // Enhanced structured data options
  tableOfContents?: boolean | TocItem[];
  hasComments?: boolean;
  featured?: boolean;
  draft?: boolean;
  /** Approximate word count for Article JSON-LD when known. */
  wordCount?: number;
  // PageHeader options
  showTitle?: boolean; // Whether to show the H1 title in PageHeader (default: true)
  // Reading progress
  postId?: string; // Astro's native post.id for reading progress tracking
}

export interface Translation {
  id: string;
  title: string;
  language: string[];
  path: string;
}

export interface TranslationData {
  translations: Translation[];
  currentLanguage: string;
  currentPath: string;
  hasTranslations: boolean;
}

export interface BlogLayoutProps extends BaseLayoutProps {
  // Blog-specific additional props
  categoryName?: string | null;
  categoryItems?: CategoryDisplayItem[];
  tableOfContents?: TocItem[];
  showComments?: boolean;
  translationData?: TranslationData;
  currentPost?: CollectionEntry<'blog'>; // Current blog post for related posts
  allPosts?: CollectionEntry<'blog'>[]; // All posts for finding related content
}
