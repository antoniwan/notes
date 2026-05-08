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
    path: '/brain-science',
    title: 'Writing Analytics & Self-Discovery',
    description:
      'Build-time aggregates from published posts—reproducible counts and lexicon-based scores. Exploratory; not psychology or medical insight.',
    icon: '🧠',
    emoji: '🧠',
  },
  {
    id: 'insights',
    path: '/brain-science/insights',
    title: 'Emotional Processing Analytics',
    description:
      'Lexical proxies only: fixed word lists + punctuation on Markdown bodies. Useful for drift, not diagnostics.',
    icon: '💡',
    emoji: '💡',
  },
  {
    id: 'evolution',
    path: '/brain-science/evolution',
    title: 'Intellectual Growth Analytics',
    description:
      'Readability formulas and hand-picked word-pattern tallies over time—signals about language, not IQ or depth.',
    icon: '📈',
    emoji: '📈',
  },
  {
    id: 'topics',
    path: '/brain-science/topics',
    title: 'Core Themes Analysis',
    description:
      'Tag frequencies, co-occurrence, and heuristic “clusters” from your taxonomy—descriptive, not a mind map.',
    icon: '🏷️',
    emoji: '🏷️',
  },
  {
    id: 'cadence',
    path: '/brain-science/cadence',
    title: 'Writing Cadence',
    description:
      'Publish dates, streaks (≤7-day gaps), and calendar slices. Simple time-series, not habit coaching.',
    icon: '📅',
    emoji: '📅',
  },
  {
    id: 'patterns',
    path: '/brain-science/patterns',
    title: 'Pattern Recognition',
    description:
      'Correlations and composites from the same post features—interpret directionally; mixed units are intentional for contrast.',
    icon: '🌀',
    emoji: '🌀',
  },
  {
    id: 'meta',
    path: '/brain-science/meta',
    title: 'Meta Analysis',
    description:
      'Curated detectors for meta-language in bodies—counts and toy scores, not a measure of self-awareness in a clinical sense.',
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
