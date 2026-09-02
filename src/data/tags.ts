import { PREFERRED_TAGS } from './tagVocabulary';

const PREFERRED_TAG_SET = new Set<string>(PREFERRED_TAGS as readonly string[]);

export interface TagData {
  name: string;
  weight: number;
  description?: string;
  category?: string;
  aliases?: string[];
}

export interface TagCategory {
  key: string;
  title: string;
  description: string;
  icon: string;
  tags: string[];
  color?: string;
}

export interface TagStats {
  tag: string;
  count: number;
  size?: number;
}

const DEFAULT_WEIGHT = 1;
const DEFAULT_PREFERRED_WEIGHT = 4;

/**
 * Weights that differ from the preferred default of 4.
 * Keys must be preferred canonical slugs. Everything else in PREFERRED_TAGS
 * gets DEFAULT_PREFERRED_WEIGHT; unknown tags get DEFAULT_WEIGHT.
 */
export const TAG_WEIGHT_OVERRIDES: Record<string, number> = {
  consciousness: 10,
  'personal-growth': 10,
  'mental-health': 10,
  healing: 10,
  love: 10,
  therapy: 9,
  'self-reflection': 9,
  transformation: 9,
  authenticity: 9,
  values: 9,
  fatherhood: 8,
  parenting: 8,
  'conscious-parenting': 8,
  'co-parenting': 8,
  technology: 8,
  'systems-strategy': 8,
  politics: 8,
  spirituality: 8,
  philosophy: 8,
  psychology: 8,
  presence: 7,
  'self-care': 7,
  nutrition: 7,
  'emotional-regulation': 7,
  mindfulness: 7,
  'emotional-health': 7,
  fasting: 7,
  health: 7,
  metaspace: 6,
  recovery: 6,
  productivity: 6,
  'software-development': 6,
  workflow: 6,
  tools: 6,
  'learning-projects': 6,
  customization: 6,
  resilience: 6,
  responsibility: 6,
  'self-improvement': 6,
  'self-mastery': 6,
  'emotional-intelligence': 6,
  'self-awareness': 6,
  'puerto-rico': 5,
  economics: 5,
  meaning: 5,
  purpose: 5,
  identity: 5,
  power: 5,
  truth: 5,
  freedom: 5,
  family: 5,
  children: 5,
  'child-development': 5,
  'family-dynamics': 5,
  'social-issues': 5,
  'social-justice': 5,
  'collective-healing': 5,
  fear: 5,
  'political-awakening': 5,
  'systemic-critique': 5,
};

function buildTagWeights(): Record<string, number> {
  const weights: Record<string, number> = { default: DEFAULT_WEIGHT };
  for (const tag of PREFERRED_TAGS as readonly string[]) {
    weights[tag] = DEFAULT_PREFERRED_WEIGHT;
  }
  Object.assign(weights, TAG_WEIGHT_OVERRIDES);
  return weights;
}

export const TAG_WEIGHTS: Record<string, number> = buildTagWeights();

type MaslowKey =
  'physiological' | 'safety' | 'belonging' | 'esteem' | 'actualization' | 'transcendence';

const MASLOW_CATEGORY_META: Record<
  MaslowKey,
  Pick<TagCategory, 'title' | 'description' | 'icon' | 'color'>
> = {
  physiological: {
    title: 'Physiological Needs',
    description: 'Basic survival needs for food, health, and physical well-being',
    icon: '🍽️',
    color: 'bg-green-100 dark:bg-green-900/20',
  },
  safety: {
    title: 'Safety & Security',
    description: 'Protection, stability, and creating safe environments',
    icon: '🛡️',
    color: 'bg-blue-100 dark:bg-blue-900/20',
  },
  belonging: {
    title: 'Love & Belonging',
    description: 'Relationships, family, and social connections',
    icon: '💝',
    color: 'bg-pink-100 dark:bg-pink-900/20',
  },
  esteem: {
    title: 'Esteem & Achievement',
    description: 'Confidence, mastery, and recognition',
    icon: '🏆',
    color: 'bg-yellow-100 dark:bg-yellow-900/20',
  },
  actualization: {
    title: 'Self-Actualization',
    description: 'Personal growth, creativity, and fulfilling potential',
    icon: '🌱',
    color: 'bg-purple-100 dark:bg-purple-900/20',
  },
  transcendence: {
    title: 'Transcendence',
    description: 'Spiritual growth, helping others, and meaning beyond self',
    icon: '✨',
    color: 'bg-indigo-100 dark:bg-indigo-900/20',
  },
};

