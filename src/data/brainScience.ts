export interface BrainSciencePage {
  id: string;
  path: string;
  title: string;
  description: string;
  icon: string;
  emoji: string;
}

export interface BrainScienceConfig {
  pages: BrainSciencePage[];
  thresholds: {
    postingRegularity: {
      excellent: number; // 90+
      good: number; // 70-89
      average: number; // 50-69
    };
    topicConsistency: {
      excellent: number; // 80+
      good: number; // 60-79
      average: number; // 40-59
    };
    qualityVariance: {
      excellent: number; // <30 (lower is better)
      good: number; // 30-50
      average: number; // 50-70
    };
    sentimentThresholds: {
      highPositive: number; // 0.4 (40%+)
      highNegative: number; // 0.4 (40%+)
      balancedNeutral: number; // 0.5 (50%+)
    };
    challengeSeverity: {
      high: {
        postingRegularity: number; // <30
        qualityVariance: number; // >90
        negativeSentiment: number; // >0.6
        topicFocus: number; // >90
      };
      medium: {
        postingRegularity: number; // <50
        qualityVariance: number; // >70
        negativeSentiment: number; // >0.4
        topicFocus: number; // >80
      };
    };
  };
  improvementTargets: {
    monthlyPostingRate: number; // Target posts per month
    averagePostLength: number; // Target words per post
    topicDiversity: number; // Target unique topics
    balancedSentiment: number; // Target % neutral content
  };
}

export const BRAIN_SCIENCE_PAGES: BrainSciencePage[] = [
  {
    id: 'index',
    path: '/writing-insights',
    title: 'Writing Insights',
    description:
      'Post counts, tag frequencies, and word-list votes from published Markdown. Each number is a count or a score from a formula in this repo.',
    icon: '🧠',
    emoji: '🧠',
  },
  {
    id: 'insights',
    path: '/writing-insights/insights',
    title: 'Affect lexicon',
    description:
      'Word-list hits for affect, vulnerability, and confidence. Ranked by hits per 1,000 words, so a 400-word note can rank above a 4,000-word essay.',
    icon: '💡',
    emoji: '💡',
  },
  {
    id: 'evolution',
    path: '/writing-insights/evolution',
    title: 'Language over time',
    description:
      'Flesch reading ease, a word-pattern count, and tag counts split into the first, middle, and last third of the archive by publish order.',
    icon: '📈',
    emoji: '📈',
  },
  {
    id: 'topics',
    path: '/writing-insights/topics',
    title: 'Themes & tags',
    description: 'Tag counts, tags that appear on the same post, and tag groups listed in code.',
    icon: '🏷️',
    emoji: '🏷️',
  },
  {
    id: 'cadence',
    path: '/writing-insights/cadence',
    title: 'Cadence',
    description:
      'Publish dates by month and weekday. A streak is two or more posts with 7 days or less between them.',
    icon: '📅',
    emoji: '📅',
  },
  {
    id: 'patterns',
    path: '/writing-insights/patterns',
    title: 'Correlations',
    description:
      'Word count vs lexicon hits, weekday vs Flesch, month vs word count. Axes use mixed units; read each label.',
    icon: '🌀',
    emoji: '🌀',
  },
  {
    id: 'meta',
    path: '/writing-insights/meta',
    title: 'Meta-language',
    description:
      'Counts of writing-about-writing phrases in the body. A post ranks higher when more of those phrases match.',
    icon: '🔍',
    emoji: '🔍',
  },
];

export const BRAIN_SCIENCE_CONFIG: BrainScienceConfig = {
  pages: BRAIN_SCIENCE_PAGES,
  thresholds: {
    postingRegularity: {
      excellent: 90,
      good: 70,
      average: 50,
    },
    topicConsistency: {
      excellent: 80,
      good: 60,
      average: 40,
    },
    qualityVariance: {
      excellent: 30,
      good: 50,
      average: 70,
    },
    sentimentThresholds: {
      highPositive: 0.4, // 40%+
      highNegative: 0.4, // 40%+
      balancedNeutral: 0.5, // 50%+
    },
    challengeSeverity: {
      high: {
        postingRegularity: 30,
        qualityVariance: 90,
        negativeSentiment: 0.6,
        topicFocus: 90,
      },
      medium: {
        postingRegularity: 50,
        qualityVariance: 70,
        negativeSentiment: 0.4,
        topicFocus: 80,
      },
    },
  },
  improvementTargets: {
    monthlyPostingRate: 4, // Target 4 posts per month
    averagePostLength: 800, // Target 800 words per post
    topicDiversity: 15, // Target 15 different topics
    balancedSentiment: 40, // Target 40% neutral content
  },
};

// Helper functions
export function getBrainSciencePage(path: string): BrainSciencePage | undefined {
  return BRAIN_SCIENCE_PAGES.find((page) => page.path === path);
}

export function getBrainSciencePageById(id: string): BrainSciencePage | undefined {
  return BRAIN_SCIENCE_PAGES.find((page) => page.id === id);
}

export function getAllBrainSciencePages(): BrainSciencePage[] {
  return BRAIN_SCIENCE_PAGES;
}

export function getBrainScienceConfig(): BrainScienceConfig {
  return BRAIN_SCIENCE_CONFIG;
}
