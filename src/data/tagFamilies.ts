import { PREFERRED_TAGS } from './tagVocabulary';
import { canonicalizeTag } from '../utils/tagVocabulary';

/**
 * Reader-facing idea families for chip color.
 * Not Maslow. Not 221 hues. Eight rooms a stranger can see on the map.
 */
export const TAG_FAMILIES = [
  'kinship',
  'kitchen',
  'island',
  'inner',
  'repair',
  'becoming',
  'public',
  'craft',
] as const;

export type TagFamily = (typeof TAG_FAMILIES)[number];
export type TagFamilyOrRest = TagFamily | 'rest';

export const TAG_FAMILY_MEMBERS: Record<TagFamily, readonly string[]> = {
  kinship: [
    'attachment',
    'boundaries',
    'child-development',
    'children',
    'co-parenting',
    'communication',
    'compassion',
    'connection',
    'conscious-parenting',
    'empathy',
    'family',
    'family-dynamics',
    'fatherhood',
    'intimacy',
    'love',
    'parenting',
    'relationships',
    'trust',
    'vulnerability',
  ],
  kitchen: ['cooking', 'food', 'nutrition', 'recipes'],
  island: ['culture', 'economics', 'identity', 'puerto-rico'],
  inner: [
    'breathing',
    'consciousness',
    'inner-child',
    'inner-work',
    'meditation',
    'mindfulness',
    'philosophy',
    'presence',
    'ritual',
    'self-reflection',
    'spirituality',
  ],
  repair: [
    'emotional-health',
    'emotional-regulation',
    'fasting',
    'fear',
    'grief',
    'healing',
    'health',
    'mental-health',
    'recovery',
    'self-care',
    'therapy',
    'trauma',
  ],
  becoming: [
    'authenticity',
    'discipline',
    'emotional-intelligence',
    'habits',
    'meaning',
    'personal-growth',
    'purpose',
    'resilience',
    'responsibility',
    'self-awareness',
    'self-improvement',
    'self-mastery',
    'simplicity',
    'slow-living',
    'time',
    'transformation',
    'truth',
    'values',
  ],
  public: [
    'activism',
    'collective-healing',
    'democracy',
    'digital-safety',
    'freedom',
    'governance',
    'leadership',
    'political-awakening',
    'politics',
    'power',
    'revolution',
    'social-issues',
    'social-justice',
    'social-media',
    'systemic-critique',
  ],
  craft: [
    'ai',
    'ai-agents',
    'art-expression',
    'astro',
    'craftsmanship',
    'creativity',
    'customization',
    'digital-art',
    'education',
    'efficiency',
    'learning',
    'learning-projects',
    'memoir',
    'metaspace',
    'mythology',
    'poems',
    'productivity',
    'psychology',
    'reflection',
    'self-expression',
    'software-development',
    'symbols',
    'systems-strategy',
    'technology',
    'tools',
    'typescript',
    'version-control',
    'web-development',
    'workflow',
    'writing',
  ],
};

const FAMILY_BY_TAG = (() => {
  const map = new Map<string, TagFamily>();
  for (const family of TAG_FAMILIES) {
    for (const tag of TAG_FAMILY_MEMBERS[family]) {
      if (map.has(tag)) {
        throw new Error(`Tag ${tag} assigned to both ${map.get(tag)} and ${family}`);
      }
      map.set(tag, family);
    }
  }
  return map;
})();

export const getTagFamily = (tag: string): TagFamilyOrRest => {
  const canonical = canonicalizeTag(tag);
  if (!canonical) return 'rest';
  return FAMILY_BY_TAG.get(canonical) ?? 'rest';
};

export const unassignedPreferredTags = (): string[] =>
  (PREFERRED_TAGS as readonly string[]).filter((tag) => !FAMILY_BY_TAG.has(tag));