/**
 * Every preferred tag belongs in exactly one Maslow bucket.
 * Long-tail tags stay uncategorized on purpose.
 */
export const MASLOW_TAGS_BY_KEY: Record<MaslowKey, readonly string[]> = {
  physiological: [
    'breathing',
    'cooking',
    'fasting',
    'food',
    'health',
    'nutrition',
    'recipes',
    'self-care',
  ],
  safety: [
    'boundaries',
    'digital-safety',
    'emotional-health',
    'emotional-intelligence',
    'emotional-regulation',
    'fear',
    'mental-health',
    'recovery',
    'social-media',
    'therapy',
    'trauma',
  ],
  belonging: [
    'attachment',
    'child-development',
    'children',
    'co-parenting',
    'collective-healing',
    'communication',
    'compassion',
    'connection',
    'conscious-parenting',
    'culture',
    'empathy',
    'family',
    'family-dynamics',
    'fatherhood',
    'grief',
    'intimacy',
    'love',
    'parenting',
    'puerto-rico',
    'relationships',
    'social-issues',
    'social-justice',
    'trust',
    'vulnerability',
  ],
  esteem: [
    'education',
    'discipline',
    'identity',
    'leadership',
    'power',
    'responsibility',
    'self-awareness',
    'self-mastery',
    'values',
  ],
  actualization: [
    'activism',
    'ai',
    'ai-agents',
    'art-expression',
    'astro',
    'authenticity',
    'craftsmanship',
    'creativity',
    'customization',
    'democracy',
    'digital-art',
    'economics',
    'efficiency',
    'freedom',
    'governance',
    'habits',
    'learning',
    'learning-projects',
    'meaning',
    'memoir',
    'metaspace',
    'personal-growth',
    'poems',
    'political-awakening',
    'politics',
    'productivity',
    'psychology',
    'purpose',
    'revolution',
    'self-expression',
    'self-improvement',
    'self-reflection',
    'simplicity',
    'slow-living',
    'software-development',
    'systemic-critique',
    'systems-strategy',
    'technology',
    'time',
    'tools',
    'transformation',
    'typescript',
    'version-control',
    'web-development',
    'workflow',
    'writing',
  ],
  transcendence: [
    'consciousness',
    'healing',
    'inner-child',
    'inner-work',
    'meditation',
    'mindfulness',
    'mythology',
    'philosophy',
    'presence',
    'reflection',
    'resilience',
    'ritual',
    'spirituality',
    'symbols',
    'truth',
  ],
};

export const MASLOW_CATEGORIES: TagCategory[] = (
  Object.keys(MASLOW_CATEGORY_META) as MaslowKey[]
).map((key) => ({
  key,
  ...MASLOW_CATEGORY_META[key],
  tags: [...MASLOW_TAGS_BY_KEY[key]],
}));

const MASLOW_TAG_TO_KEY = new Map<string, MaslowKey>(
  (Object.entries(MASLOW_TAGS_BY_KEY) as Array<[MaslowKey, readonly string[]]>).flatMap(
    ([key, tags]) => tags.map((tag) => [tag, key] as const),
  ),
);

