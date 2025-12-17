import nlp from 'compromise';
import Sentiment from 'sentiment';
import type { CollectionEntry } from 'astro:content';
import { format, endOfQuarter, eachQuarterOfInterval } from 'date-fns';

const sentiment = new Sentiment();

export interface MetaLanguagePattern {
  phrase: string;
  type: 'writing-about-writing' | 'self-reflection' | 'meta-cognition' | 'recursive-thinking';
  context: string;
  sentence: string;
}

export interface WritingPhilosophyAnalysis {
  postTitle: string;
  postSlug: string;
  postDate: Date;
  metaLanguageCount: number;
  metaLanguagePatterns: MetaLanguagePattern[];
  selfAwarenessScore: number;
  writingAsSubject: boolean;
  writingAsTool: boolean;
  recursiveThinking: boolean;
  sentiment: {
    score: number;
    comparative: number;
    calculation: Array<{ word: string; score: number }>;
  };
}

export interface MetaEvolutionData {
  quarter: string;
  label: string;
  date: Date;
  metaLanguageFrequency: number;
  selfAwarenessScore: number;
  writingAsSubjectRatio: number;
  recursiveThinkingCount: number;
  avgSentiment: number;
  postCount: number;
}

/**
 * Detect meta-language patterns using compromise.js NLP
 */
export function detectMetaLanguage(content: string, title: string): MetaLanguagePattern[] {
  const patterns: MetaLanguagePattern[] = [];
  const doc = nlp(content);

  // Writing-about-writing patterns
  const writingVerbs = doc.match('#Verb+ (writing|write|wrote|written)');
  const writingNouns = doc.match('(writing|post|blog|article|piece|essay)');

  writingVerbs.forEach((match: any) => {
    const sentence = match.sentence().text();
    if (sentence.toLowerCase().includes('writing') || sentence.toLowerCase().includes('write')) {
      patterns.push({
        phrase: match.text(),
        type: 'writing-about-writing',
        context: 'verb',
        sentence: sentence.substring(0, 200),
      });
    }
  });

  // Self-reflection patterns
  const selfReflectionPhrases = [
    'i realize',
    'i think',
    'i feel',
    'i wonder',
    'i question',
    'i reflect',
    'i notice',
    'i observe',
    'i consider',
    'i contemplate',
  ];

  selfReflectionPhrases.forEach((phrase) => {
    const matches = doc.match(phrase);
    matches.forEach((match: any) => {
      const sentence = match.sentence().text();
      patterns.push({
        phrase: match.text(),
        type: 'self-reflection',
        context: 'phrase',
        sentence: sentence.substring(0, 200),
      });
    });
  });

  // Meta-cognition patterns
  const metaCognitionPhrases = [
    'my thoughts',
    'my thinking',
    'my mind',
    'i think about',
    'i think that',
    'thinking about',
    'thought process',
    'cognitive',
    'mental',
  ];

  metaCognitionPhrases.forEach((phrase) => {
    const matches = doc.match(phrase);
    matches.forEach((match: any) => {
      const sentence = match.sentence().text();
      patterns.push({
        phrase: match.text(),
        type: 'meta-cognition',
        context: 'phrase',
        sentence: sentence.substring(0, 200),
      });
    });
  });

  // Recursive thinking patterns
  const recursivePhrases = [
    'thinking about thinking',
    'thoughts about thoughts',
    'reflecting on reflection',
    'thinking about my thinking',
    'meta',
    'self-referential',
  ];

  recursivePhrases.forEach((phrase) => {
    const matches = doc.match(phrase);
    matches.forEach((match: any) => {
      const sentence = match.sentence().text();
      patterns.push({
        phrase: match.text(),
        type: 'recursive-thinking',
        context: 'phrase',
        sentence: sentence.substring(0, 200),
      });
    });
  });

  // Check title for meta-indicators
  const titleDoc = nlp(title);
  const titleMeta = titleDoc.match('(writing|thought|think|reflection|meta|self)');
  if (titleMeta.found) {
    patterns.push({
      phrase: title,
      type: 'writing-about-writing',
      context: 'title',
      sentence: title,
    });
  }

  return patterns;
}

/**
 * Analyze writing philosophy for a single post
 */
export function analyzeWritingPhilosophy(post: CollectionEntry<'blog'>): WritingPhilosophyAnalysis {
  const content = post.body || '';
  const title = post.data.title;
  const metaPatterns = detectMetaLanguage(content, title);

  // Calculate self-awareness score (0-100)
  const selfAwarenessScore = Math.min(
    100,
    metaPatterns.length * 10 +
      metaPatterns.filter((p) => p.type === 'self-reflection').length * 15 +
      metaPatterns.filter((p) => p.type === 'recursive-thinking').length * 20,
  );

  // Determine if writing is discussed as subject vs tool
  const writingAsSubject = metaPatterns.some(
    (p) => p.type === 'writing-about-writing' && p.context !== 'title',
  );
  const writingAsTool =
    content.toLowerCase().includes('writing helps') ||
    content.toLowerCase().includes('writing allows') ||
    content.toLowerCase().includes('writing enables');

  // Check for recursive thinking
  const recursiveThinking = metaPatterns.some((p) => p.type === 'recursive-thinking');

  // Analyze sentiment of meta-content
  const metaSentences = metaPatterns.map((p) => p.sentence).join(' ');
  const sentimentResult = sentiment.analyze(metaSentences || content.substring(0, 500));

  return {
    postTitle: title,
    postSlug: post.id,
    postDate: post.data.pubDate,
    metaLanguageCount: metaPatterns.length,
    metaLanguagePatterns: metaPatterns,
    selfAwarenessScore,
    writingAsSubject,
    writingAsTool,
    recursiveThinking,
    sentiment: sentimentResult,
  };
}

