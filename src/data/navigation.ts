export interface NavigationItem {
  href: string;
  label: string;
  dropdown?: {
    label: string;
    items?: {
      href: string;
      label: string;
      icon?: string;
    }[];
  };
}

/** All hrefs omit trailing slashes to match `trailingSlash: 'never'`. */
export const mainNavigation: NavigationItem[] = [
  { href: '/guided-path', label: 'Guided Path' },
  {
    href: '/category',
    label: 'Categories',
    dropdown: {
      label: 'Browse Categories',
    },
  },
  { href: '/everything', label: 'Posts' },
  {
    href: '/tag',
    label: 'Resources',
    dropdown: {
      label: 'Tools & Resources',
      items: [
        {
          href: '/tag',
          label: 'All Tags',
          icon: '🏷️',
        },
        {
          href: '/writing-insights',
          label: 'Writing Insights',
          icon: '🧠',
        },
        {
          href: '/tag-management',
          label: 'Tag Analytics',
          icon: '🏷️',
        },
        {
          href: '/library/books',
          label: 'Book Library',
          icon: '📚',
        },
      ],
    },
  },
  { href: '/about', label: 'About' },
];
