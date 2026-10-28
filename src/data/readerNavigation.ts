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

/**
 * The site chrome is English, but on a Spanish page the Field Guide link goes to
 * the Spanish guide, under its Spanish name, so a Spanish reader stays in Spanish.
 */
export function localizeReaderLink<T extends ReaderLink>(link: T, lang: 'en' | 'es' = 'en'): T {
  if (lang === 'es' && link.href === '/field-guide') {
    return { ...link, href: '/es/guia-de-campo', label: 'Guía de campo', lang: 'es' };
  }
  return link;
}
