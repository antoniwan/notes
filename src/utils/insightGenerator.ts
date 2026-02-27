import {
  calculateSentiment,
  calculatePostingRegularity,
  calculateTopicConsistency,
  calculateQualityVariance,
  calculateChallengeAreas,
  calculateImprovementAreas,
} from './brainScience/metrics';
import type { CollectionEntry } from 'astro:content';

export interface InsightData {
  totalPosts: number;
  totalWords: number;
  avgWordsPerPost: number;
  topTags: Array<{ tag: string; count: number }>;
  emotionalPosts: number;
  growthPosts: number;
  complexityTrend: 'increasing' | 'decreasing' | 'stable';
  productivityTrend: 'improving' | 'declining' | 'stable';
  knowledgeAreas: Array<{
    title: string;
    postCount: number;
    trend: 'growing' | 'declining' | 'stable';
  }>;
  writingStreaks: Array<{ length: number; days: number }>;
  drySpells: Array<{ days: number }>;
  // New objective metrics
  sentimentAnalysis: {
    positive: number;
    negative: number;
    neutral: number;
    mixed: number;
  };
  consistencyMetrics: {
    postingRegularity: number; // 0-100 score
    topicConsistency: number; // 0-100 score
    qualityVariance: number; // 0-100 score
  };
  challengeAreas: Array<{ area: string; frequency: number; severity: 'high' | 'medium' | 'low' }>;
  improvementAreas: Array<{ area: string; current: number; target: number; gap: number }>;
}

export interface DynamicInsight {
  type: 'positive' | 'negative' | 'neutral' | 'warning' | 'objective';
  text: string;
  color: string;
  weight: number; // 1-5 scale for importance
  category:
    | 'sentiment'
    | 'consistency'
    | 'productivity'
    | 'quality'
    | 'challenges'
    | 'growth'
    | 'neutral';
}