/**
 * Analyze writing philosophy across all posts
 */
export function analyzeAllWritingPhilosophy(
  posts: CollectionEntry<'blog'>[],
): WritingPhilosophyAnalysis[] {
  return posts.map((post) => analyzeWritingPhilosophy(post));
}

/**
 * Calculate evolution of writing relationship over time
 */
export function analyzeWritingEvolution(posts: CollectionEntry<'blog'>[]): MetaEvolutionData[] {
  const analyses = analyzeAllWritingPhilosophy(posts);
  const sortedAnalyses = analyses.sort((a, b) => a.postDate.valueOf() - b.postDate.valueOf());

  if (sortedAnalyses.length === 0) return [];

  const firstDate = sortedAnalyses[0].postDate;
  const lastDate = sortedAnalyses[sortedAnalyses.length - 1].postDate;
  const quarters = eachQuarterOfInterval({ start: firstDate, end: lastDate });

  return quarters
    .map((quarterStart) => {
      const quarterEnd = endOfQuarter(quarterStart);
      const quarterLabel = `Q${Math.floor(quarterStart.getMonth() / 3) + 1} ${quarterStart.getFullYear()}`;

      const quarterAnalyses = sortedAnalyses.filter(
        (analysis) => analysis.postDate >= quarterStart && analysis.postDate <= quarterEnd,
      );

      if (quarterAnalyses.length === 0) {
        return {
          quarter: quarterLabel,
          label: quarterLabel,
          date: quarterStart,
          metaLanguageFrequency: 0,
          selfAwarenessScore: 0,
          writingAsSubjectRatio: 0,
          recursiveThinkingCount: 0,
          avgSentiment: 0,
          postCount: 0,
        };
      }

      const totalMetaLanguage = quarterAnalyses.reduce((sum, a) => sum + a.metaLanguageCount, 0);
      const avgSelfAwareness =
        quarterAnalyses.reduce((sum, a) => sum + a.selfAwarenessScore, 0) / quarterAnalyses.length;
      const writingAsSubjectCount = quarterAnalyses.filter((a) => a.writingAsSubject).length;
      const recursiveThinkingCount = quarterAnalyses.filter((a) => a.recursiveThinking).length;
      const avgSentiment =
        quarterAnalyses.reduce((sum, a) => sum + a.sentiment.comparative, 0) /
        quarterAnalyses.length;

      return {
        quarter: quarterLabel,
        label: quarterLabel,
        date: quarterStart,
        metaLanguageFrequency: totalMetaLanguage / quarterAnalyses.length,
        selfAwarenessScore: Math.round(avgSelfAwareness),
        writingAsSubjectRatio: (writingAsSubjectCount / quarterAnalyses.length) * 100,
        recursiveThinkingCount,
        avgSentiment: Math.round(avgSentiment * 100) / 100,
        postCount: quarterAnalyses.length,
      };
    })
    .filter((q) => q.postCount > 0);
}

/**
 * Get posts with highest self-awareness
 */
export function getMostSelfAwarePosts(
  posts: CollectionEntry<'blog'>[],
  limit: number = 10,
): WritingPhilosophyAnalysis[] {
  const analyses = analyzeAllWritingPhilosophy(posts);
  return analyses.sort((a, b) => b.selfAwarenessScore - a.selfAwarenessScore).slice(0, limit);
}

/**
 * Get posts that discuss writing itself
 */
export function getWritingAboutWritingPosts(
  posts: CollectionEntry<'blog'>[],
): WritingPhilosophyAnalysis[] {
  const analyses = analyzeAllWritingPhilosophy(posts);
  return analyses.filter((a) => a.writingAsSubject || a.metaLanguageCount > 3);
}

/**
 * Calculate overall meta metrics
 */
export function calculateMetaMetrics(posts: CollectionEntry<'blog'>[]): {
  totalPosts: number;
  postsWithMetaLanguage: number;
  avgSelfAwarenessScore: number;
  writingAsSubjectCount: number;
  writingAsToolCount: number;
  recursiveThinkingCount: number;
  avgMetaSentiment: number;
  metaLanguageFrequency: number;
} {
  const analyses = analyzeAllWritingPhilosophy(posts);
  const postsWithMeta = analyses.filter((a) => a.metaLanguageCount > 0);

  return {
    totalPosts: posts.length,
    postsWithMetaLanguage: postsWithMeta.length,
    avgSelfAwarenessScore: Math.round(
      analyses.reduce((sum, a) => sum + a.selfAwarenessScore, 0) / analyses.length,
    ),
    writingAsSubjectCount: analyses.filter((a) => a.writingAsSubject).length,
    writingAsToolCount: analyses.filter((a) => a.writingAsTool).length,
    recursiveThinkingCount: analyses.filter((a) => a.recursiveThinking).length,
    avgMetaSentiment:
      Math.round(
        (analyses.reduce((sum, a) => sum + a.sentiment.comparative, 0) / analyses.length) * 100,
      ) / 100,
    metaLanguageFrequency:
      analyses.reduce((sum, a) => sum + a.metaLanguageCount, 0) / analyses.length,
  };
}
