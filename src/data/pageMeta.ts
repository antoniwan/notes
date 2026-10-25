import type { Category } from './categories';
import { getTagMetadata } from './tags';

/**
 * SEO meta descriptions for static public pages.
 * Used for `<meta name="description">`, Open Graph, Twitter, and JSON-LD.
 * Keep each unique, factual, and at or under 160 characters. On-page subtitles
 * can stay longer via `description`; pass these as `metaDescription`.
 */
export const PAGE_META = {
  '/': 'Essays and notes on fatherhood, family, cooking, work, and daily life.',
  '/about':
    'About Antonio Rodríguez Martínez, who keeps field notes at Notes: father, stepfather, software builder, and recovering overthinker.',
  '/archive': 'Complete archive of published notes, listed newest first.',
  '/browse':
    'Search every word of the writing on Notes, or follow a topic: an idea map of fatherhood, Puerto Rico, power, healing, and the rooms they connect.',
  '/es':
    'Todo lo que Antonio Rodríguez Martínez ha escrito en español en Notes: ensayos, poemas y notas sobre Puerto Rico, la familia y la vida diaria.',
  '/404': 'This page does not exist. A random quote from the site archive is shown instead.',
} as const;

/** Factual meta descriptions for category listing pages, keyed by category id. */
export const CATEGORY_META: Record<string, string> = {
  'art-expression': 'Poems, art, and other things I tried to make. Category: Arts and attempts.',
  culture: 'Notes on how we live together and what we take for granted. Category: What is culture?',
  'diy-creation':
    'Notes on things built, cooked, or set up by hand. Category: Do it yourself / DIY.',
  'integration-growth':
    'Notes on values, inner work, and growing up, still. Category: Working on myself.',
  'learning-projects':
    'Notes on skills still being learned, written as I go. Category: Learning in public.',
  metaspace:
    'Notes about this site, the writing process, and method. Category: Notes on the notes.',
  parenting: 'Notes on parenting, family dynamics, and raising children. Category: On parenting.',
  politics: 'Notes on power, social structures, and political life. Category: On politics.',
  psychology:
    'Notes on human behavior, social dynamics, and mental processes. Category: Psychology, roughly.',
  'systems-strategy':
    'Notes on software, tools, and how they fit together. Category: On software and systems.',
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
