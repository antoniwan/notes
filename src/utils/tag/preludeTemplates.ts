export interface PreludeTemplateCandidate {
  id: string;
  weight: number;
  prefix: string;
  tags: string[];
  suffix?: string;
}

interface PreludeTemplateInput {
  tagCounts: Record<string, number>;
}

interface PreludeAxis {
  id: string;
  weight: number;
  prefix: string;
  suffix?: string;
  allowed: string[];
  /** Included first when present, so the sentence matches its own wording. */
  prefer?: string[];
  limit?: number;
  minTags?: number;
}

/** How many theme sentences to keep on `/tag` after diversity filtering. */
export const PRELUDE_THEME_LIMIT = 14;

/**
 * Distinct browse axes. One sentence per axis; selection later drops
 * overlapping tags so the map does not collapse into inner-work twice.
 */
const PRELUDE_AXES: PreludeAxis[] = [
  {
    id: 'poems',
    weight: 7,
    prefix: 'I have poems too over at',
    allowed: ['poems'],
    limit: 1,
    minTags: 1,
  },
  {
    id: 'family',
    weight: 6,
    prefix: 'A lot of this is fatherhood in real time:',
    prefer: ['fatherhood'],
    allowed: [
      'fatherhood',
      'parenting',
      'family',
      'children',
      'family-dynamics',
      'conscious-parenting',
    ],
  },
  {
    id: 'inner-work',
    weight: 5,
    prefix: 'I keep returning to',
    suffix: 'the long road kind',
    allowed: ['consciousness', 'healing', 'self-reflection', 'therapy', 'mindfulness'],
  },
  {
    id: 'public-life',
    weight: 5,
    prefix: 'When the world gets loud, I write on',
    allowed: ['social-issues', 'politics', 'systemic-critique', 'social-justice', 'power'],
  },
  {
    id: 'island',
    weight: 5,
    prefix: 'Home keeps showing up as',
    prefer: ['puerto-rico'],
    allowed: ['puerto-rico', 'culture', 'colonialism', 'diaspora', 'economics'],
  },
  {
    id: 'becoming',
    weight: 4,
    prefix: 'Some notes are for becoming:',
    allowed: [
      'personal-growth',
      'emotional-regulation',
      'transformation',
      'self-improvement',
      'resilience',
    ],
  },
  {
    id: 'closeness',
    weight: 4,
    prefix: 'I write about closeness without pretending it is easy:',
    allowed: ['relationships', 'vulnerability', 'love', 'intimacy', 'communication'],
  },
  {
    id: 'craft',
    weight: 4,
    prefix: 'I also build in public:',
    allowed: ['learning-projects', 'technology', 'software-development', 'writing', 'metaspace'],
  },
  {
    id: 'kitchen',
    weight: 4,
    prefix: 'The kitchen notes live under',
    allowed: ['cooking', 'food', 'recipes'],
  },
  {
    id: 'repair',
    weight: 4,
    prefix: 'The repair work is in',
    allowed: ['recovery', 'trauma', 'attachment', 'grief'],
  },
  {
    id: 'rebellion',
    weight: 4,
    prefix: 'The political heart of it:',
    allowed: ['revolution', 'political-awakening', 'freedom', 'love'],
  },
  {
    id: 'clarity',
    weight: 3,
    prefix: 'If you want the compass, start with',
    allowed: ['values', 'truth', 'purpose', 'responsibility', 'boundaries'],
  },
  {
    id: 'study',
    weight: 3,
    prefix: 'If you are in study mode, I also write about',
    allowed: ['philosophy', 'psychology', 'education', 'spirituality', 'learning'],
  },
  {
    id: 'body',
    weight: 3,
    prefix: 'When I need to slow down, I write around',
    allowed: ['health', 'self-care', 'nutrition', 'ritual', 'presence'],
  },
  {
    id: 'systems-thinking',
    weight: 3,
    prefix: 'Others are systems notes about',
    allowed: ['systems-strategy', 'technology', 'power', 'metaspace'],
  },
];

const hasTag = (tagCounts: Record<string, number>, tag: string) => (tagCounts[tag] ?? 0) > 0;

const topTags = (
  tagCounts: Record<string, number>,
  allowed: string[],
  limit: number,
  prefer: string[] = [],
): string[] => {
  const preferred = prefer.filter((tag) => allowed.includes(tag) && hasTag(tagCounts, tag));
  const preferredSet = new Set(preferred);
  const rest = allowed
    .filter((tag) => hasTag(tagCounts, tag) && !preferredSet.has(tag))
    .sort((a, b) => (tagCounts[b] ?? 0) - (tagCounts[a] ?? 0) || a.localeCompare(b));
  return [...preferred, ...rest].slice(0, limit);
};

export const buildPreludeTemplateCandidates = ({
  tagCounts,
}: PreludeTemplateInput): PreludeTemplateCandidate[] => {
  const candidates: PreludeTemplateCandidate[] = [];

  for (const axis of PRELUDE_AXES) {
    const limit = axis.limit ?? 3;
    const minTags = axis.minTags ?? 2;
    const tags = topTags(tagCounts, axis.allowed, limit, axis.prefer);
    if (tags.length < minTags) continue;
    candidates.push({
      id: axis.id,
      weight: axis.weight,
      prefix: axis.prefix,
      tags,
      suffix: axis.suffix,
    });
  }

  return candidates;
};

export interface SelectPreludeTemplatesOptions {
  excludeTags?: Iterable<string>;
}

/**
 * Stable, diversity-first pick: highest weight wins, then id.
 * Tags already used (or excluded by the form line) are stripped so later
 * sentences cover other axes instead of repeating healing/self-reflection.
 */
export const selectPreludeTemplates = (
  candidates: PreludeTemplateCandidate[],
  maxItems: number,
  options: SelectPreludeTemplatesOptions = {},
): PreludeTemplateCandidate[] => {
  const used = new Set(options.excludeTags ?? []);
  const selected: PreludeTemplateCandidate[] = [];

  const sorted = [...candidates].sort((a, b) => b.weight - a.weight || a.id.localeCompare(b.id));

  for (const candidate of sorted) {
    if (selected.length >= maxItems) break;
    const tags = candidate.tags.filter((tag) => !used.has(tag));
    const minKeep = candidate.tags.length <= 1 ? 1 : 2;
    if (tags.length < minKeep) continue;
    selected.push({ ...candidate, tags });
    for (const tag of tags) used.add(tag);
  }

  return selected;
};
