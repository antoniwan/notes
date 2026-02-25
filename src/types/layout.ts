export interface BaseLayoutProps {
  title: string;
  description?: string;
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
  // Structured data specific
  structuredDataType?: 'website' | 'article' | 'category' | 'tag';
  structuredDataIdentifier?: string;
  posts?: any[]; // For category/tag pages
  // Enhanced structured data options
  tableOfContents?:
    | boolean
    | {
        level: number;
        text: string;
        slug: string;
      }[];
  hasComments?: boolean;
  featured?: boolean;
  draft?: boolean;
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
  tableOfContents?: {
    level: number;
    text: string;
    slug: string;
  }[];
  showComments?: boolean;
  translationData?: TranslationData;
  currentPost?: any; // Current blog post for related posts
  allPosts?: any[]; // All posts for finding related content
}
