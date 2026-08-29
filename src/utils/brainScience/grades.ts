/**
 * Letter grades used by Writing Insights.
 *
 * Two scales:
 * - Absolute 0–100 (cadence / consistency).
 * - Relative to the max in a chart (Correlations). An A there means “near the
 *   peak of this dataset,” not a school standard.
 */

export const LETTER_GRADE_BANDS = [
  { min: 97, grade: 'A+' },
  { min: 93, grade: 'A' },
  { min: 90, grade: 'A-' },
  { min: 87, grade: 'B+' },
  { min: 83, grade: 'B' },
  { min: 80, grade: 'B-' },
  { min: 77, grade: 'C+' },
  { min: 73, grade: 'C' },
  { min: 70, grade: 'C-' },
  { min: 67, grade: 'D+' },
  { min: 63, grade: 'D' },
  { min: 60, grade: 'D-' },
] as const;

export interface GradeExplanation {
  metric: string;
  score: number;
  grade: string;
  /** Why this corpus / slice received this grade. */
  why: string;
  /** Concrete picture of an A on the same scale. */
  aLooksLike: string;
}

export function scoreToLetterGrade(score: number): string {
  if (!Number.isFinite(score)) return 'F';
  for (const band of LETTER_GRADE_BANDS) {
    if (score >= band.min) return band.grade;
  }
  return 'F';
}

export function letterGradeToColor(grade: string): string {
  if (grade.startsWith('A')) return 'text-green-600 dark:text-green-400';
  if (grade.startsWith('B')) return 'text-blue-600 dark:text-blue-400';
  if (grade.startsWith('C')) return 'text-yellow-600 dark:text-yellow-400';
  if (grade.startsWith('D')) return 'text-orange-600 dark:text-orange-400';
  return 'text-red-600 dark:text-red-400';
}

export function relativeShare(score: number, maxScore: number, minScore = 0): number {
  const span = maxScore - minScore;
  if (span <= 0) return 1;
  return (score - minScore) / span;
}

export function relativeLetterGrade(score: number, maxScore: number, minScore = 0): string {
  return scoreToLetterGrade(relativeShare(score, maxScore, minScore) * 100);
}

export function explainRelativeGrade(args: {
  metric: string;
  value: number;
  max: number;
  unit?: string;
  /** When the max is a different kind of number than `value` (e.g. avg vs one post). */
  maxLabel?: string;
}): GradeExplanation {
  const { metric, value, max, unit = '', maxLabel } = args;
  const share = relativeShare(value, max);
  const grade = scoreToLetterGrade(share * 100);
  const pct = Math.round(share * 100);
  const aFloor = Math.ceil(max * 0.93);
  const unitSuffix = unit ? ` ${unit}` : '';
  const vs = maxLabel || `the chart max (${Math.round(max)}${unitSuffix})`;

  return {
    metric,
    score: Math.round(value),
    grade,
    why: `${Math.round(value)}${unitSuffix} is ${pct}% of ${vs}, so this slice grades ${grade}.`,
    aLooksLike: `An A is ≥93% of that same max — about ${aFloor}${unitSuffix} or more. It is a ranking against this dataset, not a universal standard.`,
  };
}

function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function variance(values: number[]): number {
  if (values.length === 0) return 0;
  const avg = mean(values);
  return values.reduce((sum, value) => sum + (value - avg) ** 2, 0) / values.length;
}

/** Same formula as `calculatePostingRegularity`. */
export function postingRegularityFromIntervals(intervalsDays: number[]): number {
  if (intervalsDays.length === 0) return 100;
  return Math.round(Math.max(0, 100 - variance(intervalsDays) / 10));
}

export function explainPostingRegularity(intervalsDays: number[]): GradeExplanation {
  const score = postingRegularityFromIntervals(intervalsDays);
  const grade = scoreToLetterGrade(score);

  if (intervalsDays.length === 0) {
    return {
      metric: 'Posting regularity',
      score,
      grade,
      why: 'Fewer than two posts, so there are no gaps to score. The formula treats that as 100.',
      aLooksLike:
        'An A (93+) means publish-to-publish gaps stay almost even. Burst-then-silence calendars cannot get there.',
    };
  }

  const avg = Math.round(mean(intervalsDays));
  const min = Math.min(...intervalsDays);
  const max = Math.max(...intervalsDays);
  const spread = Math.round(variance(intervalsDays));
  // 100 - variance/10 ≥ 93  → variance ≤ 70
  const aVarianceCeiling = 70;

  return {
    metric: 'Posting regularity',
    score,
    grade,
    why: `These notes average ${avg} days between posts, but gaps run ${min}–${max} days (variance ${spread}). The grade is 100 minus that variance / 10, so this set is ${grade}. Uneven calendars look “worse” even if the average pace is fine.`,
    aLooksLike: `An A (93+) needs gap variance ≤ ${aVarianceCeiling}. Keep gaps clustered around the same interval — not more posts, just a steadier metronome.`,
  };
}

