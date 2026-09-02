import { getCollection } from 'astro:content';
import { categories } from './categories';
import { getTagMetadata } from './tags';
import { calculateTagStats } from '../utils/tagProcessing';
import { isCollectionListed } from '../utils/publishFilters';

/** Static list of pages for search (public reader surfaces only). */
const PAGE_SEARCH_DATA = [
  {
    type: 'page',
    id: 'about',
    title: 'About',
    description: 'Learn more about the author and this site',
    url: '/about',
  },
  {
    type: 'page',
    id: 'library',
    title: 'Library',
    description: 'Books on the shelf that shape these notes',
    url: '/library',
  },
  {
    type: 'page',
    id: 'everything',
    title: 'Everything',
    description: 'Full archive of all notes',
    url: '/everything',
  },
  {
    type: 'page',
    id: 'guided-path',
    title: 'Guided Path',
    description: 'Seasonal reading order through the notes',
    url: '/guided-path',
  },
];

/**
 * Build search index data once at build time. Call from a layout (e.g. BaseLayout)
 * and pass the result to Header/SearchBar so the collection is not fetched per component.
 * Result is memoized for the Node build process (BaseLayout runs on every page).
 */
let searchDataPromise: Promise<unknown[]> | null = null;

export async function getSearchData() {
  if (!searchDataPromise) {
    searchDataPromise = buildSearchData();
  }
  return searchDataPromise;
}

async function buildSearchData() {
  const posts = await getCollection('blog', ({ data }) => isCollectionListed(data));

  const postSearchData = posts.map((post) => ({
    type: 'post',
    slug: post.id,
    title: post.data.title,
    description: post.data.description,
    category: post.data.category,
    tags: post.data.tags,
    heroImage: post.data.heroImage,
    url: `/p/${post.id}`,
    author: post.data.author,
    keywords: post.data.keywords,
    language: post.data.language,
  }));

  const categorySearchData = categories.map((category) => ({
    type: 'category',
    id: category.id,
    title: category.name,
    description: category.description,
    url: `/category/${category.id}`,
    icon: category.icon,
  }));

  const { tagCounts } = calculateTagStats(posts);
  const tagSearchData = Object.entries(tagCounts).map(([tag, count]) => {
    const metadata = getTagMetadata(tag);
    return {
      type: 'tag',
      id: tag,
      title: metadata.name,
      description:
        metadata.description || `${count} writing${count !== 1 ? 's' : ''} tagged with "${tag}"`,
      url: `/tag/${tag}`,
      weight: metadata.weight,
      count,
    };
  });

  const quoteSearchData: unknown[] = [];

  return [
    ...postSearchData,
    ...quoteSearchData,
    ...categorySearchData,
    ...tagSearchData,
    ...PAGE_SEARCH_DATA,
  ];
}
