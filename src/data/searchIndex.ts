import { getCollection } from 'astro:content';
import { categories } from './categories';
import { getTagMetadata } from './tags';
import { calculateTagStats } from '../utils/tagProcessing';

/** Static list of pages for search (no blog fetch needed). */
const PAGE_SEARCH_DATA = [
  { type: 'page', id: 'about', title: 'About', description: 'Learn more about the author and this site', url: '/about/' },
  { type: 'page', id: 'brain-science', title: 'Brain Science', description: 'Analytics and insights about writing patterns, themes, and growth', url: '/brain-science/' },
  { type: 'page', id: 'brain-science-topics', title: 'Brain Science - Topics', description: 'Analysis of topics and themes across all writings', url: '/brain-science/topics/' },
  { type: 'page', id: 'brain-science-patterns', title: 'Brain Science - Patterns', description: 'Writing patterns and frequency analysis', url: '/brain-science/patterns/' },
  { type: 'page', id: 'brain-science-evolution', title: 'Brain Science - Evolution', description: 'How writing and thinking has evolved over time', url: '/brain-science/evolution/' },
  { type: 'page', id: 'brain-science-insights', title: 'Brain Science - Insights', description: 'Key insights and discoveries from the writing journey', url: '/brain-science/insights/' },
  { type: 'page', id: 'brain-science-cadence', title: 'Brain Science - Cadence', description: 'Writing rhythm and consistency analysis', url: '/brain-science/cadence/' },
  { type: 'page', id: 'brain-science-meta', title: 'Brain Science - Meta', description: 'Meta-analysis of the site and its impact', url: '/brain-science/meta/' },
  { type: 'page', id: 'tag-management', title: 'Tag Management', description: 'Organize and manage tags across all writings', url: '/tag-management/' },
];

/**
 * Build search index data once at build time. Call from a layout (e.g. BaseLayout)
 * and pass the result to Header/SearchBar so the collection is not fetched per component.
 */
export async function getSearchData() {
  const posts = await getCollection('blog', ({ data }) => {
    return import.meta.env.PROD ? !data.draft : true;
  });

  const postSearchData = posts.map((post) => ({
    type: 'post',
    slug: post.id,
    title: post.data.title,
    description: post.data.description,
    category: post.data.category,
    tags: post.data.tags,
    heroImage: post.data.heroImage,
    url: `/p/${post.id}/`,
    author: post.data.author,
    keywords: post.data.keywords,
    language: post.data.language,
  }));

  const categorySearchData = categories.map((category) => ({
    type: 'category',
    id: category.id,
    title: category.name,
    description: category.description,
    url: `/category/${category.id}/`,
    icon: category.icon,
  }));

  const { tagCounts } = calculateTagStats(posts);
  const tagSearchData = Object.entries(tagCounts).map(([tag, count]) => {
    const metadata = getTagMetadata(tag);
    return {
      type: 'tag',
      id: tag,
      title: tag.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
      description:
        metadata?.description || `${count} writing${count !== 1 ? 's' : ''} tagged with "${tag}"`,
      url: `/tag/${tag}/`,
      weight: metadata?.weight || 1,
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
