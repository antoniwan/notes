export interface Category {
  id: string;
  name: string;
  /** The name on Spanish pages. The category page itself stays English. */
  nameEs: string;
  description: string;
  icon?: string;
}

export const categories: Category[] = [
  {
    id: 'art-expression',
    name: 'Arts and attempts',
    nameEs: 'Artes e intentos',
    description: 'Some poems, and other things I tried to make',
    icon: '🎵',
  },
  {
    id: 'culture',
    name: 'What is culture?',
    nameEs: '¿Qué es la cultura?',
    description: 'Things I notice about how we live together',
    icon: '🌍',
  },
  {
    id: 'diy-creation',
    name: 'Do it yourself / DIY',
    nameEs: 'Hecho en casa / DIY',
    description: 'Things I built, cooked, or set up myself',
    icon: '🛠️',
  },
  {
    id: 'integration-growth',
    name: 'Working on myself',
    nameEs: 'Trabajando en mí mismo',
    description: 'Or growing up, still',
    icon: '🧘🏽‍♂️',
  },
  {
    id: 'learning-projects',
    name: 'Learning in public',
    nameEs: 'Aprendiendo en público',
    description: "Things I'm still learning, written down as I go",
    icon: '📚',
  },
  {
    id: 'metaspace',
    name: 'Notes on the notes',
    nameEs: 'Notas sobre las notas',
    description: 'About this site and how I write it',
    icon: '🌀',
  },
  {
    id: 'parenting',
    name: 'On parenting',
    nameEs: 'Sobre la crianza',
    description: 'Raising kids and learning as I go',
    icon: '👨‍👩‍👧‍👦',
  },
  {
    id: 'politics',
    name: 'On politics',
    nameEs: 'Sobre política',
    description: 'Power, and what it does to ordinary life',
    icon: '⚖️',
  },
  {
    id: 'psychology',
    name: 'Psychology, roughly',
    nameEs: 'Psicología, más o menos',
    description: 'How people think and behave, from an amateur',
    icon: '🧠',
  },
  {
    id: 'systems-strategy',
    name: 'On software and systems',
    nameEs: 'Sobre software y sistemas',
    description: 'Code, tools, and how I put them together',
    icon: '💻',
  },
];
