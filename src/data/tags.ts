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

// Tag importance weights - higher numbers = more important
export const TAG_WEIGHTS: Record<string, number> = {
  // Core themes (highest priority) - foundational topics
  consciousness: 10,
  'personal-growth': 10,
  'mental-health': 10,
  healing: 10,
  therapy: 9,
  'self-reflection': 9,
  transformation: 9,
  authenticity: 9,
  values: 9,
  love: 10,
  revolution: 9,
  fatherhood: 8,
  presence: 7,
  metaspace: 6,
  recovery: 6,
  writing: 4,
  'puerto-rico': 5,
  economics: 5,
  poems: 4,
  memoir: 4,

  // Major life areas
  parenting: 8,
  'conscious-parenting': 8,
  'co-parenting': 8,
  technology: 8,
  'systems-strategy': 8,
  politics: 8,
  spirituality: 8,
  philosophy: 8,
  psychology: 8,

  // Health & wellness (high priority)
  wellness: 7,
  'self-care': 7,
  nutrition: 7,
  fitness: 7,
  'emotional-regulation': 7,
  mindfulness: 7,
  'emotional-health': 7,
  fasting: 7,
  health: 7,

  // Professional & technical
  productivity: 6,
  'software-development': 6,
  efficiency: 6,
  workflow: 6,
  tools: 6,
  'learning-projects': 6,
  customization: 6,

  // Personal development skills
  resilience: 6,
  discipline: 6,
  responsibility: 6,
  'self-improvement': 6,
  'self-mastery': 6,
  'emotional-intelligence': 6,
  'self-awareness': 6,

  // Content themes
  meaning: 5,
  purpose: 5,
  identity: 5,
  power: 5,
  truth: 5,
  freedom: 5,
  'intentional-living': 5,
  'self-discovery': 5,

  // Family & relationships
  family: 5,
  children: 5,
  'child-development': 5,
  'family-dynamics': 5,

  // Social & cultural
  'social-issues': 5,
  'social-justice': 5,
  'collective-healing': 5,
  fear: 5,
  control: 5,
  'radical-love': 6,
  'political-awakening': 5,
  'systemic-critique': 5,
  'fear-dissolution': 6,
  'love-as-resistance': 6,

  // Creative & expressive
  'art-expression': 4,
  creativity: 4,
  expression: 4,
  symbols: 4,
  mythology: 4,

  // Practical skills
  cooking: 4,
  'diy-creation': 4,
  'healthy-eating': 4,
  micronutrients: 4,

  // Technical topics
  terminal: 4,
  wezterm: 4,
  powershell: 4,
  'oh-my-posh': 4,
  zoxide: 4,
  windows: 4,
  nvm: 4,
  fzf: 4,
  'electric-vehicles': 4,
  'automotive-design': 4,
  regulations: 4,
  innovation: 4,
  'technology-policy': 4,

  // Mental health specific
  'analysis-paralysis': 4,
  'emotional-pain': 4,
  trauma: 4,
  'imposter-syndrome': 4,
  journaling: 4,
  'evidence-based': 4,

  // Lifestyle & habits
  routine: 4,
  habits: 4,
  simplicity: 4,
  minimalism: 4,
  'inner-peace': 4,
  contentment: 4,
  gratitude: 4,

  // Spiritual & philosophical
  atheism: 4,
  humanism: 4,
  existentialism: 4,
  reflection: 4,
  meditation: 4,
  ritual: 4,

  // Learning & education
  learning: 4,
  books: 4,
  'self-transcendence': 4,
  education: 4,

  // Communication & empathy
  empathy: 4,
  compassion: 4,
  communication: 4,
  respect: 4,

  // Digital & safety
  'digital-safety': 4,
  internet: 4,
  safety: 4,

  // Specific topics
  'beef-heart': 3,
  'organ-meats': 3,
  'total-concentration-breathing': 3,
  breathwork: 3,
  'stronghand-terminal': 3,
  illuminati: 3,
  'builds-software': 3,

  // General concepts (lower priority)
  growth: 3,
  change: 3,
  evolution: 3,
  progress: 3,
  improvement: 3,
  development: 3,
  mastery: 3,
  excellence: 3,

  // Default weight for unlisted tags
  default: 1,
};

