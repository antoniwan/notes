import { CONTENT_FORM_TAGS, PREFERRED_TAGS, TAG_ALIAS_MAP } from '../data/tagVocabulary';

const PREFERRED_TAG_SET = new Set<string>(PREFERRED_TAGS as readonly string[]);
const CONTENT_FORM_TAG_SET = new Set<string>(CONTENT_FORM_TAGS as readonly string[]);

export const normalizeTagInput = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

export const humanizeTagSlug = (tag: string): string =>
  tag
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

export const canonicalizeTag = (tag: string): string => {
  const normalized = normalizeTagInput(tag);
  // Canonical form slugs never collapse into thematic tags.
  if (CONTENT_FORM_TAG_SET.has(normalized)) return normalized;
  return TAG_ALIAS_MAP[normalized] ?? normalized;
};

export const isContentFormTag = (tag: string): boolean =>
  CONTENT_FORM_TAG_SET.has(canonicalizeTag(tag));

export const canonicalizeTags = (tags: string[] = []): string[] =>
  Array.from(new Set(tags.map(canonicalizeTag).filter(Boolean)));

export const isPreferredTag = (tag: string): boolean => PREFERRED_TAG_SET.has(canonicalizeTag(tag));

export const getTagSuggestion = (tag: string): string | null => {
  const normalized = normalizeTagInput(tag);
  if (TAG_ALIAS_MAP[normalized]) return TAG_ALIAS_MAP[normalized];
  return null;
};

export const getNonPreferredTags = (tags: string[] = []): string[] =>
  tags.map(canonicalizeTag).filter((tag) => !PREFERRED_TAG_SET.has(tag));
