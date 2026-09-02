import type { Category } from './categories';
import { getTagMetadata } from './tags';

/**
 * SEO meta descriptions for static public pages.
 * Used for `<meta name="description">`, Open Graph, Twitter, and JSON-LD.
 * Keep each unique, factual, and at or under 160 characters. On-page subtitles
 * can stay longer via `description`; pass these as `metaDescription`.
 */
export const PAGE_META = {
  '/': 'Essays, household recipes, and notes on fatherhood, family, work, and daily life.',
  '/about':
    'About Antonio Rodríguez Martínez, who keeps field notes at Notes: father, stepfather, software builder, and recovering overthinker.',
  '/everything': 'Complete archive of published notes, listed newest first.',
  '/guided-path':
    'Published notes grouped by season and year. Reading progress is stored on this device.',
  '/library': 'Catalog of books used as sources in Notes, by reading status and shelf.',
  '/library/books':
    'Searchable catalog of books in the Notes library, filterable by status, shelf, title, or author.',
  '/recipes':
    'Household cookbook: recipes you can cook from, listed as plates and a contents page.',
  '/category':
    'Published notes grouped by category, including parenting, psychology, culture, and systems.',
  '/tag':
    'An idea map of the writings: parenting, fatherhood, healing, Puerto Rico, and the rooms they connect.',
  '/404': 'This page does not exist. A random quote from the site archive is shown instead.',
} as const;

export type PageMetaPath = keyof typeof PAGE_META;

/** Factual meta descriptions for category listing pages, keyed by category id. */
export const CATEGORY_META: Record<string, string> = {
  'art-expression': 'Notes on art, aesthetics, and creative work. Category: Art & Expression.',
  culture: 'Notes on social norms, collective behavior, and culture. Category: On Culture.',
  'diy-creation': 'Notes on physical builds, handmade work, and making. Category: DIY & Creation.',
  'integration-growth':
    'Notes on personal growth, integration, and leadership. Category: Integration & Growth.',
  'learning-projects':
    'Notes documenting skills and projects in progress. Category: Learning Projects.',
  metaspace: 'Notes about this site, the writing process, and method. Category: Metaspace.',
  parenting: 'Notes on parenting, family dynamics, and raising children. Category: On Parenting.',
  politics: 'Notes on power, social structures, and political life. Category: On Politics.',
  psychology:
    'Notes on human behavior, social dynamics, and mental processes. Category: Psychology, Roughly.',
  'systems-strategy':
    'Notes on software, systems, and strategic design. Category: On Systems & Strategy.',
};

/** Unique meta description for a category listing page. */
export function categoryMetaDescription(category: Pick<Category, 'id' | 'name'>): string {
  return CATEGORY_META[category.id] ?? `Notes filed under ${category.name}.`;
}

/** Unique meta description for a tag listing page. */
export function tagMetaDescription(tag: string, count: number): string {
  const meta = getTagMetadata(tag);
  const n = count === 1 ? '1 note' : `${count} notes`;
  if (meta.description) {
    const blurb = meta.description.trim();
    const withStop = /[.!?]$/.test(blurb) ? blurb : `${blurb}.`;
    return `${withStop} ${n} in the archive.`;
  }
  return `${n} on ${meta.name} in the Notes archive.`;
}
