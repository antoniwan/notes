import type { CollectionEntry } from 'astro:content';
import { BRAIN_SCIENCE_CONFIG } from '../../data/brainScience';

const config = BRAIN_SCIENCE_CONFIG;

/**
 * Updated and expanded sentiment word lists
 */
export const SENTIMENT_WORDS = {
  positive: [
    'love',
    'joy',
    'excited',
    'happy',
    'grateful',
    'inspired',
    'confident',
    'proud',
    'accomplished',
    'fulfilled',
    'peaceful',
    'content',
    'optimistic',
    'hopeful',
    'energized',
    'motivated',
    'successful',
    'achieved',
    'breakthrough',
    'transformation',
    'growth',
    'improvement',
    'better',
    'stronger',
    'wiser',
    'appreciate',
    'celebrate',
    'thrilled',
    'delighted',
    'blessed',
    'empowered',
    'liberated',
    'triumphant',
    'victorious',
    'radiant',
    'blissful',
    'euphoric',
    'serene',
    'tranquil',
    'harmonious',
  ],
  negative: [
    'hate',
    'fear',
    'sadness',
    'anger',
    'anxiety',
    'despair',
    'frustration',
    'worried',
    'confused',
    'overwhelmed',
    'restless',
    'pain',
    'hurt',
    'broken',
    'struggle',
    'difficult',
    'challenge',
    'failure',
    'disappointed',
    'defeated',
    'hopeless',
    'lost',
    'stuck',
    'trapped',
    'suffering',
    'dread',
    'terror',
    'panic',
    'distress',
    'agony',
    'torment',
    'misery',
    'anguish',
    'grief',
    'sorrow',
    'regret',
    'shame',
    'guilt',
    'humiliation',
    'isolation',
  ],
  neutral: [
    'think',
    'believe',
    'understand',
    'realize',
    'observe',
    'notice',
    'consider',
    'reflect',
    'analyze',
    'examine',
    'study',
    'learn',
    'discover',
    'explore',
    'investigate',
    'research',
    'find',
    'determine',
    'conclude',
    'decide',
    'evaluate',
    'assess',
    'review',
    'document',
    'record',
    'note',
    'acknowledge',
    'recognize',
    'identify',
    'describe',
    'explain',
    'clarify',
    'define',
    'categorize',
    'classify',
  ],
};

/**
 * Calculate sentiment analysis for posts
 */
export function calculateSentiment(posts: CollectionEntry<'blog'>[]): {
  positive: number;
  negative: number;
  neutral: number;
  mixed: number;
} {
  const sentimentAnalysis = {
    positive: 0,
    negative: 0,
    neutral: 0,
    mixed: 0,
  };

  posts.forEach((post) => {
    const content = ((post.body || '') + ' ' + (post.data.title || '')).toLowerCase();

    const positiveCount = SENTIMENT_WORDS.positive.reduce((count, word) => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      return count + (content.match(regex) || []).length;
    }, 0);

    const negativeCount = SENTIMENT_WORDS.negative.reduce((count, word) => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      return count + (content.match(regex) || []).length;
    }, 0);

    const neutralCount = SENTIMENT_WORDS.neutral.reduce((count, word) => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      return count + (content.match(regex) || []).length;
    }, 0);

    // Determine sentiment based on word frequency
    if (positiveCount > negativeCount && positiveCount > neutralCount) {
      sentimentAnalysis.positive++;
    } else if (negativeCount > positiveCount && negativeCount > neutralCount) {
      sentimentAnalysis.negative++;
    } else if (neutralCount > positiveCount && neutralCount > negativeCount) {
      sentimentAnalysis.neutral++;
    } else {
      sentimentAnalysis.mixed++;
    }
  });

  return sentimentAnalysis;
}

/**
 * Calculate posting regularity score (0-100)
 */
export function calculatePostingRegularity(posts: CollectionEntry<'blog'>[]): number {
  if (posts.length < 2) return 100;

  const sortedPosts = [...posts].sort(
    (a, b) => a.data.pubDate.valueOf() - b.data.pubDate.valueOf(),
  );
  const intervals: number[] = [];

  for (let i = 1; i < sortedPosts.length; i++) {
    const daysDiff = Math.floor(
      (sortedPosts[i].data.pubDate.getTime() - sortedPosts[i - 1].data.pubDate.getTime()) /
        (1000 * 60 * 60 * 24),
    );
    intervals.push(daysDiff);
  }

  const avgInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
  const variance =
    intervals.reduce((sum, interval) => sum + Math.pow(interval - avgInterval, 2), 0) /
    intervals.length;

  // Lower variance = higher consistency
  // Normalize to 0-100 scale
  const consistency = Math.max(0, 100 - variance / 10);
  return Math.round(consistency);
}

/**
 * Calculate topic consistency score (0-100)
 */
