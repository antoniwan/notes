/**
 * Shared body-text metrics for Brain Science pages.
 * Keeps Flesch / word / sentence heuristics in one place so routes don't reimplement them.
 */

export interface BasicTextMetrics {
  wordCount: number;
  paragraphCount: number;
  sentenceCount: number;
  averageSentenceLength: number;
  syllableCount: number;
  fleschScore: number;
}

const basicMetricsByKey = new Map<string, BasicTextMetrics>();

export function countWords(content: string): number {
  const trimmed = content.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

export function countParagraphs(content: string): number {
  return content.split('\n\n').length;
}

export function countSentences(content: string): number {
  return Math.max(0, content.split(/[.!?]+/).length - 1);
}

/** Approximate syllable proxy used historically: vowel count in a–z letters only. */
export function approximateVowelSyllables(content: string): number {
  return content
    .toLowerCase()
    .replace(/[^a-z]/g, '')
    .split('')
    .filter((char) => 'aeiou'.includes(char)).length;
}

export function fleschReadingEase(
  wordCount: number,
  sentenceCount: number,
  syllableCount: number,
): number {
  if (sentenceCount <= 0 || wordCount <= 0) return 0;
  return Math.round(
    206.835 - 1.015 * (wordCount / sentenceCount) - 84.6 * (syllableCount / wordCount),
  );
}

export function countLexiconHits(content: string, words: string[]): number {
  return words.reduce((count, word) => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    return count + (content.match(regex) || []).length;
  }, 0);
}

export function estimateReadingMinutes(
  minutesRead: string | undefined,
  wordCount: number,
): number {
  if (minutesRead && typeof minutesRead === 'string') {
    const match = minutesRead.match(/(\d+)/);
    if (match) return parseInt(match[1], 10);
  }
  return Math.ceil(wordCount / 200);
}

export function analyzeBasicTextMetrics(content: string): BasicTextMetrics {
  const wordCount = countWords(content);
  const paragraphCount = countParagraphs(content);
  const sentenceCount = countSentences(content);
  const averageSentenceLength = sentenceCount > 0 ? Math.round(wordCount / sentenceCount) : 0;
  const syllableCount = approximateVowelSyllables(content);
  const fleschScore = fleschReadingEase(wordCount, sentenceCount, syllableCount);
  return {
    wordCount,
    paragraphCount,
    sentenceCount,
    averageSentenceLength,
    syllableCount,
    fleschScore,
  };
}

/** Memoized per post id for the build process (shared across Brain Science routes). */
export function getBasicTextMetricsForPost(postId: string, content: string): BasicTextMetrics {
  const key = `${postId}:${content.length}`;
  const cached = basicMetricsByKey.get(key);
  if (cached) return cached;
  const metrics = analyzeBasicTextMetrics(content);
  basicMetricsByKey.set(key, metrics);
  return metrics;
}
