import type { ReaderLink } from './readerNavigation';

export interface NavigationItem extends ReaderLink {
  dropdown?: {
    label: string;
    items: ReaderLink[];
  };
}

/** Group hrefs identify their first destination; summaries open the native disclosure. */
export const mainNavigation: NavigationItem[] = [
  { href: '/everything', label: 'Everything' },
  { href: '/guided-path', label: 'Guided Path' },
  {
    href: '/tag',
    label: 'Browse',
    dropdown: {
      label: 'Find a subject',
      items: [
        { href: '/tag', label: 'Topics' },
        { href: '/category', label: 'Categories' },
      ],
    },
  },
  { href: '/about', label: 'About' },
];
