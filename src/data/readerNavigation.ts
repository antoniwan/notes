import { AUTHOR } from '../consts';

export interface ReaderLink {
  href: string;
  label: string;
  /** Set when the label is in another language than the page around it. */
  lang?: 'es';
}

export const readingLinks: ReaderLink[] = [
  { href: '/browse', label: 'Browse' },
  { href: '/archive', label: 'Archive' },
  { href: '/field-guide', label: 'Field Guide' },
  { href: '/es', label: 'En español', lang: 'es' },
];

export const contactLinks: ReaderLink[] = [
  { href: '/about', label: 'About' },
  { href: 'mailto:' + AUTHOR.email, label: 'Write to me' },
  { href: AUTHOR.url, label: 'All my links' },
  { href: '/rss.xml', label: 'Follow via RSS' },
];
