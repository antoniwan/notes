import { getCollection } from 'astro:content';
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, getDay, getMonth } from 'date-fns';
import { getTagWeight, MASLOW_CATEGORIES } from '../../data/tags';
import type { CollectionEntry } from 'astro:content';
import { isCollectionPublic } from '../publishFilters';
import { countLexiconHits } from './textAnalysis';
import { EMOTIONAL_WORDS, GROWTH_KEYWORDS, GROWTH_TAGS } from './vocabulary';

export interface BaseMetrics {
  totalPosts: number;
  totalWords: number;
  averageWordsPerPost: number;
  firstPostDate: Date | undefined;
  lastPostDate: Date | undefined;
  daysSinceFirstPost: number;
  postsPerDay: number;
}

export interface TagFrequency {
  tag: string;
  count: number;
  weight: number;
}

export interface MonthlyPostData {
  month: string;
  label: string;
  count: number;
  date: Date;
}

export interface DayOfWeekStats {
  day: number;
  name: string;
  shortName: string;
  count: number;
  percentage: number;
}

export interface MonthOfYearStats {
  month: number;
  name: string;
  shortName: string;
  count: number;
  percentage: number;
}

export interface WritingStreak {
  length: number;
  days: number;
  startDate: Date;
  endDate: Date;
}

export interface DrySpell {
  days: number;
  startDate: Date;
  endDate: Date;
}

export interface StreakMetrics {
  currentStreak: number;
  longestStreak: number;
  streaks: WritingStreak[];
  drySpells: DrySpell[];
}

let brainSciencePostsPromise: Promise<CollectionEntry<'blog'>[]> | null = null;

/**
 * Get all published blog posts (memoized for the build process).
 * Brain Science pages share this result so the collection is walked once.
 */
export async function getBrainSciencePosts(): Promise<CollectionEntry<'blog'>[]> {
  if (!brainSciencePostsPromise) {
    brainSciencePostsPromise = getCollection('blog', ({ data }) => isCollectionPublic(data)).then(
      (posts) => posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()),
    );
  }
  return brainSciencePostsPromise;
}

/**
 * Calculate base metrics from posts
 */
export function calculateBaseMetrics(posts: CollectionEntry<'blog'>[]): BaseMetrics {
  const totalPosts = posts.length;
  const totalWords = posts.reduce((sum, post) => {
    const content = post.body;
    return sum + (content ? content.split(/\s+/).length : 0);
  }, 0);
  const averageWordsPerPost = totalPosts > 0 ? Math.round(totalWords / totalPosts) : 0;

  const sortedPosts = [...posts].sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );
  const firstPostDate = sortedPosts[sortedPosts.length - 1]?.data.pubDate;
  const lastPostDate = sortedPosts[0]?.data.pubDate;
  const daysSinceFirstPost = firstPostDate
    ? Math.floor((Date.now() - firstPostDate.getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  const postsPerDay =
    daysSinceFirstPost > 0 ? Number((totalPosts / daysSinceFirstPost).toFixed(2)) : 0;

  return {
    totalPosts,
    totalWords,
    averageWordsPerPost,
    firstPostDate,
    lastPostDate,
    daysSinceFirstPost,
    postsPerDay,
  };
}

/**
 * Calculate tag frequency
 */
export function calculateTagFrequency(
  posts: CollectionEntry<'blog'>[],
  limit?: number,
): TagFrequency[] {
  const tagFrequency = posts.reduce(
    (acc, post) => {
      post.data.tags?.forEach((tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    },
    {} as Record<string, number>,
  );

  const topTags = Object.entries(tagFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit || 10)
    .map(([tag, count]) => ({ tag, count, weight: getTagWeight(tag) }));

  return topTags;
}

/**
 * Calculate Maslow hierarchy analysis
 */
export function calculateMaslowAnalysis(posts: CollectionEntry<'blog'>[]): Array<{
  key: string;
  title: string;
  description: string;
  icon: string;
  color?: string;
  tags: string[];
  postCount: number;
  percentage: number;
}> {
  const totalPosts = posts.length;
  return MASLOW_CATEGORIES.map((category) => {
    const categoryPosts = posts.filter((post) =>
      post.data.tags?.some((tag) => category.tags.includes(tag)),
    ).length;
    return {
      ...category,
      postCount: categoryPosts,
      percentage: Math.round((categoryPosts / totalPosts) * 100),
    };
  }).filter((cat) => cat.postCount > 0);
}

/**
 * Calculate monthly posting frequency
 */
export function calculateMonthlyPosts(
  posts: CollectionEntry<'blog'>[],
  firstPostDate?: Date,
  lastPostDate?: Date,
): MonthlyPostData[] {
  if (!firstPostDate || !lastPostDate) {
    const sortedPosts = [...posts].sort(
      (a, b) => a.data.pubDate.valueOf() - b.data.pubDate.valueOf(),
    );
    firstPostDate = sortedPosts[0]?.data.pubDate;
    lastPostDate = sortedPosts[sortedPosts.length - 1]?.data.pubDate;
  }

  if (!firstPostDate || !lastPostDate) {
    return [];
  }

  return eachMonthOfInterval({
    start: firstPostDate,
    end: lastPostDate,
  }).map((month) => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    const postsInMonth = posts.filter(
      (post) => post.data.pubDate >= monthStart && post.data.pubDate <= monthEnd,
    ).length;
    return {
      month: format(month, 'yyyy-MM'),
      label: format(month, 'MMM yyyy'),
      count: postsInMonth,
      date: month,
    };
  });
}

/**
 * Calculate day of week statistics
 */
export function calculateDayOfWeekStats(posts: CollectionEntry<'blog'>[]): DayOfWeekStats[] {
  return [0, 1, 2, 3, 4, 5, 6].map((dayNum) => {
    const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][
      dayNum
    ];
    const postsOnDay = posts.filter((post) => getDay(post.data.pubDate) === dayNum).length;
    return {
      day: dayNum,
      name: dayName,
      shortName: dayName.slice(0, 3),
      count: postsOnDay,
      percentage: posts.length > 0 ? Math.round((postsOnDay / posts.length) * 100) : 0,
    };
  });
}

/**
 * Calculate month of year statistics
 */
export function calculateMonthOfYearStats(posts: CollectionEntry<'blog'>[]): MonthOfYearStats[] {
  return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((monthNum) => {
    const monthName = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ][monthNum];
    const postsInMonth = posts.filter((post) => getMonth(post.data.pubDate) === monthNum).length;
    return {
      month: monthNum,
      name: monthName,
      shortName: monthName.slice(0, 3),
      count: postsInMonth,
      percentage: posts.length > 0 ? Math.round((postsInMonth / posts.length) * 100) : 0,
    };
  });
}

