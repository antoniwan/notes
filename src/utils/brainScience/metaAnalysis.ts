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
  confidence: number; // 0-1, higher = more confident it's actually meta
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
 * Check if a sentence actually discusses writing as a subject (not just uses the word)
 */
function isWritingAsSubject(sentence: string): boolean {
  const lower = sentence.toLowerCase();
  
  // Strong indicators that writing is the subject
  const strongIndicators = [
    /writing (is|was|becomes|feels|seems|appears)/i,
    /(this|my|the) writing/i,
    /act of writing/i,
    /process of writing/i,
    /practice of writing/i,
    /writing (as|like) (a|an)/i,
    /when i write/i,
    /while writing/i,
    /writing (helps|allows|enables|forces|requires|demands)/i,
    /writing (makes|lets|gets)/i,
    /(i|we) (write|wrote|writing) (to|because|so|in order)/i,
    /(purpose|point|reason) (of|for) writing/i,
    /writing (itself|process|practice|act)/i,
  ];
  
  return strongIndicators.some(pattern => pattern.test(lower));
}

/**
 * Check if a sentence uses writing as a tool (functional use)
 */
function isWritingAsTool(sentence: string): boolean {
  const lower = sentence.toLowerCase();
  
  const toolIndicators = [
    /writing (helps|allows|enables|lets|makes) (me|us|you|one)/i,
    /(i|we) (use|used) writing (to|for)/i,
    /through writing/i,
    /by writing/i,
    /writing (to|for) (express|explore|process|understand|clarify|organize)/i,
  ];
  
  return toolIndicators.some(pattern => pattern.test(lower));
}

/**
 * Check if a phrase indicates genuine self-reflection (not just casual "i think")
 */
