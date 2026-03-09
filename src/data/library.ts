export type BookStatus = 'read' | 'in-progress' | 'to-read';

export interface Book {
  title: string;
  author: string;
  shelf: string;
  status: BookStatus;
  format?: string;
  pages?: number;
  rating?: number;
}

export const books: Book[] = [
  // Currently Reading (8)
  {
    title: 'Rich Dad Poor Dad',
    author: 'Robert T. Kiyosaki',
    shelf: 'Business & Psychology',
    status: 'in-progress',
    format: 'Kindle Edition',
    pages: 336,
    rating: 4.09,
  },
  {
    title: 'Beyond Good and Evil',
    author: 'Friedrich Nietzsche',
    shelf: 'Philosophy & Wisdom',
    status: 'in-progress',
    format: 'Paperback',
    pages: 240,
    rating: 4.03,
  },
  {
    title: 'Meditations',
    author: 'Marcus Aurelius',
    shelf: 'Philosophy & Wisdom',
    status: 'in-progress',
    format: 'Paperback',
    pages: 254,
    rating: 4.28,
  },
  {
    title: '101 Essays That Will Change The Way You Think',
    author: 'Brianna Wiest',
    shelf: 'Personal Development & Self-Help',
    status: 'in-progress',
    format: 'Kindle Edition',
    pages: 450,
    rating: 3.72,
  },
  {
    title: 'Recovery from Gaslighting & Narcissistic Abuse',
    author: 'Don Barlow',
    shelf: 'Relationships & Trauma Recovery',
    status: 'in-progress',
    format: 'Kindle Edition',
    pages: 594,
    rating: 4.24,
  },
  {
    title: 'Modern Software Engineering',
    author: 'David Farley',
    shelf: 'Tech & Engineering',
    status: 'in-progress',
    format: 'Paperback',
    pages: 256,
    rating: 4.16,
  },
  {
    title: 'Atlas of the Heart',
    author: 'Brené Brown',
    shelf: 'Relationships & Trauma Recovery',
    status: 'in-progress',
    format: 'Hardcover',
    pages: 301,
    rating: 4.32,
  },
  {
    title: 'Stuff Good Players Should Know',
    author: 'Dick DeVenzio',
    shelf: 'Sports & Coaching',
    status: 'in-progress',
    format: 'Hardcover',
    pages: 293,
    rating: 4.59,
  },

  // Read (69) – Personal Development & Self-Help (18)
  {
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    shelf: 'Personal Development & Self-Help',
    status: 'read',
  },
  {
    title: '12 Rules for Life: An Antidote to Chaos',
    author: 'Jordan B. Peterson',
    shelf: 'Personal Development & Self-Help',
    status: 'read',
  },
  {
    title: 'Emotional Intelligence 2.0',
    author: 'Travis Bradberry',
    shelf: 'Personal Development & Self-Help',
    status: 'read',
  },
  {
    title: 'The 48 Laws of Power',
    author: 'Robert Greene',
    shelf: 'Personal Development & Self-Help',
    status: 'read',
  },
  {
    title: 'Adult Children of Emotionally Immature Parents',
    author: 'Lindsay C. Gibson',
    shelf: 'Personal Development & Self-Help',
    status: 'read',
  },
  {
    title: 'No-Drama Discipline',
    author: 'Daniel J. Siegel',
    shelf: 'Personal Development & Self-Help',
    status: 'read',
  },
  {
    title: 'Anger: Wisdom for Cooling the Flames',
    author: 'Thich Nhat Hanh',
    shelf: 'Personal Development & Self-Help',
    status: 'read',
  },
  {
    title: 'Anger: Taming the Beast',
    author: 'Reneau Z. Peurifoy',
    shelf: 'Personal Development & Self-Help',
    status: 'read',
  },
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    shelf: 'Personal Development & Self-Help',
    status: 'read',
  },
  {
    title: 'Journey to the Heart',
    author: 'Melody Beattie',
    shelf: 'Personal Development & Self-Help',
    status: 'read',
  },
  {
    title: 'The Obstacle Is the Way',
    author: 'Ryan Holiday',
    shelf: 'Personal Development & Self-Help',
    status: 'read',
  },
  {
    title: 'Your Erroneous Zones',
    author: 'Wayne W. Dyer',
    shelf: 'Personal Development & Self-Help',
    status: 'read',
  },
  {
    title: 'Everything Is F*cked',
    author: 'Mark Manson',
    shelf: 'Personal Development & Self-Help',
    status: 'read',
  },
  {
    title: 'Allies in Healing',
    author: 'Laura Davis',
    shelf: 'Personal Development & Self-Help',
    status: 'read',
  },
  {
    title: 'The 7 Habits of Highly Effective People',
    author: 'Stephen R. Covey',
    shelf: 'Personal Development & Self-Help',
    status: 'read',
  },
  {
    title: 'Gong Baths: A Guide to Sound Healing',
    author: 'Stephen Hill',
    shelf: 'Personal Development & Self-Help',
    status: 'read',
  },
  {
    title: "The Grown-Up's Guide to Teenage Humans",
    author: 'Josh Shipp',
    shelf: 'Personal Development & Self-Help',
    status: 'read',
  },
  {
    title: 'A Calendar of Wisdom',
    author: 'Leo Tolstoy',
    shelf: 'Personal Development & Self-Help',
    status: 'read',
  },

  // Technology & Programming (14)
  {
    title: 'JavaScript: The Definitive Guide',
    author: 'David Flanagan',
    shelf: 'Technology & Programming',
    status: 'read',
  },
  {
    title: 'The Book of CSS3',
    author: 'Peter Gasston',
    shelf: 'Technology & Programming',
    status: 'read',
  },
  {
    title: 'High Performance JavaScript',
    author: 'Nicholas C. Zakas',
    shelf: 'Technology & Programming',
    status: 'read',
  },
  {
    title: 'JavaScript Patterns',
    author: 'Stoyan Stefanov',
    shelf: 'Technology & Programming',
    status: 'read',
  },
  {
    title: 'Professional JavaScript for Web Developers',
    author: 'Nicholas C. Zakas',
    shelf: 'Technology & Programming',
    status: 'read',
  },
  {
    title: 'Effective JavaScript',
    author: 'David Herman',
    shelf: 'Technology & Programming',
    status: 'read',
  },
  {
    title: 'HTML and CSS: Design and Build Websites',
    author: 'Jon Duckett',
    shelf: 'Technology & Programming',
    status: 'read',
  },
  {
    title: 'Version Control with Git',
    author: 'Jon Loeliger',
    shelf: 'Technology & Programming',
    status: 'read',
  },
  {
    title: 'PHP Object-Oriented Solutions',
    author: 'David Powers',
    shelf: 'Technology & Programming',
    status: 'read',
  },
  {
    title: 'High Performance MySQL',
    author: 'Baron Schwartz',
    shelf: 'Technology & Programming',
    status: 'read',
  },
  {
    title: "The Web Designer's Idea Book, Vol. 2",
    author: 'Patrick McNeil',
    shelf: 'Technology & Programming',
    status: 'read',
  },
  {
    title: 'What is HTML 5?',
    author: 'Brett McLaughlin',
    shelf: 'Technology & Programming',
    status: 'read',
  },
  {
    title: 'Web Database Applications with PHP & MySQL',
    author: 'Hugh E. Williams',
    shelf: 'Technology & Programming',
    status: 'read',
  },
  {
    title: 'AJAX and PHP',
    author: 'Cristian Darie',
    shelf: 'Technology & Programming',
    status: 'read',
  },

  // Leadership & Management (9)
  {
    title: "The Manager's Path",
    author: 'Camille Fournier',
    shelf: 'Leadership & Management',
    status: 'read',
  },
  {
    title: 'High Output Management',
    author: 'Andrew S. Grove',
    shelf: 'Leadership & Management',
    status: 'read',
  },
  {
    title: 'The Art of Leadership',
    author: 'Michael Lopp',
    shelf: 'Leadership & Management',
    status: 'read',
  },
  {
    title: 'The Professional Product Owner',
    author: 'Don McGreal',
    shelf: 'Leadership & Management',
    status: 'read',
  },
  {
    title: 'Building Evolutionary Architectures',
    author: 'Neal Ford',
    shelf: 'Leadership & Management',
    status: 'read',
  },
  {
    title: 'Hacking Growth',
    author: 'Sean Ellis',
    shelf: 'Leadership & Management',
    status: 'read',
  },
  {
    title: 'The Daily Stoic',
    author: 'Ryan Holiday',
    shelf: 'Leadership & Management',
    status: 'read',
  },
  {
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    shelf: 'Leadership & Management',
    status: 'read',
  },
  {
    title: 'Freakonomics',
    author: 'Steven D. Levitt',
    shelf: 'Leadership & Management',
    status: 'read',
  },

  // Relationships & Trauma Recovery (12)
  {
    title: "The Couple's Workbook",
    author: 'The School of Life',
    shelf: 'Relationships & Trauma Recovery',
    status: 'read',
  },
  {
    title: 'Saboreando Salud',
    author: 'Lydibel Porrata',
    shelf: 'Relationships & Trauma Recovery',
    status: 'read',
  },
  {
    title: 'Why Does He Do That?',
    author: 'Lundy Bancroft',
    shelf: 'Relationships & Trauma Recovery',
    status: 'read',
  },
  {
    title: 'Attached',
    author: 'Amir Levine',
    shelf: 'Relationships & Trauma Recovery',
    status: 'read',
  },
  {
    title: 'The Five Love Languages',
    author: 'Gary Chapman',
    shelf: 'Relationships & Trauma Recovery',
    status: 'read',
  },
  {
    title: 'The Whole-Brain Child',
    author: 'Daniel J. Siegel',
    shelf: 'Relationships & Trauma Recovery',
    status: 'read',
  },
  {
    title: 'Nonviolent Communication',
    author: 'Marshall B. Rosenberg',
    shelf: 'Relationships & Trauma Recovery',
    status: 'read',
  },
  {
    title: 'The Way of the Superior Man',
    author: 'David Deida',
    shelf: 'Relationships & Trauma Recovery',
    status: 'read',
  },
  {
    title: 'No More Mr. Nice Guy',
    author: 'Robert A. Glover',
    shelf: 'Relationships & Trauma Recovery',
    status: 'read',
  },
  {
    title: 'Feeling Good',
    author: 'David D. Burns',
    shelf: 'Relationships & Trauma Recovery',
    status: 'read',
  },
  {
    title: 'Print Handwriting Workbook for Adults',
    author: 'Sujatha Lalgudi',
    shelf: 'Relationships & Trauma Recovery',
    status: 'read',
  },
  {
    title: 'Bringing Up Girls',
    author: 'James C. Dobson',
    shelf: 'Relationships & Trauma Recovery',
    status: 'read',
  },

  // Creative & Design (3)
  {
    title: 'Ruined by Design',
    author: 'Mike Monteiro',
    shelf: 'Creative & Design',
    status: 'read',
  },
  {
    title: 'The Dore Gallery: His 120 Greatest Illustrations',
    author: 'Gustave Doré',
    shelf: 'Creative & Design',
    status: 'read',
  },
  {
    title: 'Happily Ever After: The Artwork of Jeremy Fish',
    author: 'Jeremy Fish',
    shelf: 'Creative & Design',
    status: 'read',
  },

  // Art & Literature (5)
  {
    title: 'The Complete Calvin and Hobbes',
    author: 'Bill Watterson',
    shelf: 'Art & Literature',
    status: 'read',
  },
  {
    title: 'Fahrenheit 451',
    author: 'Ray Bradbury',
    shelf: 'Art & Literature',
    status: 'read',
  },
  {
    title: 'Lord of the Flies',
    author: 'William Golding',
    shelf: 'Art & Literature',
    status: 'read',
  },
  {
    title: 'The Metamorphosis',
    author: 'Franz Kafka',
    shelf: 'Art & Literature',
    status: 'read',
  },
  {
    title: 'El principito',
    author: 'Antoine de Saint-Exupéry',
    shelf: 'Art & Literature',
    status: 'read',
  },

  // Food & Cooking (2)
  {
    title: 'Diasporican: A Puerto Rican Cookbook',
    author: 'Illyanna Maisonet',
    shelf: 'Food & Cooking',
    status: 'read',
  },
  {
    title: 'Cocina criolla',
    author: 'Empresas Cucuye Inc.',
    shelf: 'Food & Cooking',
    status: 'read',
  },

  // Reference & Educational (6)
  {
    title: 'Database Management Systems',
    author: 'Raghu Ramakrishnan',
    shelf: 'Reference & Educational',
    status: 'read',
  },
  {
    title: 'Operating System Concepts',
    author: 'Abraham Silberschatz',
    shelf: 'Reference & Educational',
    status: 'read',
  },
  {
    title: "A Beginner's Guide to Discrete Mathematics",
    author: 'W.D. Wallis',
    shelf: 'Reference & Educational',
    status: 'read',
  },
  {
    title: 'Human Anatomy in Full Color',
    author: 'John Green',
    shelf: 'Reference & Educational',
    status: 'read',
  },
  {
    title: 'The China Study',
    author: 'T. Colin Campbell',
    shelf: 'Reference & Educational',
    status: 'read',
  },
  {
    title: 'Programming Languages: Design and Implementation',
    author: 'Terrence W. Pratt',
    shelf: 'Reference & Educational',
    status: 'read',
  },

  // Parenting & Life (2)
  {
    title: "We're Pregnant! The First Time Dad's Pregnancy Handbook",
    author: 'Adrian Kulp',
    shelf: 'Parenting & Life',
    status: 'read',
  },
  {
    title: 'How to Cook Everything',
    author: 'Mark Bittman',
    shelf: 'Parenting & Life',
    status: 'read',
  },

  // Comics & Humor (1)
  {
    title: 'Cyanide and Happiness',
    author: 'Kris Wilson',
    shelf: 'Comics & Humor',
    status: 'read',
  },

  // Other (2)
  {
    title: 'Thing Explainer',
    author: 'Randall Munroe',
    shelf: 'Other',
    status: 'read',
  },
  {
    title: 'Infection & Immunity',
    author: 'John H.L. Playton',
    shelf: 'Other',
    status: 'read',
  },

  // To Read (66) – Spirituality & Personal Growth (16)
  {
    title: 'The Creative Act: A Way of Being',
    author: 'Rick Rubin',
    shelf: 'Spirituality & Personal Growth',
    status: 'to-read',
  },
  {
    title: 'The War of Art',
    author: 'Steven Pressfield',
    shelf: 'Spirituality & Personal Growth',
    status: 'to-read',
  },
  {
    title: 'Lighter: Let Go of the Past, Connect With the Present, and Expand the Future',
    author: 'Yung Pueblo',
    shelf: 'Spirituality & Personal Growth',
    status: 'to-read',
  },
  {
    title: 'Starry Messenger',
    author: 'Neil deGrasse Tyson',
    shelf: 'Spirituality & Personal Growth',
    status: 'to-read',
  },
  {
    title: 'Untamed',
    author: 'Glennon Doyle',
    shelf: 'Spirituality & Personal Growth',
    status: 'to-read',
  },
  {
    title: "Cunningham's Encyclopedia of Magical Herbs",
    author: 'Scott Cunningham',
    shelf: 'Spirituality & Personal Growth',
    status: 'to-read',
  },
  {
    title: 'Thus spake Zarathustra',
    author: 'Friedrich Nietzsche',
    shelf: 'Spirituality & Personal Growth',
    status: 'to-read',
  },
  {
    title: "You Are Your Child's First Teacher",
    author: 'Rahima Baldwin Dancy',
    shelf: 'Spirituality & Personal Growth',
    status: 'to-read',
  },
  {
    title: 'The Courage to Heal',
    author: 'Ellen Bass',
    shelf: 'Spirituality & Personal Growth',
    status: 'to-read',
  },
  {
    title: 'Mujeres que corren con los Lobos',
    author: 'Clarissa Pinkola Estés',
    shelf: 'Spirituality & Personal Growth',
    status: 'to-read',
  },
  {
    title: 'Psychic Empath',
    author: 'Kimberly Moon',
    shelf: 'Spirituality & Personal Growth',
    status: 'to-read',
  },
  {
    title: 'Yoga Nidra Scripts',
    author: 'Tamara Skyhawk',
    shelf: 'Spirituality & Personal Growth',
    status: 'to-read',
  },
  {
    title: 'Complex PTSD: From Surviving to Thriving',
    author: 'Pete Walker',
    shelf: 'Spirituality & Personal Growth',
    status: 'to-read',
  },
  {
    title: 'Me and White Supremacy',
    author: 'Layla F. Saad',
    shelf: 'Spirituality & Personal Growth',
    status: 'to-read',
  },
  {
    title: 'You Can Heal Your Life',
    author: 'Louise L. Hay',
    shelf: 'Spirituality & Personal Growth',
    status: 'to-read',
  },
  {
    title: 'Una vida con Ángeles',
    author: 'Tania Karam',
    shelf: 'Spirituality & Personal Growth',
    status: 'to-read',
  },

  // Spiritual Guides & Angels (4)
  {
    title: 'Veneración a los ancestros',
    author: 'Mari Silva',
    shelf: 'Spiritual Guides & Angels',
    status: 'to-read',
  },
  {
    title: 'Arcángeles: Una guía espiritual',
    author: 'Mari Silva',
    shelf: 'Spiritual Guides & Angels',
    status: 'to-read',
  },
  {
    title: 'Guías espirituales animales',
    author: 'Mari Silva',
    shelf: 'Spiritual Guides & Angels',
    status: 'to-read',
  },
  {
    title: 'Soul Cleansing and Energetic Protection',
    author: 'Eva Márquez',
    shelf: 'Spiritual Guides & Angels',
    status: 'to-read',
  },

  // Healing & Wellness (4)
  {
    title: 'Medical Medium Cleanse to Heal',
    author: 'Anthony William',
    shelf: 'Healing & Wellness',
    status: 'to-read',
  },
  {
    title: 'Coping with Trauma-Related Dissociation',
    author: 'Suzette Boon',
    shelf: 'Healing & Wellness',
    status: 'to-read',
  },
  {
    title: 'Healing Your Wounded Inner Child',
    author: 'Maria Clarke',
    shelf: 'Healing & Wellness',
    status: 'to-read',
  },
  {
    title: 'Empath and Psychic Abilities',
    author: 'Ellen J. Cure',
    shelf: 'Healing & Wellness',
    status: 'to-read',
  },

  // Tech & Engineering (3)
  {
    title: 'Fundamentals of Software Architecture',
    author: 'Mark Richards',
    shelf: 'Tech & Engineering',
    status: 'to-read',
  },
  {
    title: 'User Story Mapping',
    author: 'Jeff Patton',
    shelf: 'Tech & Engineering',
    status: 'to-read',
  },
  {
    title: 'This Is How We Come Back Stronger',
    author: 'Feminist Book Society',
    shelf: 'Tech & Engineering',
    status: 'to-read',
  },

  // Philosophy & Wisdom (4)
  {
    title: 'The Wisdom of the Enneagram',
    author: 'Don Richard Riso',
    shelf: 'Philosophy & Wisdom',
    status: 'to-read',
  },
  {
    title: 'High Performance Habits',
    author: 'Brendon Burchard',
    shelf: 'Philosophy & Wisdom',
    status: 'to-read',
  },
  {
    title: 'Of Human Freedom',
    author: 'Epictetus',
    shelf: 'Philosophy & Wisdom',
    status: 'read',
  },
  {
    title: 'The Bhagavad Gita',
    author: 'Krishna-Dwaipayana Vyasa',
    shelf: 'Philosophy & Wisdom',
    status: 'to-read',
  },

  // Parenting & Child Development (3)
  {
    title: 'The 5 Love Languages of Teenagers',
    author: 'Gary Chapman',
    shelf: 'Parenting & Child Development',
    status: 'to-read',
  },
  {
    title: 'Adult Children of Emotionally Immature Parents',
    author: 'Lindsay C. Gibson',
    shelf: 'Parenting & Child Development',
    status: 'to-read',
  },
  {
    title: 'Practical Guide to the Montessori Method at Home',
    author: 'Julia Palmarola',
    shelf: 'Parenting & Child Development',
    status: 'to-read',
  },

  // Yoga & Meditation (3)
  {
    title: 'Integral Yoga: The Yoga Sutras of Patanjali',
    author: 'Satchidananda',
    shelf: 'Yoga & Meditation',
    status: 'to-read',
  },
  {
    title: 'The Yoga Sutras of Patanjali',
    author: 'Satchidananda',
    shelf: 'Yoga & Meditation',
    status: 'to-read',
  },
  {
    title: 'Basic Art of Adjustments: A Beginning Guide to Yoga',
    author: 'Alanna Kaivalya',
    shelf: 'Yoga & Meditation',
    status: 'to-read',
  },

  // Business & Psychology (4)
  {
    title: 'Kanban',
    author: 'David J. Anderson',
    shelf: 'Business & Psychology',
    status: 'to-read',
  },
  {
    title: 'Magical Beginnings, Enchanted Lives',
    author: 'Deepak Chopra',
    shelf: 'Business & Psychology',
    status: 'to-read',
  },
  {
    title: 'The Tipping Point',
    author: 'Malcolm Gladwell',
    shelf: 'Business & Psychology',
    status: 'to-read',
  },
  {
    title: 'Methods of Persuasion',
    author: 'Nick Kolenda',
    shelf: 'Business & Psychology',
    status: 'to-read',
  },

  // Personal Development (3)
  {
    title: 'Adult Children of Emotionally Immature Parents',
    author: 'Lindsay C. Gibson',
    shelf: 'Personal Development',
    status: 'to-read',
  },
  {
    title: 'Feeling Good Together',
    author: 'David D. Burns',
    shelf: 'Personal Development',
    status: 'to-read',
  },
  {
    title: 'The Power of Positive Thinking',
    author: 'Norman Vincent Peale',
    shelf: 'Personal Development',
    status: 'to-read',
  },

  // Literature (3)
  {
    title: 'Ready Player One',
    author: 'Ernest Cline',
    shelf: 'Literature',
    status: 'to-read',
  },
  {
    title: 'Bridge to Terabithia',
    author: 'Katherine Paterson',
    shelf: 'Literature',
    status: 'to-read',
  },
  {
    title: 'The Declaration of Independence and the Constitution',
    author: 'Founding Fathers',
    shelf: 'Literature',
    status: 'to-read',
  },

  // Art & Design (2)
  {
    title: 'Mark Ryden. Pinxit',
    author: 'Amanda Erlanson',
    shelf: 'Art & Design',
    status: 'to-read',
  },
  {
    title: 'Improve Your Handwriting',
    author: 'Rosemary Sassoon',
    shelf: 'Art & Design',
    status: 'to-read',
  },

  // Miscellaneous (6 explicitly listed, though heading says 17)
  {
    title: 'Calm the Chaos Cards',
    author: 'Nicola Ries Taggart',
    shelf: 'Miscellaneous',
    status: 'to-read',
  },
  {
    title: 'Guitar Fretboard',
    author: 'Guitar Head',
    shelf: 'Miscellaneous',
    status: 'to-read',
  },
  {
    title: 'Bring Up Girls',
    author: 'James C. Dobson',
    shelf: 'Miscellaneous',
    status: 'to-read',
  },
  {
    title: '14,000 Things to Be Happy About',
    author: 'Barbara Ann Kipfer',
    shelf: 'Miscellaneous',
    status: 'to-read',
  },
  {
    title: '10-Minute Life Lessons for Kids',
    author: 'Jamie C. Miller',
    shelf: 'Miscellaneous',
    status: 'to-read',
  },
  {
    title: 'The Book of Virtues for Young People',
    author: 'William J. Bennett',
    shelf: 'Miscellaneous',
    status: 'to-read',
  },
];

export const libraryStats = {
  totalBooks: books.length,
  readCount: books.filter((book) => book.status === 'read').length,
  currentlyReadingCount: books.filter((book) => book.status === 'in-progress').length,
  toReadCount: books.filter((book) => book.status === 'to-read').length,
};
