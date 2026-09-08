import { canonicalizeTag } from '../utils/tagVocabulary';

/**
 * Kitchen tags still look like a recipe shelf. Dishes live on Cookbook.
 * These rooms stay writings, and send the reader to `/recipes`.
 */
export const COOKBOOK_NOTICE_TAGS = ['recipes', 'cooking', 'food'] as const;

export type CookbookNoticeTag = (typeof COOKBOOK_NOTICE_TAGS)[number];

export function tagHasCookbookNotice(tag: string): boolean {
  return (COOKBOOK_NOTICE_TAGS as readonly string[]).includes(canonicalizeTag(tag));
}
