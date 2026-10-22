export interface PreludeTemplateCandidate {
  id: string;
  weight: number;
  prefix: string;
  tags: string[];
  suffix?: string;
  /** A closing link after the topics, e.g. the Cookbook site. */
  link?: PreludeLink;
}

export interface PreludeLink {
  lead: string;
  label: string;
  href: string;
}

interface PreludeTemplateInput {
  tagCounts: Record<string, number>;
}

interface PreludeAxis {
  id: string;
  weight: number;
  prefix: string;
  suffix?: string;
  link?: PreludeLink;
  allowed: string[];
  /** Included first when present, so the sentence matches its own wording. */
  prefer?: string[];
  limit?: number;
  minTags?: number;
}

/** How many theme sentences to keep on `/tag` after diversity filtering. */
export const PRELUDE_THEME_LIMIT = 14;

/**
 * Where Antonio is now: these sentences open Browse, in this order, whatever the
 * writing says. Edit this list when life moves; everything below it ranks itself.
 */
export const PRELUDE_NOW: string[] = ['family', 'island', 'public-life', 'craft'];

/** A writing's pull on its sentence halves every this many days. */
export const PRELUDE_HALF_LIFE_DAYS = 180;

/** A sentence with no writing newer than this goes last, until a new piece lands. */
export const PRELUDE_QUIET_DAYS = 365;

/**
 * Distinct browse axes. One sentence per axis; selection later drops
 * overlapping tags so the map does not collapse into inner-work twice.
 * `weight` only decides which sentence claims a shared topic; the page order
 * comes from `orderPreludeTemplates`.
 */
const PRELUDE_AXES: PreludeAxis[] = [
  {
    id: 'poems',
    weight: 7,
    prefix: 'Poems live at',
    allowed: ['poems'],
    limit: 1,
    minTags: 1,
  },
  {
    id: 'family',
    weight: 6,
    prefix: 'Fatherhood in real time:',
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
    prefix: 'The inner work sits under',
    prefer: ['inner-work'],
    allowed: ['inner-work', 'consciousness', 'self-reflection', 'mindfulness'],
  },
  {
    id: 'public-life',
    weight: 5,
    prefix: 'When the world gets loud:',
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
    prefix: 'Becoming lives under',
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
    prefix: 'Closeness without pretending it is easy:',
    allowed: ['relationships', 'vulnerability', 'love', 'intimacy', 'communication'],
  },
  {
    id: 'craft',
    weight: 4,
    prefix: 'The making lives under',
    allowed: [
      'learning-projects',
      'technology',
      'software-development',
      'game-development',
      'writing',
      'metaspace',
    ],
  },
  {
    id: 'kitchen',
    weight: 4,
    prefix: 'The kitchen is under',
    link: {
      lead: ', and the family recipes are at',
      label: 'Cookbook',
      href: 'https://cookbook.antoniwan.online/',
    },
    allowed: ['cooking', 'food', 'recipes'],
  },
  {
    id: 'repair',
    weight: 4,
    prefix: 'The repair work is in',
    prefer: ['healing'],
    allowed: ['healing', 'recovery', 'trauma', 'attachment', 'grief'],
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
    prefix: 'The compass is in',
    allowed: ['values', 'truth', 'purpose', 'responsibility', 'boundaries'],
  },
  {
    id: 'study',
    weight: 3,
    prefix: 'In study mode:',
    allowed: ['philosophy', 'psychology', 'education', 'spirituality', 'learning'],
  },
  {
    id: 'body',
    weight: 3,
    prefix: 'To slow down:',
    allowed: ['health', 'self-care', 'nutrition', 'ritual', 'presence'],
  },
  {
    id: 'systems-thinking',
    weight: 3,
    prefix: 'Systems thinking lives under',
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
      link: axis.link,
    });
  }

  return candidates;
};

export interface SelectPreludeTemplatesOptions {
  excludeTags?: Iterable<string>;
}

/**
 * Stable, diversity-first pick: highest weight wins, then id.
 * Tags already used are stripped so later sentences cover other axes
 * instead of repeating healing/self-reflection.
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

export interface PreludePost {
  /** Canonical topic slugs. */
  tags: string[];
  pubDate: Date;
}

export interface OrderedPreludeTemplate extends PreludeTemplateCandidate {
  /** Recent writing under this sentence's topics; newer counts more. */
  score: number;
  pinned: boolean;
  /** Nothing new under its topics in `PRELUDE_QUIET_DAYS`. */
  quiet: boolean;
}

export interface OrderPreludeTemplatesOptions {
  now?: Date;
  pinned?: string[];
}

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Page order: the pinned sentences first, in `pinned` order; then the rest by
 * recent writing; quiet sentences last, by the same score. Ties fall back to id.
 */
export const orderPreludeTemplates = (
  templates: PreludeTemplateCandidate[],
  posts: PreludePost[],
  options: OrderPreludeTemplatesOptions = {},
): OrderedPreludeTemplate[] => {
  const now = options.now ?? new Date();
  const pinned = options.pinned ?? PRELUDE_NOW;

  const scored = templates.map((template) => {
    const tags = new Set(template.tags);
    let score = 0;
    let newestAge = Infinity;
    for (const post of posts) {
      if (!post.tags.some((tag) => tags.has(tag))) continue;
      const ageDays = Math.max(0, (now.valueOf() - post.pubDate.valueOf()) / DAY_MS);
      score += 0.5 ** (ageDays / PRELUDE_HALF_LIFE_DAYS);
      newestAge = Math.min(newestAge, ageDays);
    }
    const isPinned = pinned.includes(template.id);
    return {
      ...template,
      score,
      pinned: isPinned,
      quiet: !isPinned && newestAge > PRELUDE_QUIET_DAYS,
    };
  });

  const rank = (item: OrderedPreludeTemplate) => (item.pinned ? 0 : item.quiet ? 2 : 1);

  return scored.sort(
    (a, b) =>
      rank(a) - rank(b) ||
      (a.pinned ? pinned.indexOf(a.id) - pinned.indexOf(b.id) : b.score - a.score) ||
      a.id.localeCompare(b.id),
  );
};

/** The words between a sentence's topic links: "A", "A and B", "A, B, and C". */
export const formatPreludeConnectors = (itemsCount: number): string[] => {
  if (itemsCount <= 0) return [];
  if (itemsCount === 1) return [' '];
  if (itemsCount === 2) return [' ', ' and '];

  return Array.from({ length: itemsCount }, (_, index) => {
    if (index === 0) return ' ';
    if (index === itemsCount - 1) return ', and ';
    return ', ';
  });
};
