export interface Category {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

export const categories: Category[] = [
  {
    id: 'art-expression',
    name: 'Art & Expression',
    description: 'Creative soul, aesthetic power, truth-telling',
    icon: '🎵',
  },
  {
    id: 'culture',
    name: 'Culture',
    description: 'Social norms, collective behavior, and cultural critique',
    icon: '🌍',
  },
  {
    id: 'diy-creation',
    name: 'DIY & Creation',
    description: 'Physical builds, handmade goods, crafting',
    icon: '🛠️',
  },
  {
    id: 'integration-growth',
    name: 'Integration & Growth',
    description: 'Inner mastery, parenting, masculine leadership',
    icon: '🧘🏽‍♂️',
  },
  {
    id: 'learning-projects',
    name: 'Learning Projects',
    description: 'Documentation of mastery in progress',
    icon: '📚',
  },
  {
    id: 'media-reviews',
    name: 'Media Reviews',
    description: 'Film and TV notes — what landed, what didn’t, and why it matters',
    icon: '🎬',
  },
  {
    id: 'metaspace',
    name: 'Metaspace',
    description: 'Reflections on the journey itself — the why, the how, the code of life',
    icon: '🌀',
  },
  {
    id: 'parenting',
    name: 'Parenting',
    description: 'Raising resilient children, family dynamics, and personal growth',
    icon: '👨‍👩‍👧‍👦',
  },
  {
    id: 'politics',
    name: 'Politics',
    description: 'Power dynamics, social structures, and collective healing',
    icon: '⚖️',
  },
  {
    id: 'psychology',
    name: 'Psychology',
    description: 'Human behavior, social dynamics, and mental processes',
    icon: '🧠',
  },
  {
    id: 'systems-strategy',
    name: 'Systems & Strategy',
    description: 'Digital power, code, and strategic design',
    icon: '💻',
  },
];
