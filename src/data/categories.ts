export interface Category {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

export const categories: Category[] = [
  {
    id: 'art-expression',
    name: 'Arts and attempts',
    description: 'Some poems, and other things I tried to make',
    icon: '🎵',
  },
  {
    id: 'culture',
    name: 'What is culture?',
    description: 'Things I notice about how we live together',
    icon: '🌍',
  },
  {
    id: 'diy-creation',
    name: 'Do it yourself / DIY',
    description: 'Things I built, cooked, or set up myself',
    icon: '🛠️',
  },
  {
    id: 'integration-growth',
    name: 'Working on myself',
    description: 'Or growing up, still',
    icon: '🧘🏽‍♂️',
  },
  {
    id: 'learning-projects',
    name: 'Learning in public',
    description: "Things I'm still learning, written down as I go",
    icon: '📚',
  },
  {
    id: 'metaspace',
    name: 'Notes on the notes',
    description: 'About this site and how I write it',
    icon: '🌀',
  },
  {
    id: 'parenting',
    name: 'On parenting',
    description: 'Raising kids and learning as I go',
    icon: '👨‍👩‍👧‍👦',
  },
  {
    id: 'politics',
    name: 'On politics',
    description: 'Power, and what it does to ordinary life',
    icon: '⚖️',
  },
  {
    id: 'psychology',
    name: 'Psychology, roughly',
    description: 'How people think and behave, from an amateur',
    icon: '🧠',
  },
  {
    id: 'systems-strategy',
    name: 'On software and systems',
    description: 'Code, tools, and how I put them together',
    icon: '💻',
  },
];