// Maslow's Hierarchy of Needs categorization
export const MASLOW_CATEGORIES: TagCategory[] = [
  {
    key: 'physiological',
    title: 'Physiological Needs',
    description: 'Basic survival needs for food, health, and physical well-being',
    icon: '🍽️',
    color: 'bg-green-100 dark:bg-green-900/20',
    tags: [
      'nutrition',
      'health',
      'cooking',
      'food',
      'healthy-eating',
      'micronutrients',
      'fasting',
      'breathing',
      'fitness',
      'recipes',
      'self-care',
    ],
  },
  {
    key: 'safety',
    title: 'Safety & Security',
    description: 'Protection, stability, and creating safe environments',
    icon: '🛡️',
    color: 'bg-blue-100 dark:bg-blue-900/20',
    tags: [
      'digital-safety',
      'boundaries',
      'control',
      'discipline',
      'self-control',
      'emotional-regulation',
      'mental-health',
      'therapy',
      'trauma',
      'fear',
      'emotional-health',
      'emotional-pain',
      'emotional-intelligence',
    ],
  },
  {
    key: 'belonging',
    title: 'Love & Belonging',
    description: 'Relationships, family, and social connections',
    icon: '💝',
    color: 'bg-pink-100 dark:bg-pink-900/20',
    tags: [
      'family',
      'family-dynamics',
      'children',
      'parenting',
      'conscious-parenting',
      'co-parenting',
      'fatherhood',
      'relationships',
      'connection',
      'empathy',
      'compassion',
      'collective-healing',
      'social-issues',
      'social-justice',
      'child-development',
      'childhood',
      'vulnerability',
      'love',
      'radical-love',
      'love-as-resistance',
      'guilt',
      'attachment',
    ],
  },
  {
    key: 'esteem',
    title: 'Esteem & Achievement',
    description: 'Confidence, mastery, and recognition',
    icon: '🏆',
    color: 'bg-yellow-100 dark:bg-yellow-900/20',
    tags: [
      'confidence-building',
      'mastery',
      'achievement',
      'respect',
      'responsibility',
      'accountability',
      'leadership',
      'professional-development',
      'imposter-syndrome',
      'self-discipline',
      'self-mastery',
      'power',
      'authority',
      'feedback',
      'self-awareness',
      'humility',
      'ego',
      'values',
    ],
  },
  {
    key: 'actualization',
    title: 'Self-Actualization',
    description: 'Personal growth, creativity, and fulfilling potential',
    icon: '🌱',
    color: 'bg-purple-100 dark:bg-purple-900/20',
    tags: [
      'personal-growth',
      'self-improvement',
      'learning',
      'learning-projects',
      'self-expression',
      'art-expression',
      'creativity',
      'diy-creation',
      'craftsmanship',
      'development',
      'transformation',
      'intentional-living',
      'purpose',
      'meaning',
      'authenticity',
      'adaptability',
      'decision-making',
      'efficiency',
      'habits',
      'limits',
      'patience',
      'productivity',
      'self-construction',
      'self-reflection',
      'simplicity',
      'slow-living',
      'time',
      'tips',
      'tools',
      'workflow',
      'writing',
      'digital-art',
      'customization',
      'revolution',
      'political-awakening',
      'systemic-critique',
      'metaspace',
      'technology',
    ],
  },
  {
    key: 'transcendence',
    title: 'Transcendence',
    description: 'Spiritual growth, helping others, and meaning beyond self',
    icon: '✨',
    color: 'bg-indigo-100 dark:bg-indigo-900/20',
    tags: [
      'self-transcendence',
      'spirituality',
      'consciousness',
      'existentialism',
      'philosophy',
      'humanism',
      'atheism',
      'mythology',
      'symbols',
      'inner-work',
      'inner-peace',
      'serenity',
      'contentment',
      'meditation',
      'mindfulness',
      'presence',
      'truth',
      'healing',
      'inner-child',
      'reflection',
      'resilience',
      'ritual',
      'routine',
      'fear-dissolution',
    ],
  },
];

