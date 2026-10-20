import type { ReaderLink } from './readerNavigation';

export interface NavigationItem extends ReaderLink {
  dropdown?: {
    label: string;
    items: ReaderLink[];
  };
}

/** Group hrefs identify their first destination; summaries open the native disclosure. */
export const mainNavigation: NavigationItem[] = [
  { href: '/archive', label: 'Archive' },
  { href: '/browse', label: 'Browse' },
  { href: '/about', label: 'About' },
];