export function generateDynamicInsights(
  data: InsightData,
  pageType: string,
): {
  insights: DynamicInsight[];
  summary: string;
  balancedAnalysis: {
    strengths: DynamicInsight[];
    challenges: DynamicInsight[];
    neutral: DynamicInsight[];
  };
} {
  const insights: DynamicInsight[] = [];

  // Generate objective sentiment analysis
  const totalSentimentPosts =
    data.sentimentAnalysis.positive +
    data.sentimentAnalysis.negative +
    data.sentimentAnalysis.neutral +
    data.sentimentAnalysis.mixed;
  if (totalSentimentPosts > 0) {
    const positiveRatio = data.sentimentAnalysis.positive / totalSentimentPosts;
    const negativeRatio = data.sentimentAnalysis.negative / totalSentimentPosts;
    const neutralRatio = data.sentimentAnalysis.neutral / totalSentimentPosts;

    insights.push({
      type: 'objective',
      text: `Sentiment distribution: <span class="font-semibold">${Math.round(positiveRatio * 100)}% positive</span>, <span class="font-semibold">${Math.round(negativeRatio * 100)}% negative</span>, <span class="font-semibold">${Math.round(neutralRatio * 100)}% neutral</span>`,
      color: 'text-gray-500',
      weight: 4,
      category: 'sentiment',
    });

    // Add sentiment insights without bias
    if (negativeRatio > 0.4) {
      insights.push({
        type: 'negative',
        text: `High negative sentiment: <span class="font-semibold">${Math.round(negativeRatio * 100)}%</span> of posts contain negative emotional content`,
        color: 'text-red-500',
        weight: 4,
        category: 'sentiment',
      });
    }

    if (positiveRatio > 0.4) {
      insights.push({
        type: 'positive',
        text: `High positive sentiment: <span class="font-semibold">${Math.round(positiveRatio * 100)}%</span> of posts contain positive emotional content`,
        color: 'text-green-500',
        weight: 3,
        category: 'sentiment',
      });
    }

    if (neutralRatio > 0.5) {
      insights.push({
        type: 'neutral',
        text: `Balanced emotional expression: <span class="font-semibold">${Math.round(neutralRatio * 100)}%</span> of posts maintain neutral tone`,
        color: 'text-blue-500',
        weight: 3,
        category: 'sentiment',
      });
    }
  }

  // Consistency analysis (objective)
  insights.push({
    type: 'objective',
    text: `Posting regularity: <span class="font-semibold">${data.consistencyMetrics.postingRegularity}/100</span> (higher = more consistent)`,
    color: 'text-gray-500',
    weight: 3,
    category: 'consistency',
  });

  insights.push({
    type: 'objective',
    text: `Topic consistency: <span class="font-semibold">${data.consistencyMetrics.topicConsistency}/100</span> (higher = more focused)`,
    color: 'text-gray-500',
    weight: 3,
    category: 'consistency',
  });

  insights.push({
    type: 'objective',
    text: `Quality variance: <span class="font-semibold">${data.consistencyMetrics.qualityVariance}/100</span> (lower = more consistent quality)`,
    color: 'text-gray-500',
    weight: 3,
    category: 'quality',
  });

  // Challenge areas (always shown, not hidden)
  data.challengeAreas.forEach((challenge) => {
    insights.push({
      type:
        challenge.severity === 'high'
          ? 'negative'
          : challenge.severity === 'medium'
            ? 'warning'
            : 'neutral',
      text: `Challenge area: <span class="font-semibold">${challenge.area}</span> (${challenge.frequency} occurrences, ${challenge.severity} impact)`,
      color:
        challenge.severity === 'high'
          ? 'text-red-500'
          : challenge.severity === 'medium'
            ? 'text-yellow-500'
            : 'text-blue-500',
      weight: challenge.severity === 'high' ? 5 : challenge.severity === 'medium' ? 4 : 3,
      category: 'challenges',
    });
  });

  // Improvement areas (objective gaps)
  data.improvementAreas.forEach((improvement) => {
    const gapPercentage = Math.round((improvement.gap / improvement.target) * 100);
    insights.push({
      type: gapPercentage > 50 ? 'negative' : gapPercentage > 25 ? 'warning' : 'neutral',
      text: `Improvement needed: <span class="font-semibold">${improvement.area}</span> (${improvement.current}/${improvement.target}, ${gapPercentage}% gap)`,
      color:
        gapPercentage > 50
          ? 'text-red-500'
          : gapPercentage > 25
            ? 'text-yellow-500'
            : 'text-blue-500',
      weight: gapPercentage > 50 ? 5 : gapPercentage > 25 ? 4 : 3,
      category: 'growth',
    });
  });

  // Generate insights based on page type and data
  switch (pageType) {
    case 'cadence':
      // Objective productivity metrics
      if (data.writingStreaks.length > 0) {
        const avgStreakLength = Math.round(
          data.writingStreaks.reduce((sum, streak) => sum + streak.length, 0) /
            data.writingStreaks.length,
        );
        insights.push({
          type: 'objective',
          text: `Average writing streak: <span class="font-semibold">${avgStreakLength} posts</span>`,
          color: 'text-gray-500',
          weight: 3,
          category: 'productivity',
        });
      }

      // Dry spells (shown as challenges, not hidden)
      if (data.drySpells.length > 0) {
        const longestDrySpell = Math.max(...data.drySpells.map((spell) => spell.days));
        const avgDrySpell = Math.round(
          data.drySpells.reduce((sum, spell) => sum + spell.days, 0) / data.drySpells.length,
        );

        insights.push({
          type: longestDrySpell > 60 ? 'negative' : longestDrySpell > 30 ? 'warning' : 'neutral',
          text: `Longest dry spell: <span class="font-semibold">${longestDrySpell} days</span> without posting`,
          color:
            longestDrySpell > 60
              ? 'text-red-500'
              : longestDrySpell > 30
                ? 'text-yellow-500'
                : 'text-blue-500',
          weight: 4,
          category: 'challenges',
        });

        insights.push({
          type: 'objective',
          text: `Average dry spell: <span class="font-semibold">${avgDrySpell} days</span>`,
          color: 'text-gray-500',
          weight: 3,
          category: 'productivity',
        });
      }

      // Productivity trend (objective)
      insights.push({
        type: 'objective',
        text: `Productivity trend: <span class="font-semibold">${data.productivityTrend}</span>`,
        color: 'text-gray-500',
        weight: 4,
        category: 'productivity',
      });

      // Consistency analysis (objective)
      const consistencyScore =
        data.writingStreaks.length / (data.writingStreaks.length + data.drySpells.length);
      insights.push({
        type: 'objective',
        text: `Writing consistency ratio: <span class="font-semibold">${Math.round(consistencyScore * 100)}%</span> (streaks vs dry spells)`,
        color: 'text-gray-500',
        weight: 3,
        category: 'consistency',
      });
      break;

    case 'evolution':
      // Complexity trend (objective)
      insights.push({
        type: 'objective',
        text: `Writing complexity trend: <span class="font-semibold">${data.complexityTrend}</span>`,
        color: 'text-gray-500',
        weight: 4,
        category: 'quality',
      });

      // Content depth (objective)
      insights.push({
        type: 'objective',
        text: `Average content depth: <span class="font-semibold">${data.avgWordsPerPost} words</span> per post`,
        color: 'text-gray-500',
        weight: 3,
        category: 'quality',
      });

      // Topic diversity (objective)
      insights.push({
        type: 'objective',
        text: `Topic diversity: <span class="font-semibold">${data.topTags.length} distinct areas</span>`,
        color: 'text-gray-500',
        weight: 2,
        category: 'neutral',
      });
      break;

    case 'topics':
      const growingAreas = data.knowledgeAreas.filter((area) => area.trend === 'growing').length;
      const decliningAreas = data.knowledgeAreas.filter(
        (area) => area.trend === 'declining',
      ).length;
      const stableAreas = data.knowledgeAreas.filter((area) => area.trend === 'stable').length;

      // Growth vs decline (objective)
      insights.push({
        type: 'objective',
        text: `Topic trends: <span class="font-semibold">${growingAreas} growing</span>, <span class="font-semibold">${decliningAreas} declining</span>, <span class="font-semibold">${stableAreas} stable</span>`,
        color: 'text-gray-500',
        weight: 4,
        category: 'neutral',
      });

      // Focus concentration (objective)
      const topTagPercentage = data.topTags[0]
        ? (data.topTags[0].count / data.totalPosts) * 100
        : 0;
      insights.push({
        type: 'objective',
        text: `Top topic concentration: <span class="font-semibold">${Math.round(topTagPercentage)}%</span> on "${data.topTags[0]?.tag}"`,
        color: 'text-gray-500',
        weight: 3,
        category: 'neutral',
      });

      // Topic balance (objective)
      const balanceScore = stableAreas / data.knowledgeAreas.length;
      insights.push({
        type: 'objective',
        text: `Topic stability: <span class="font-semibold">${Math.round(balanceScore * 100)}%</span> of areas are stable`,
        color: 'text-gray-500',
        weight: 2,
        category: 'neutral',
      });
      break;

    case 'insights':
      // Emotional expression (objective)
      const emotionalRatio = data.emotionalPosts / data.totalPosts;
      insights.push({
        type: 'objective',
        text: `Emotional expression: <span class="font-semibold">${Math.round(emotionalRatio * 100)}%</span> of posts are emotionally intense`,
        color: 'text-gray-500',
        weight: 3,
        category: 'sentiment',
      });

      // Growth focus (objective)
      const growthRatio = data.growthPosts / data.totalPosts;
      insights.push({
        type: 'objective',
        text: `Growth focus: <span class="font-semibold">${Math.round(growthRatio * 100)}%</span> of posts are growth-oriented`,
        color: 'text-gray-500',
        weight: 4,
        category: 'growth',
      });

      // Content volume (objective)
      insights.push({
        type: 'objective',
        text: `Content volume: <span class="font-semibold">${data.totalWords.toLocaleString()} words</span> total`,
        color: 'text-gray-500',
        weight: 2,
        category: 'neutral',
      });
      break;

    case 'patterns':
      // Streak analysis (objective)
      if (data.writingStreaks.length > 0) {
        const avgStreakLength = Math.round(
          data.writingStreaks.reduce((sum, streak) => sum + streak.length, 0) /
            data.writingStreaks.length,
        );
        insights.push({
          type: 'objective',
          text: `Average creative burst: <span class="font-semibold">${avgStreakLength} posts</span> per streak`,
          color: 'text-gray-500',
          weight: 3,
          category: 'productivity',
        });
      }

      // Dry spell analysis (objective)
      if (data.drySpells.length > 0) {
        const avgDrySpell = Math.round(
          data.drySpells.reduce((sum, spell) => sum + spell.days, 0) / data.drySpells.length,
        );
        insights.push({
          type: 'objective',
          text: `Average recovery time: <span class="font-semibold">${avgDrySpell} days</span> between creative bursts`,
          color: 'text-gray-500',
          weight: 4,
          category: 'productivity',
        });
      }

      // Pattern consistency (objective)
      const patternConsistency =
        data.writingStreaks.length / (data.writingStreaks.length + data.drySpells.length);
      insights.push({
        type: 'objective',
        text: `Pattern consistency: <span class="font-semibold">${Math.round(patternConsistency * 100)}%</span> predictable cycles`,
        color: 'text-gray-500',
        weight: 3,
        category: 'consistency',
      });
      break;

    case 'meta':
      // Content depth (objective)
      insights.push({
        type: 'objective',
        text: `Content depth: <span class="font-semibold">${data.avgWordsPerPost} words</span> average per post`,
        color: 'text-gray-500',
        weight: 3,
        category: 'quality',
      });

      // Topic focus (objective)
      insights.push({
        type: 'objective',
        text: `Topic focus: <span class="font-semibold">${data.topTags.length} distinct areas</span>`,
        color: 'text-gray-500',
        weight: 2,
        category: 'neutral',
      });

      // Content maturity (objective)
      insights.push({
        type: 'objective',
        text: `Content maturity: <span class="font-semibold">${data.totalPosts} posts</span> total`,
        color: 'text-gray-500',
        weight: 3,
        category: 'neutral',
      });
      break;
  }

  // Sort insights by weight (importance) and type priority
  insights.sort((a, b) => {
    // First by weight (descending)
    if (b.weight !== a.weight) return b.weight - a.weight;
    // Then by type priority: negative > warning > objective > positive > neutral
    const typePriority = { negative: 5, warning: 4, objective: 3, positive: 2, neutral: 1 };
    return typePriority[b.type] - typePriority[a.type];
  });

  // Separate insights into categories
  const strengths = insights.filter((i) => i.type === 'positive');
  const challenges = insights.filter((i) => i.type === 'negative' || i.type === 'warning');
  const neutral = insights.filter((i) => i.type === 'neutral' || i.type === 'objective');

  // Generate balanced summary
  const positiveCount = strengths.length;
  const negativeCount = challenges.filter((i) => i.type === 'negative').length;
  const warningCount = challenges.filter((i) => i.type === 'warning').length;
  const objectiveCount = neutral.filter((i) => i.type === 'objective').length;

  let summary = '';
  if (negativeCount > 0) {
    summary = `Analysis identifies <span class="text-red-500 font-semibold">${negativeCount} significant challenges</span>`;
    if (warningCount > 0)
      summary += `, <span class="text-yellow-500 font-semibold">${warningCount} areas of concern</span>`;
    if (positiveCount > 0)
      summary += `, and <span class="text-green-500 font-semibold">${positiveCount} positive indicators</span>`;
    summary += `. <span class="text-gray-500 font-semibold">${objectiveCount} objective metrics</span> provide baseline data.`;
  } else if (warningCount > 0) {
    summary = `Analysis shows <span class="text-yellow-500 font-semibold">${warningCount} areas of concern</span>`;
    if (positiveCount > 0)
      summary += ` and <span class="text-green-500 font-semibold">${positiveCount} positive indicators</span>`;
    summary += `. <span class="text-gray-500 font-semibold">${objectiveCount} objective metrics</span> provide baseline data.`;
  } else if (positiveCount > 0) {
    summary = `Analysis reveals <span class="text-green-500 font-semibold">${positiveCount} positive indicators</span>`;
    summary += `. <span class="text-gray-500 font-semibold">${objectiveCount} objective metrics</span> provide baseline data.`;
  } else {
    summary = `Analysis provides <span class="text-gray-500 font-semibold">${objectiveCount} objective metrics</span> for baseline assessment.`;
  }

  return { insights, summary, balancedAnalysis: { strengths, challenges, neutral } };
}