function displayNameForTag(tag: string): string {
  return tag
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

/** Optional blurbs. Missing preferred tags still get a name, weight, and category. */
const TAG_DESCRIPTIONS: Record<string, string> = {
  consciousness: 'Waking up inside your own life',
  'personal-growth': 'Becoming, without a syllabus',
  'mental-health': 'The mind as a daily condition',
  healing: 'Getting well after what hurt',
  'self-reflection': 'Looking inward with honesty',
  authenticity: 'Living without a performed self',
  transformation: 'Change that actually takes',
  'emotional-regulation': 'Staying present with feeling without being ruled by it',
  parenting: 'Raising children in real time',
  fatherhood: 'The work of being a father',
  family: 'Kinship, household, and the people we keep',
  'family-dynamics': 'How the household actually moves',
  children: 'Kids as people, not a project',
  'conscious-parenting': 'Raising them awake, not on autopilot',
  'co-parenting': 'Parenting across a split household',
  'child-development': 'How children grow, in stages and in front of you',
  therapy: 'Clinical and personal repair work',
  mindfulness: 'Attention brought back to now',
  'inner-work': 'The work nobody else can do for you',
  recovery: 'Coming back after the break',
  trauma: 'What stays in the body after the event',
  attachment: 'How we learn to reach, or not',
  grief: 'Living with what is gone',
  'emotional-health': 'Feelings as a climate you live in',
  values: 'What we actually stand on',
  truth: 'What remains when the story is stripped',
  purpose: 'The reason you keep going',
  meaning: 'What the days add up to',
  freedom: 'Room to live without a handler',
  responsibility: 'Owning the part that is yours',
  boundaries: 'Where you end and the rest of the world begins',
  metaspace: 'Notes about the notes — method, site, and writing',
  technology: 'Tools, systems, and the digital layer',
  'systems-strategy': 'How the machine is designed, not just used',
  'software-development': 'Building software as a craft',
  'learning-projects': 'Skills in progress, documented as they happen',
  learning: 'Staying a student on purpose',
  education: 'How we are taught, and what that teaching does',
  productivity: 'Output without pretending it is virtue',
  workflow: 'The path a task actually takes',
  tools: 'Instruments we reach for to make the work',
  efficiency: 'Less waste, not less humanity',
  'digital-safety': 'Staying intact in the networked layer',
  'social-media': 'The feed, and what it does to attention',
  presence: 'Showing up without rushing the moment',
  philosophy: 'Questions that do not fit a how-to',
  psychology: 'The mind as a subject, not a brand',
  spirituality: 'What we reach for beyond the measurable',
  poems: 'Poems, as their own shelf',
  memoir: 'Lived memory, told as narrative',
  reflection: 'Looking at a moment until it tells the truth',
  cooking: 'Food made at home, and why we cook',
  recipes: 'Dishes you can cook from',
  food: 'What we eat, and what it means',
  nutrition: 'How food meets the body',
  'self-care': 'Tending the body so the rest can stand',
  health: 'The body as a condition of the life',
  meditation: 'Sitting still until the noise thins',
  habits: 'What repeats until it becomes you',
  'puerto-rico': 'Home, diaspora, and the island as subject',
  culture: 'The water we swim in without naming it',
  identity: 'Who we say we are, and who that costs',
  love: 'Closeness, care, and choosing someone anyway',
  relationships: 'The long work of being with someone',
  vulnerability: 'Letting the real thing be seen',
  intimacy: 'Closeness that can stand the light',
  communication: 'Saying the real thing out loud',
  empathy: 'Feeling with someone without disappearing',
  connection: 'The thread between people',
  trust: 'Betting on someone, including yourself',
  compassion: 'Refusing to look away from pain',
  'social-issues': 'The public wound, named without a slogan',
  politics: 'Power, and who gets to use it',
  'systemic-critique': 'The design of the harm, not just the mood of it',
  'social-justice': 'Repair that has to be collective',
  'collective-healing': 'Getting well together, not only alone',
  power: 'Who holds the lever, and what it costs',
  revolution: 'Refusing the given order',
  economics: 'Money as a structure, not a personality test',
  resilience: 'Staying in the work after the hit',
  'self-improvement': 'Working on the self on purpose',
  'self-mastery': 'Command of your own reactions',
  'self-awareness': 'Seeing yourself without the costume',
  discipline: 'Doing it again when the feeling has left',
  fear: 'The alarm, and what it is actually for',
  writing: 'The practice of putting it on the page',
  'art-expression': 'Making as a way of saying',
};

function buildTagMetadata(): Record<string, TagData> {
  const metadata: Record<string, TagData> = {};
  for (const tag of PREFERRED_TAGS as readonly string[]) {
    metadata[tag] = {
      name: displayNameForTag(tag),
      weight: getTagWeight(tag),
      category: MASLOW_TAG_TO_KEY.get(tag),
      ...(TAG_DESCRIPTIONS[tag] ? { description: TAG_DESCRIPTIONS[tag] } : {}),
    };
  }
  return metadata;
}

export const TAG_METADATA: Record<string, TagData> = buildTagMetadata();

export function getTagWeight(tag: string): number {
  if (tag !== 'default' && Object.prototype.hasOwnProperty.call(TAG_WEIGHTS, tag)) {
    return TAG_WEIGHTS[tag];
  }
  if (PREFERRED_TAG_SET.has(tag)) return DEFAULT_PREFERRED_WEIGHT;
  return DEFAULT_WEIGHT;
}

export function getTagCategory(tag: string): TagCategory | undefined {
  const key = MASLOW_TAG_TO_KEY.get(tag);
  if (!key) return undefined;
  return MASLOW_CATEGORIES.find((category) => category.key === key);
}

export function getTagMetadata(tag: string): TagData {
  const existing = TAG_METADATA[tag];
  if (existing) return existing;
  return {
    name: displayNameForTag(tag),
    weight: getTagWeight(tag),
    category: getTagCategory(tag)?.key,
  };
}