export function calculateTopicConsistency(posts: CollectionEntry<'blog'>[]): number {
  if (posts.length === 0) return 0;

  const tagFrequency = posts.reduce(
    (acc, post) => {
      post.data.tags?.forEach((tag: string) => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    },
    {} as Record<string, number>,
  );

  const topTagCount = Math.max(...Object.values(tagFrequency).map((val) => val as number), 0);
  const totalPosts = posts.length;
  return Math.round((topTagCount / totalPosts) * 100);
}

/**
 * Calculate quality variance score (0-100, lower = more consistent)
 */
export function calculateQualityVariance(posts: CollectionEntry<'blog'>[]): number {
  if (posts.length === 0) return 0;

  const wordCounts = posts.map((post) => {
    const content = post.body || '';
    return content.split(/\s+/).length;
  });

  const avgWordCount = wordCounts.reduce((sum, count) => sum + count, 0) / wordCounts.length;
  const variance =
    wordCounts.reduce((sum, count) => sum + Math.pow(count - avgWordCount, 2), 0) /
    wordCounts.length;

  // Normalize variance to 0-100 scale
  const normalizedVariance = Math.min(100, Math.round(variance / 10));
  return normalizedVariance;
}

/**
 * Calculate challenge areas based on configurable thresholds
 */
export function calculateChallengeAreas(
  postingRegularity: number,
  qualityVariance: number,
  sentimentAnalysis: { positive: number; negative: number; neutral: number; mixed: number },
  topicConsistency: number,
): Array<{ area: string; frequency: number; severity: 'high' | 'medium' | 'low' }> {
  const challengeAreas: Array<{
    area: string;
    frequency: number;
    severity: 'high' | 'medium' | 'low';
  }> = [];

  const thresholds = config.thresholds.challengeSeverity;

  // Posting inconsistency
  if (postingRegularity < thresholds.medium.postingRegularity) {
    challengeAreas.push({
      area: 'Posting Inconsistency',
      frequency: Math.round(100 - postingRegularity),
      severity:
        postingRegularity < thresholds.high.postingRegularity
          ? 'high'
          : postingRegularity < thresholds.medium.postingRegularity
            ? 'medium'
            : 'low',
    });
  }

  // Quality variance
  if (qualityVariance > thresholds.medium.qualityVariance) {
    challengeAreas.push({
      area: 'Content Quality Variance',
      frequency: qualityVariance,
      severity:
        qualityVariance > thresholds.high.qualityVariance
          ? 'high'
          : qualityVariance > thresholds.medium.qualityVariance
            ? 'medium'
            : 'low',
    });
  }

  // Emotional imbalance
  const totalSentiment =
    sentimentAnalysis.positive +
    sentimentAnalysis.negative +
    sentimentAnalysis.neutral +
    sentimentAnalysis.mixed;
  if (totalSentiment > 0) {
    const negativeRatio = sentimentAnalysis.negative / totalSentiment;
    if (negativeRatio > thresholds.medium.negativeSentiment) {
      challengeAreas.push({
        area: 'High Negative Sentiment',
        frequency: Math.round(negativeRatio * 100),
        severity:
          negativeRatio > thresholds.high.negativeSentiment
            ? 'high'
            : negativeRatio > thresholds.medium.negativeSentiment
              ? 'medium'
              : 'low',
      });
    }
  }

  // Topic over-focus
  if (topicConsistency > thresholds.medium.topicFocus) {
    challengeAreas.push({
      area: 'Over-focus on Single Topic',
      frequency: topicConsistency,
      severity:
        topicConsistency > thresholds.high.topicFocus
          ? 'high'
          : topicConsistency > thresholds.medium.topicFocus
            ? 'medium'
            : 'low',
    });
  }

  return challengeAreas;
}

/**
 * Calculate improvement areas based on configurable targets
 */
export function calculateImprovementAreas(
  posts: CollectionEntry<'blog'>[],
  firstPostDate?: Date,
  lastPostDate?: Date,
): Array<{ area: string; current: number; target: number; gap: number }> {
  const improvementAreas: Array<{ area: string; current: number; target: number; gap: number }> =
    [];
  const targets = config.improvementTargets;

  if (posts.length === 0) return improvementAreas;

  // Posting frequency improvement
  if (firstPostDate && lastPostDate) {
    const monthsSinceFirst =
      (lastPostDate.getTime() - firstPostDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
    const currentPostsPerMonth = monthsSinceFirst > 0 ? posts.length / monthsSinceFirst : 0;
    improvementAreas.push({
      area: 'Monthly Posting Rate',
      current: Math.round(currentPostsPerMonth * 10) / 10,
      target: targets.monthlyPostingRate,
      gap: Math.max(0, targets.monthlyPostingRate - currentPostsPerMonth),
    });
  }

  // Content depth improvement
  const wordCounts = posts.map((post) => {
    const content = post.body || '';
    return content.split(/\s+/).length;
  });
  const avgWordsPerPost = wordCounts.reduce((sum, count) => sum + count, 0) / wordCounts.length;
  improvementAreas.push({
    area: 'Average Post Length',
    current: Math.round(avgWordsPerPost),
    target: targets.averagePostLength,
    gap: Math.max(0, targets.averagePostLength - avgWordsPerPost),
  });

  // Topic diversity improvement
  const tagFrequency = posts.reduce(
    (acc, post) => {
      post.data.tags?.forEach((tag: string) => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    },
    {} as Record<string, number>,
  );
  const uniqueTags = Object.keys(tagFrequency).length;
  improvementAreas.push({
    area: 'Topic Diversity',
    current: uniqueTags,
    target: targets.topicDiversity,
    gap: Math.max(0, targets.topicDiversity - uniqueTags),
  });

  // Sentiment balance improvement
  const sentimentAnalysis = calculateSentiment(posts);
  const totalSentiment =
    sentimentAnalysis.positive +
    sentimentAnalysis.negative +
    sentimentAnalysis.neutral +
    sentimentAnalysis.mixed;
  if (totalSentiment > 0) {
    const neutralRatio = sentimentAnalysis.neutral / totalSentiment;
    improvementAreas.push({
      area: 'Balanced Sentiment',
      current: Math.round(neutralRatio * 100),
      target: targets.balancedSentiment,
      gap: Math.max(0, targets.balancedSentiment - neutralRatio * 100),
    });
  }

  return improvementAreas;
}

/**
 * Get sentiment thresholds from config
 */
export function getSentimentThresholds() {
  return config.thresholds.sentimentThresholds;
}

/**
 * Get improvement targets from config
 */
export function getImprovementTargets() {
  return config.improvementTargets;
}