/**
 * Calculate writing streaks and dry spells
 */
export function calculateStreakMetrics(posts: CollectionEntry<'blog'>[]): StreakMetrics {
  const sortedPosts = [...posts].sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );

  if (sortedPosts.length < 2) {
    return {
      currentStreak: sortedPosts.length,
      longestStreak: sortedPosts.length,
      streaks: [],
      drySpells: [],
    };
  }

  // Calculate current streak: count consecutive posts from the most recent one
  // that are within 7 days of each other
  let currentStreak = 1;
  for (let i = 0; i < sortedPosts.length - 1; i++) {
    const currentDate = sortedPosts[i].data.pubDate;
    const nextDate = sortedPosts[i + 1].data.pubDate;
    const daysDiff = Math.floor(
      (currentDate.getTime() - nextDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (daysDiff <= 7) {
      currentStreak++;
    } else {
      // Gap > 7 days, current streak ends here
      break;
    }
  }

  // Calculate all streaks and dry spells
  const streaks: WritingStreak[] = [];
  const drySpells: DrySpell[] = [];
  let streakLength = 1;
  let streakStart = sortedPosts[0].data.pubDate;
  let longestStreak = 1;

  for (let i = 0; i < sortedPosts.length - 1; i++) {
    const currentDate = sortedPosts[i].data.pubDate;
    const nextDate = sortedPosts[i + 1].data.pubDate;
    const daysDiff = Math.floor(
      (currentDate.getTime() - nextDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (daysDiff <= 7) {
      // Within streak
      streakLength++;
      longestStreak = Math.max(longestStreak, streakLength);
    } else {
      // Streak ended
      if (streakLength > 1) {
        streaks.push({
          length: streakLength,
          days: Math.floor((streakStart.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)),
          startDate: streakStart,
          endDate: currentDate,
        });
      }

      // Dry spell
      if (daysDiff > 7) {
        drySpells.push({
          days: daysDiff,
          startDate: nextDate,
          endDate: currentDate,
        });
      }

      streakLength = 1;
      streakStart = nextDate;
    }
  }

  // Handle final streak
  if (streakLength > 1) {
    streaks.push({
      length: streakLength,
      days: Math.floor(
        (streakStart.getTime() - sortedPosts[sortedPosts.length - 1].data.pubDate.getTime()) /
          (1000 * 60 * 60 * 24),
      ),
      startDate: streakStart,
      endDate: sortedPosts[sortedPosts.length - 1].data.pubDate,
    });
  }

  return {
    currentStreak,
    longestStreak,
    streaks: streaks.sort((a, b) => b.length - a.length),
    drySpells: drySpells.sort((a, b) => b.days - a.days),
  };
}

/**
 * Calculate current month posts
 */
export function calculateCurrentMonthPosts(posts: CollectionEntry<'blog'>[]): number {
  const now = new Date();
  return posts.filter((post) => {
    const postDate = post.data.pubDate;
    return postDate.getMonth() === now.getMonth() && postDate.getFullYear() === now.getFullYear();
  }).length;
}

/**
 * Calculate growth posts (posts focused on personal growth)
 */
export function calculateGrowthPosts(posts: CollectionEntry<'blog'>[]): number {
  return posts.filter((post) => {
    const tags = post.data.tags || [];
    const title = post.data.title.toLowerCase();
    const content = (post.body || '').toLowerCase();
    const haystack = `${title} ${content}`;

    const hasGrowthTags = GROWTH_TAGS.some((tag) => tags.includes(tag));
    const hasGrowthKeywords = countLexiconHits(haystack, GROWTH_KEYWORDS) > 0;

    return hasGrowthTags || hasGrowthKeywords;
  }).length;
}

/**
 * Calculate emotional posts (posts with high emotional intensity)
 */
export function calculateEmotionalPosts(
  posts: CollectionEntry<'blog'>[],
  threshold: number = 5,
): number {
  return posts.filter((post) => {
    const content = post.body || '';
    const exclamationCount = (content.match(/!/g) || []).length;
    const emotionalWordCount = countLexiconHits(content, EMOTIONAL_WORDS);

    return exclamationCount + emotionalWordCount > threshold;
  }).length;
}
