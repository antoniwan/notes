import { getCollection } from 'astro:content';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachMonthOfInterval,
  eachWeekOfInterval,
  getDay,
  getMonth,
} from 'date-fns';
import { getTagWeight, MASLOW_CATEGORIES } from '../../data/tags';
import { categories } from '../../data/categories';
import type { CollectionEntry } from 'astro:content';

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

export interface WeeklyPostData {
  week: string;
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

/**
 * Get all published blog posts
 */
export async function getBrainSciencePosts(): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getCollection('blog', ({ data }) => {
    return import.meta.env.PROD ? !data.draft && data.published !== false : true;
  });
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
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
 * Calculate category frequency
 */
export function calculateCategoryFrequency(
  posts: CollectionEntry<'blog'>[],
): Array<{ id: string; name: string; count: number; percentage: number }> {
  const categoryFrequency = posts.reduce(
    (acc, post) => {
      post.data.category?.forEach((cat) => {
        acc[cat] = (acc[cat] || 0) + 1;
      });
      return acc;
    },
    {} as Record<string, number>,
  );

  return categories
    .map((category) => ({
      id: category.id,
      name: category.name,
      count: categoryFrequency[category.id] || 0,
      percentage: Math.round(((categoryFrequency[category.id] || 0) / posts.length) * 100),
    }))
    .filter((cat) => cat.count > 0);
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
 * Calculate weekly posting frequency
 */
export function calculateWeeklyPosts(
  posts: CollectionEntry<'blog'>[],
  firstPostDate?: Date,
  lastPostDate?: Date,
): WeeklyPostData[] {
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

  return eachWeekOfInterval({
    start: firstPostDate,
    end: lastPostDate,
  }).map((week) => {
    const weekStart = week;
    const weekEnd = new Date(week.getTime() + 6 * 24 * 60 * 60 * 1000);
    const postsInWeek = posts.filter(
      (post) => post.data.pubDate >= weekStart && post.data.pubDate <= weekEnd,
    ).length;
    return {
      week: format(week, 'yyyy-MM-dd'),
      label: format(week, 'MMM d'),
      count: postsInWeek,
      date: week,
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
  const growthTags = [
    'personal-growth',
    'transformation',
    'healing',
    'self-improvement',
    'learning',
    'consciousness',
  ];
  const growthKeywords = [
    'growth',
    'change',
    'transform',
    'learn',
    'evolve',
    'improve',
    'heal',
    'discover',
  ];

  return posts.filter((post) => {
    const tags = post.data.tags || [];
    const title = post.data.title.toLowerCase();
    const content = (post.body || '').toLowerCase();

    const hasGrowthTags = growthTags.some((tag) => tags.includes(tag));
    const hasGrowthKeywords = growthKeywords.some(
      (keyword) => title.includes(keyword) || content.includes(keyword),
    );

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
  const emotionalWords = [
    'love',
    'hate',
    'fear',
    'joy',
    'sadness',
    'anger',
    'peace',
    'anxiety',
    'hope',
    'despair',
    'gratitude',
    'frustration',
  ];

  return posts.filter((post) => {
    const content = post.body || '';
    const exclamationCount = (content.match(/!/g) || []).length;
    const emotionalWordCount = emotionalWords.reduce((count, word) => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      return count + (content.match(regex) || []).length;
    }, 0);

    return exclamationCount + emotionalWordCount > threshold;
  }).length;
}

/**
 * Prepare time series data for charts
 */
export function prepareTimeSeriesData(
  posts: CollectionEntry<'blog'>[],
  interval: 'month' | 'quarter' | 'year',
  metricFn: (post: CollectionEntry<'blog'>) => number,
): Array<{ label: string; date: Date; value: number }> {
  if (posts.length === 0) return [];

  const sortedPosts = [...posts].sort(
    (a, b) => a.data.pubDate.valueOf() - b.data.pubDate.valueOf(),
  );
  const firstDate = sortedPosts[0].data.pubDate;
  const lastDate = sortedPosts[sortedPosts.length - 1].data.pubDate;

  const intervals: Date[] = [];
  let currentDate = new Date(firstDate);

  while (currentDate <= lastDate) {
    intervals.push(new Date(currentDate));

    if (interval === 'month') {
      currentDate.setMonth(currentDate.getMonth() + 1);
    } else if (interval === 'quarter') {
      currentDate.setMonth(currentDate.getMonth() + 3);
    } else {
      currentDate.setFullYear(currentDate.getFullYear() + 1);
    }
  }

  return intervals.map((intervalDate) => {
    const intervalStart = new Date(intervalDate);
    const intervalEnd = new Date(intervalDate);

    if (interval === 'month') {
      intervalEnd.setMonth(intervalEnd.getMonth() + 1);
    } else if (interval === 'quarter') {
      intervalEnd.setMonth(intervalEnd.getMonth() + 3);
    } else {
      intervalEnd.setFullYear(intervalEnd.getFullYear() + 1);
    }

    const postsInInterval = sortedPosts.filter(
      (post) => post.data.pubDate >= intervalStart && post.data.pubDate < intervalEnd,
    );

    const value =
      postsInInterval.length > 0
        ? postsInInterval.reduce((sum, post) => sum + metricFn(post), 0) / postsInInterval.length
        : 0;

    let label: string;
    if (interval === 'month') {
      label = format(intervalDate, 'MMM yyyy');
    } else if (interval === 'quarter') {
      const quarter = Math.floor(intervalDate.getMonth() / 3) + 1;
      label = `Q${quarter} ${intervalDate.getFullYear()}`;
    } else {
      label = intervalDate.getFullYear().toString();
    }

    return { label, date: intervalDate, value: Math.round(value * 100) / 100 };
  });
}

/**
 * Calculate correlation between two metrics
 */
export function calculateCorrelation(
  posts: CollectionEntry<'blog'>[],
  metric1Fn: (post: CollectionEntry<'blog'>) => number,
  metric2Fn: (post: CollectionEntry<'blog'>) => number,
): number {
  if (posts.length < 2) return 0;

  const values1 = posts.map(metric1Fn);
  const values2 = posts.map(metric2Fn);

  const mean1 = values1.reduce((sum, val) => sum + val, 0) / values1.length;
  const mean2 = values2.reduce((sum, val) => sum + val, 0) / values2.length;

  let numerator = 0;
  let sumSq1 = 0;
  let sumSq2 = 0;

  for (let i = 0; i < values1.length; i++) {
    const diff1 = values1[i] - mean1;
    const diff2 = values2[i] - mean2;
    numerator += diff1 * diff2;
    sumSq1 += diff1 * diff1;
    sumSq2 += diff2 * diff2;
  }

  const denominator = Math.sqrt(sumSq1 * sumSq2);
  return denominator === 0 ? 0 : numerator / denominator;
}
