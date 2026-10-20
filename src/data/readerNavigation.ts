import { AUTHOR } from '../consts';

export interface ReaderLink {
  href: string;
  label: string;
}

export const readingLinks: ReaderLink[] = [
  { href: '/browse', label: 'Browse' },
  { href: '/archive', label: 'Archive' },
];

export const contactLinks: ReaderLink[] = [
  { href: '/about', label: 'About' },
  { href: 'mailto:' + AUTHOR.email, label: 'Write to me' },
  { href: AUTHOR.url, label: 'All my links' },
  { href: '/rss.xml', label: 'Follow via RSS' },
];

export const siteToolLinks: ReaderLink[] = [{ href: '/tag-management', label: 'Tag Management' }];
