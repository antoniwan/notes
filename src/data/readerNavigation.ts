import { AUTHOR } from '../consts';

export interface ReaderLink {
  href: string;
  label: string;
}

export const readingLinks: ReaderLink[] = [
  { href: '/everything', label: 'Everything' },
  { href: '/guided-path', label: 'Guided Path' },
  { href: '/tag', label: 'Topics' },
  { href: '/category', label: 'Categories' },
];

export const contactLinks: ReaderLink[] = [
  { href: '/about', label: 'About' },
  { href: 'mailto:' + AUTHOR.email, label: 'Write to me' },
  { href: AUTHOR.url, label: 'All my links' },
  { href: '/rss.xml', label: 'Follow via RSS' },
];

export const siteToolLinks: ReaderLink[] = [
  { href: '/writing-insights', label: 'Writing Insights' },
  { href: '/tag-management', label: 'Tag Management' },
];