export function explainTopicConsistency(args: {
  topTag: string;
  topCount: number;
  totalPosts: number;
}): GradeExplanation {
  const { topTag, topCount, totalPosts } = args;
  const score = totalPosts === 0 ? 0 : Math.round((topCount / totalPosts) * 100);
  const grade = scoreToLetterGrade(score);
  const aCount = Math.ceil(totalPosts * 0.93);
  const label = topTag || '(no tags)';

  return {
    metric: 'Topic consistency',
    score,
    grade,
    why: `“${label}” is on ${topCount} of ${totalPosts} posts (${score}%). The grade is that share, so this set is ${grade}. High is concentration, not a quality prize — the flags below may call the same number over-focus.`,
    aLooksLike: `An A (93+) would mean one tag on about ${aCount}+ of these ${totalPosts} posts. Most mixed corpora will never see it, and that is fine.`,
  };
}

export function explainLengthStability(wordCounts: number[]): GradeExplanation {
  if (wordCounts.length === 0) {
    return {
      metric: 'Length stability',
      score: 0,
      grade: 'F',
      why: 'No posts to measure.',
      aLooksLike:
        'An A means post lengths cluster tightly. Short notes next to long essays pull this down on purpose.',
    };
  }

  const avg = Math.round(mean(wordCounts));
  const min = Math.min(...wordCounts);
  const max = Math.max(...wordCounts);
  const rawVariance = variance(wordCounts);
  const varianceIndex = Math.min(100, Math.round(rawVariance / 10));
  const inverted = 100 - varianceIndex;
  const grade = scoreToLetterGrade(inverted);

  return {
    metric: 'Length stability',
    score: inverted,
    grade,
    why: `Bodies run ${min.toLocaleString()}–${max.toLocaleString()} words (avg ${avg.toLocaleString()}). Word-count variance maps to index ${varianceIndex}/100; the dashboard inverts that to ${inverted}/100, so this set is ${grade}. Mixed short notes and long essays will look “unstable.” That is length, not quality.`,
    aLooksLike:
      'An A (93+) means inverted variance ≥ 93, so the variance index is ≤ 7. Posts would need to stay in a tight word-count band. A corpus that mixes notes and essays is not supposed to.',
  };
}

export function relativeGradeTitle(value: number, max: number, unit = ''): string {
  const explained = explainRelativeGrade({ metric: '', value, max, unit });
  return `${explained.grade}: ${explained.why} ${explained.aLooksLike}`;
}

export function explainConsistencyFromPosts(
  posts: Array<{
    body?: string;
    data: { tags?: string[]; pubDate: Date };
  }>,
): GradeExplanation[] {
  const sorted = [...posts].sort((a, b) => a.data.pubDate.valueOf() - b.data.pubDate.valueOf());
  const intervals: number[] = [];
  for (let i = 1; i < sorted.length; i++) {
    intervals.push(
      Math.floor(
        (sorted[i].data.pubDate.getTime() - sorted[i - 1].data.pubDate.getTime()) /
          (1000 * 60 * 60 * 24),
      ),
    );
  }

  const tagFrequency = posts.reduce(
    (acc, post) => {
      post.data.tags?.forEach((tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    },
    {} as Record<string, number>,
  );
  const topTag = Object.entries(tagFrequency).sort((a, b) => b[1] - a[1])[0];

  const wordCounts = posts.map((post) => (post.body || '').split(/\s+/).length);

  return [
    explainPostingRegularity(intervals),
    explainTopicConsistency({
      topTag: topTag?.[0] ?? '',
      topCount: topTag?.[1] ?? 0,
      totalPosts: posts.length,
    }),
    explainLengthStability(wordCounts),
  ];
}