function isGenuineSelfReflection(phrase: string, sentence: string): boolean {
  const lower = sentence.toLowerCase();
  const phraseLower = phrase.toLowerCase();
  
  // Exclude common casual phrases that aren't really self-reflection
  const casualPhrases = [
    /^i think (that|it|this|so|we|they|he|she|it)/i,
    /^i think[,.]/i,
    /^i feel (like|that|this)/i,
    /^i feel[,.]/i,
  ];
  
  if (casualPhrases.some(pattern => pattern.test(phraseLower))) {
    return false;
  }
  
  // Look for genuine self-reflection indicators
  const genuineIndicators = [
    /i (realize|recognize|understand|see|notice|observe|wonder|question|reflect|contemplate|consider) (that|how|why|what|when|where|if)/i,
    /i (realize|recognize|understand|see|notice|observe|wonder|question|reflect|contemplate|consider) (i|my|myself)/i,
    /i (am|was|have been) (realizing|recognizing|understanding|seeing|noticing|observing|wondering|questioning|reflecting|contemplating|considering)/i,
    /(it|this) (makes|made) me (realize|think|wonder|question|reflect)/i,
    /(i|i've) (come|begun|started) to (realize|understand|see|notice)/i,
    /(i|i've) been (thinking|wondering|questioning|reflecting) (about|on|over)/i,
  ];
  
  return genuineIndicators.some(pattern => pattern.test(lower));
}

/**
 * Check if a phrase indicates meta-cognition (thinking about thinking)
 */
function isMetaCognition(phrase: string, sentence: string): boolean {
  const lower = sentence.toLowerCase();
  
  // Strong meta-cognition indicators
  const metaIndicators = [
    /(my|the) (thoughts|thinking|thought process|mental process|cognitive process)/i,
    /(i|i'm) (thinking|thinking about) (my|the) (thoughts|thinking|mind|mental)/i,
    /(how|why|what) (i|we) (think|thought)/i,
    /(my|the) (mind|brain) (works|processes|thinks)/i,
    /(cognitive|mental) (process|state|activity|function)/i,
    /(aware|conscious) (of|that) (my|the) (thoughts|thinking|mind)/i,
    /(i|i'm) (aware|conscious) (of|that) (i|my|the)/i,
  ];
  
  return metaIndicators.some(pattern => pattern.test(lower));
}

/**
 * Check if a phrase indicates recursive thinking (thinking about thinking about thinking)
 */
function isRecursiveThinking(phrase: string, sentence: string): boolean {
  const lower = sentence.toLowerCase();
  
  // Strong recursive thinking indicators
  const recursiveIndicators = [
    /thinking (about|of) (thinking|thoughts|my thinking|my thoughts)/i,
    /thoughts (about|of) (thoughts|thinking|my thoughts|my thinking)/i,
    /reflecting (on|about) (reflection|reflecting|my reflection)/i,
    /(thinking|thoughts) (about|of) (my|the) (thinking|thoughts|thought process)/i,
    /meta/i, // Only if in context of thinking/writing
    /self-referential/i,
    /(recursive|recursion) (thinking|thought|pattern)/i,
  ];
  
  // Check if "meta" is actually about meta-cognition, not just a casual use
  if (lower.includes('meta') && !lower.match(/meta(?:cognitive|thinking|reflection|awareness|analysis)/i)) {
    // Check surrounding context
    const metaIndex = lower.indexOf('meta');
    const context = lower.substring(Math.max(0, metaIndex - 30), Math.min(lower.length, metaIndex + 30));
    if (!context.match(/(thinking|thought|reflection|awareness|cognition|analysis|writing|self)/i)) {
      return false; // "meta" is probably not about meta-cognition
    }
  }
  
  return recursiveIndicators.some(pattern => pattern.test(lower));
}

/**
 * Detect meta-language patterns with improved accuracy and context awareness
 */
export function detectMetaLanguage(content: string, title: string): MetaLanguagePattern[] {
  const patterns: MetaLanguagePattern[] = [];
  const seenPhrases = new Set<string>(); // For deduplication
  const doc = nlp(content);
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
  
  // Writing-about-writing patterns (more precise)
  sentences.forEach((sentence) => {
    if (isWritingAsSubject(sentence)) {
      const normalized = sentence.trim().toLowerCase().substring(0, 100);
      if (!seenPhrases.has(normalized)) {
        seenPhrases.add(normalized);
        patterns.push({
          phrase: sentence.match(/writing[^.!?]{0,50}/i)?.[0] || 'writing',
          type: 'writing-about-writing',
          context: 'sentence',
          sentence: sentence.trim().substring(0, 200),
          confidence: 0.9,
        });
      }
    }
  });
  
  // Self-reflection patterns (filtered for genuine reflection)
  sentences.forEach((sentence) => {
    const selfReflectionPhrases = [
      'i realize',
      'i recognize',
      'i understand',
      'i see',
      'i notice',
      'i observe',
      'i wonder',
      'i question',
      'i reflect',
      'i contemplate',
      'i consider',
      'i think about',
      'i feel that',
    ];
    
    selfReflectionPhrases.forEach((phrase) => {
      if (sentence.toLowerCase().includes(phrase)) {
        if (isGenuineSelfReflection(phrase, sentence)) {
          const normalized = sentence.trim().toLowerCase().substring(0, 100);
          if (!seenPhrases.has(normalized)) {
            seenPhrases.add(normalized);
            patterns.push({
              phrase: phrase,
              type: 'self-reflection',
              context: 'sentence',
              sentence: sentence.trim().substring(0, 200),
              confidence: 0.8,
            });
          }
        }
      }
    });
  });
  
  // Meta-cognition patterns
  sentences.forEach((sentence) => {
    const metaCognitionPhrases = [
      'my thoughts',
      'my thinking',
      'my mind',
      'thought process',
      'mental process',
      'cognitive',
      'how i think',
      'why i think',
      'what i think',
    ];
    
    metaCognitionPhrases.forEach((phrase) => {
      if (sentence.toLowerCase().includes(phrase)) {
        if (isMetaCognition(phrase, sentence)) {
          const normalized = sentence.trim().toLowerCase().substring(0, 100);
          if (!seenPhrases.has(normalized)) {
            seenPhrases.add(normalized);
            patterns.push({
              phrase: phrase,
              type: 'meta-cognition',
              context: 'sentence',
              sentence: sentence.trim().substring(0, 200),
              confidence: 0.85,
            });
          }
        }
      }
    });
  });
  
  // Recursive thinking patterns
  sentences.forEach((sentence) => {
    const recursivePhrases = [
      'thinking about thinking',
      'thoughts about thoughts',
      'reflecting on reflection',
      'thinking about my thinking',
      'meta',
      'self-referential',
      'recursive thinking',
    ];
    
    recursivePhrases.forEach((phrase) => {
      if (sentence.toLowerCase().includes(phrase)) {
        if (isRecursiveThinking(phrase, sentence)) {
          const normalized = sentence.trim().toLowerCase().substring(0, 100);
          if (!seenPhrases.has(normalized)) {
            seenPhrases.add(normalized);
            patterns.push({
              phrase: phrase,
              type: 'recursive-thinking',
              context: 'sentence',
              sentence: sentence.trim().substring(0, 200),
              confidence: 0.9,
            });
          }
        }
      }
    });
  });
  
  // Check title for meta-indicators (only if title is clearly meta)
  const titleLower = title.toLowerCase();
  const titleMetaIndicators = [
    /writing (about|on|and)/i,
    /(thoughts|thinking|reflection|meta) (on|about|and)/i,
    /(how|why|what) (i|we) (think|write)/i,
  ];
  
  if (titleMetaIndicators.some(pattern => pattern.test(title))) {
    patterns.push({
      phrase: title,
      type: 'writing-about-writing',
      context: 'title',
      sentence: title,
      confidence: 0.7,
    });
  }
  
  // Filter patterns by confidence and deduplicate
  const filteredPatterns = patterns.filter((p, index, self) => {
    // Remove duplicates based on sentence similarity
    const isDuplicate = self.slice(0, index).some(other => {
      const similarity = other.sentence.toLowerCase().substring(0, 50) === p.sentence.toLowerCase().substring(0, 50);
      return similarity && other.type === p.type;
    });
    return !isDuplicate && p.confidence >= 0.6;
  });
  
  return filteredPatterns;
}

/**
 * Analyze writing philosophy for a single post with improved scoring
 */
export function analyzeWritingPhilosophy(post: CollectionEntry<'blog'>): WritingPhilosophyAnalysis {
  const content = post.body || '';
  const title = post.data.title;
  const metaPatterns = detectMetaLanguage(content, title);
  
  // Calculate self-awareness score based on quality and confidence, not just quantity
  const baseScore = metaPatterns.reduce((sum, p) => {
    const typeWeight = {
      'writing-about-writing': 8,
      'self-reflection': 10,
      'meta-cognition': 12,
      'recursive-thinking': 15,
    };
    return sum + (typeWeight[p.type] || 5) * p.confidence;
  }, 0);
  
  // Cap at 100 and apply diminishing returns
  const selfAwarenessScore = Math.min(100, Math.round(baseScore * 0.8));
  
  // Determine if writing is discussed as subject vs tool (more comprehensive)
  const writingAsSubject = metaPatterns.some(
    (p) => p.type === 'writing-about-writing' && p.confidence >= 0.7,
  ) || content.split(/[.!?]+/).some(s => isWritingAsSubject(s));
  
  const writingAsTool = content.split(/[.!?]+/).some(s => isWritingAsTool(s));
  
  // Check for recursive thinking (must have high confidence)
  const recursiveThinking = metaPatterns.some(
    (p) => p.type === 'recursive-thinking' && p.confidence >= 0.8,
  );
  
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
        quarterAnalyses.length > 0
          ? quarterAnalyses.reduce((sum, a) => sum + a.selfAwarenessScore, 0) / quarterAnalyses.length
          : 0;
      const writingAsSubjectCount = quarterAnalyses.filter((a) => a.writingAsSubject).length;
      const recursiveThinkingCount = quarterAnalyses.filter((a) => a.recursiveThinking).length;
      const avgSentiment =
        quarterAnalyses.length > 0
          ? quarterAnalyses.reduce((sum, a) => sum + a.sentiment.comparative, 0) / quarterAnalyses.length
          : 0;

      return {
        quarter: quarterLabel,
        label: quarterLabel,
        date: quarterStart,
        metaLanguageFrequency: quarterAnalyses.length > 0 ? totalMetaLanguage / quarterAnalyses.length : 0,
        selfAwarenessScore: Math.round(isNaN(avgSelfAwareness) ? 0 : avgSelfAwareness),
        writingAsSubjectRatio: quarterAnalyses.length > 0 ? (writingAsSubjectCount / quarterAnalyses.length) * 100 : 0,
        recursiveThinkingCount,
        avgSentiment: Math.round((isNaN(avgSentiment) ? 0 : avgSentiment) * 100) / 100,
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
  return analyses.filter((a) => a.writingAsSubject && a.metaLanguageCount > 0);
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
