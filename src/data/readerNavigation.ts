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

const SPANISH_LINKS: Record<string, Pick<ReaderLink, 'href' | 'label'>> = {
  '/browse': { href: '/browse', label: 'Explorar' },
  '/archive': { href: '/archive', label: 'Archivo' },
  '/field-guide': { href: '/es/guia-de-campo', label: 'Guía de campo' },
  '/about': { href: '/about', label: 'Sobre mí' },
  ['mailto:' + AUTHOR.email]: { href: 'mailto:' + AUTHOR.email, label: 'Escríbame' },
  [AUTHOR.url]: { href: AUTHOR.url, label: 'Todos mis enlaces' },
  '/rss.xml': { href: '/es/rss.xml', label: 'Seguir por RSS' },
};

/**
 * On a Spanish page the chrome is Spanish. Links keep their English destination
 * unless a Spanish one exists (the Field Guide, the Spanish feed).
 */
export function localizeReaderLink<T extends ReaderLink>(link: T, lang: 'en' | 'es' = 'en'): T {
  if (lang !== 'es') return link;
  const spanish = SPANISH_LINKS[link.href];
  if (!spanish) return link;
  // The page is Spanish already, so a Spanish label needs no lang of its own.
  const localized = { ...link, ...spanish };
  delete localized.lang;
  return localized;
}
