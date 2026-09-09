export interface AuthoredBook {
  id: string;
  title: string;
  spanishTitle: string;
  description: string;
  summary: string;
  readerUrl: string;
  image: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
}

// Existing story art and titles from the author's book repositories:
// https://github.com/antoniwan/the-bent-one (public/og.svg)
// https://github.com/antoniwan/book-sun-and-moon (public/cover.jpg)
// Story and artwork retain their CC BY-NC 4.0 license.
export const authoredBooks: AuthoredBook[] = [
  {
    id: 'the-bent-one',
    title: 'The Bent One',
    spanishTitle: 'La Doblada',
    description:
      'A small red line joins others to become shapes, roofs, and a town. A picture book about difference, change, and the forms a line can take.',
    summary: 'A small red line and all the things it can become.',
    readerUrl: 'https://the-bent-one-book.stronghandssoftheart.com/',
    image: '/books/the-bent-one.svg',
    imageAlt: 'A red line with an upward bend on a warm off-white background.',
    imageWidth: 1200,
    imageHeight: 630,
  },
  {
    id: 'mia-the-sun-and-the-moon',
    title: 'Mia, the Sun, and the Moon',
    spanishTitle: 'Mia, el Sol y la Luna',
    description:
      'Mia plays beneath the sun, sings to the moon, and discovers that the moon can change, just as she can.',
    summary: 'Mia, the changing moon, and the rhythm of day and night.',
    readerUrl: 'https://mia-the-sun-and-the-moon-web-book.stronghandssoftheart.com/',
    image: '/books/mia-the-sun-and-the-moon-cover.jpg',
    imageAlt: 'A girl in a red coat watching the orange sun near the horizon across a blue field.',
    imageWidth: 1024,
    imageHeight: 771,
  },
];