// Tag metadata for enhanced display (top browse tags). Others humanize from slug.
export const TAG_METADATA: Record<string, TagData> = {
  consciousness: {
    name: 'Consciousness',
    weight: 10,
    description: 'Awareness and mindful presence',
    category: 'transcendence',
  },
  'personal-growth': {
    name: 'Personal Growth',
    weight: 10,
    description: 'Continuous self-improvement and development',
    category: 'actualization',
  },
  'mental-health': {
    name: 'Mental Health',
    weight: 10,
    description: 'Psychological well-being and emotional balance',
    category: 'safety',
  },
  healing: {
    name: 'Healing',
    weight: 10,
    description: 'Recovery and restoration processes',
    category: 'transcendence',
  },
  'self-reflection': {
    name: 'Self-Reflection',
    weight: 9,
    description: 'Looking inward with honesty',
    category: 'actualization',
  },
  authenticity: {
    name: 'Authenticity',
    weight: 9,
    description: 'Living without a performed self',
    category: 'actualization',
  },
  transformation: {
    name: 'Transformation',
    weight: 9,
    description: 'Change that actually takes',
    category: 'actualization',
  },
  'emotional-regulation': {
    name: 'Emotional Regulation',
    weight: 7,
    description: 'Staying present with feeling without being ruled by it',
    category: 'safety',
  },
  parenting: {
    name: 'Parenting',
    weight: 8,
    description: 'Raising children in real time',
    category: 'belonging',
  },
  fatherhood: {
    name: 'Fatherhood',
    weight: 8,
    description: 'The work of being a father',
    category: 'belonging',
  },
  family: {
    name: 'Family',
    weight: 5,
    description: 'Kinship, household, and the people we keep',
    category: 'belonging',
  },
  therapy: {
    name: 'Therapy',
    weight: 9,
    description: 'Clinical and personal repair work',
    category: 'safety',
  },
  mindfulness: {
    name: 'Mindfulness',
    weight: 7,
    description: 'Attention brought back to now',
    category: 'transcendence',
  },
  values: {
    name: 'Values',
    weight: 9,
    description: 'What we actually stand on',
    category: 'esteem',
  },
  metaspace: {
    name: 'Metaspace',
    weight: 6,
    description: 'Notes about the notes — method, site, and writing',
    category: 'actualization',
  },
  technology: {
    name: 'Technology',
    weight: 8,
    description: 'Tools, systems, and the digital layer',
    category: 'actualization',
  },
  presence: {
    name: 'Presence',
    weight: 7,
    description: 'Showing up without rushing the moment',
    category: 'transcendence',
  },
  philosophy: {
    name: 'Philosophy',
    weight: 8,
    description: 'Questions that do not fit a how-to',
    category: 'transcendence',
  },
  poems: {
    name: 'Poems',
    weight: 4,
    description: 'Poems and poetry',
    category: 'actualization',
  },
  memoir: {
    name: 'Memoir',
    weight: 4,
    description: 'Lived memory, told as narrative',
    category: 'actualization',
  },
  reflection: {
    name: 'Reflection',
    weight: 4,
    description: 'Direct reflective writing',
    category: 'transcendence',
  },
};

// Utility functions
export function getTagWeight(tag: string): number {
  if (tag !== 'default' && Object.prototype.hasOwnProperty.call(TAG_WEIGHTS, tag)) {
    return TAG_WEIGHTS[tag];
  }
  if (PREFERRED_TAG_SET.has(tag)) return 4;
  return TAG_WEIGHTS.default;
}

export function getTagCategory(tag: string): TagCategory | undefined {
  return MASLOW_CATEGORIES.find((category) => category.tags.includes(tag));
}

function displayNameForTag(tag: string): string {
  return tag
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
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