export function scoreToLetterGrade(score: number): string {
  if (score >= 97) return 'A+';
  if (score >= 93) return 'A';
  if (score >= 90) return 'A-';
  if (score >= 87) return 'B+';
  if (score >= 83) return 'B';
  if (score >= 80) return 'B-';
  if (score >= 77) return 'C+';
  if (score >= 73) return 'C';
  if (score >= 70) return 'C-';
  if (score >= 67) return 'D+';
  if (score >= 63) return 'D';
  if (score >= 60) return 'D-';
  return 'F';
}

export function letterGradeToColor(grade: string): string {
  if (grade.startsWith('A')) return 'text-green-600 dark:text-green-400';
  if (grade.startsWith('B')) return 'text-blue-600 dark:text-blue-400';
  if (grade.startsWith('C')) return 'text-yellow-600 dark:text-yellow-400';
  if (grade.startsWith('D')) return 'text-orange-600 dark:text-orange-400';
  return 'text-red-600 dark:text-red-400';
}

export function calculateObjectiveMetrics(posts: CollectionEntry<'blog'>[]): {
  sentimentAnalysis: { positive: number; negative: number; neutral: number; mixed: number };
  consistencyMetrics: {
    postingRegularity: number;
    topicConsistency: number;
    qualityVariance: number;
  };
  challengeAreas: Array<{ area: string; frequency: number; severity: 'high' | 'medium' | 'low' }>;
  improvementAreas: Array<{ area: string; current: number; target: number; gap: number }>;
} {
  // Use centralized metric calculations
  const sentimentAnalysis = calculateSentiment(posts);
  const postingRegularity = calculatePostingRegularity(posts);
  const topicConsistency = calculateTopicConsistency(posts);
  const qualityVariance = calculateQualityVariance(posts);

  // Get dates for improvement calculations
  const sortedPosts = [...posts].sort(
    (a, b) => a.data.pubDate.valueOf() - b.data.pubDate.valueOf(),
  );
  const firstPostDate = sortedPosts[0]?.data.pubDate;
  const lastPostDate = sortedPosts[sortedPosts.length - 1]?.data.pubDate;

  // Calculate challenge and improvement areas using configurable thresholds
  const challengeAreas = calculateChallengeAreas(
    postingRegularity,
    qualityVariance,
    sentimentAnalysis,
    topicConsistency,
  );

  const improvementAreas = calculateImprovementAreas(posts, firstPostDate, lastPostDate);

  return {
    sentimentAnalysis,
    consistencyMetrics: {
      postingRegularity,
      topicConsistency,
      qualityVariance,
    },
    challengeAreas,
    improvementAreas,
  };
}
