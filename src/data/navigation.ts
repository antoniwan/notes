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
  {
    href: '/tag',
    label: 'Resources',
    dropdown: {
      label: 'Tools & Resources',
      items: [
        {
          href: '/everything',
          label: 'Everything',
          icon: '📝',
        },
        {
          href: '/tag',
          label: 'Tags',
          icon: '🏷️',
        },
        {
          href: '/writing-insights',
          label: 'Writing Insights',
          icon: '🧠',
        },
        {
          href: '/library/books',
          label: 'Book Library',
          icon: '📚',
        },
        {
          href: '/recipes',
          label: 'Cookbook',
          icon: '📖',
        },
      ],
    },
  },
  { href: '/about', label: 'About' },
];
