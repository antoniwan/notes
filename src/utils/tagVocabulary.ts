import { PREFERRED_TAGS, TAG_ALIAS_MAP } from '../data/tagVocabulary';
const PREFERRED_TAG_SET = new Set<string>(PREFERRED_TAGS as readonly string[]);

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

export const canonicalizeTag = (tag: string): string => {
  const normalized = normalizeTagInput(tag);
  return TAG_ALIAS_MAP[normalized] ?? normalized;
};

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
