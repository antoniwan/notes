export interface PreludeTemplateCandidate {
  id: string;
  weight: number;
  prefix: string;
  tags: string[];
  suffix?: string;
}

interface PreludeTemplateInput {
  tagCounts: Record<string, number>;
  narrativeStats: Array<{ tag: string; postCount: number; averageWords: number }>;
}

const hasTag = (tagCounts: Record<string, number>, tag: string) => (tagCounts[tag] ?? 0) > 0;

const topTags = (tagCounts: Record<string, number>, allowed: string[], limit: number): string[] =>
  allowed
    .filter((tag) => hasTag(tagCounts, tag))
    .sort((a, b) => (tagCounts[b] ?? 0) - (tagCounts[a] ?? 0))
    .slice(0, limit);

const addTemplateIfEnoughTags = (
  candidates: PreludeTemplateCandidate[],
  {
    id,
    weight,
    prefix,
    tags,
    suffix,
    minTags = 2,
  }: {
    id: string;
    weight: number;
    prefix: string;
    tags: string[];
    suffix?: string;
    minTags?: number;
  },
) => {
  if (tags.length < minTags) return;
  candidates.push({ id, weight, prefix, tags, suffix });
};

export const buildPreludeTemplateCandidates = ({
  tagCounts,
  narrativeStats,
}: PreludeTemplateInput): PreludeTemplateCandidate[] => {
  const candidates: PreludeTemplateCandidate[] = [];

  const innerWork = topTags(
    tagCounts,
    ['consciousness', 'healing', 'self-reflection', 'mindfulness', 'therapy'],
    3,
  );
  if (innerWork.length >= 2) {
    candidates.push({
      id: 'inner-work',
      weight: 5,
      prefix: 'I keep returning to',
      tags: innerWork,
      suffix: 'the long road kind.',
    });
  }

  const familyTags = topTags(tagCounts, ['parenting', 'family', 'children', 'family-dynamics'], 3);
  if (familyTags.length >= 2) {
    candidates.push({
      id: 'family',
      weight: 4,
      prefix: 'A lot of this is fatherhood in real time:',
      tags: familyTags,
    });
  }

  const systems = topTags(
    tagCounts,
    ['social-issues', 'politics', 'power', 'systemic-critique'],
    3,
  );
  if (systems.length >= 2) {
    candidates.push({
      id: 'systems',
      weight: 4,
      prefix: 'When the world gets loud, I write on',
      tags: systems,
    });
  }

  const growth = topTags(
    tagCounts,
    ['personal-growth', 'emotional-regulation', 'self-improvement', 'resilience'],
    3,
  );
  if (growth.length >= 2) {
    candidates.push({
      id: 'growth',
      weight: 4,
      prefix: 'Some notes are for becoming:',
      tags: growth,
    });
  }

  const claritySet = topTags(tagCounts, ['values', 'truth', 'purpose', 'responsibility'], 3);
  addTemplateIfEnoughTags(candidates, {
    id: 'clarity',
    weight: 3,
    prefix: 'If you want practical reflection, start with',
    tags: claritySet,
  });

  const relationshipSet = topTags(
    tagCounts,
    ['relationships', 'vulnerability', 'trust', 'communication', 'intimacy'],
    3,
  );
  addTemplateIfEnoughTags(candidates, {
    id: 'relationships',
    weight: 4,
    prefix: 'I write about closeness without pretending it is easy:',
    tags: relationshipSet,
  });

  const familyHealingSet = topTags(
    tagCounts,
    ['children', 'parenting', 'family-dynamics', 'empathy', 'healing'],
    3,
  );
  addTemplateIfEnoughTags(candidates, {
    id: 'family-healing',
    weight: 4,
    prefix: 'From everyday parenting to deeper repair work:',
    tags: familyHealingSet,
  });

  const mindBodySet = topTags(tagCounts, ['mindfulness', 'self-care', 'wellness', 'health'], 3);
  addTemplateIfEnoughTags(candidates, {
    id: 'mind-body',
    weight: 3,
    prefix: 'When I need to slow down, I write around',
    tags: mindBodySet,
  });

  const identitySet = topTags(
    tagCounts,
    ['authenticity', 'identity', 'self-awareness', 'consciousness'],
    3,
  );
  addTemplateIfEnoughTags(candidates, {
    id: 'identity',
    weight: 4,
    prefix: 'A lot of these posts ask who we become through',
    tags: identitySet,
  });

  const justiceSet = topTags(
    tagCounts,
    ['social-justice', 'collective-healing', 'social-issues', 'politics'],
    3,
  );
  addTemplateIfEnoughTags(candidates, {
    id: 'justice',
    weight: 3,
    prefix: 'Some notes zoom out into the social layer:',
    tags: justiceSet,
  });

  const systemsSet = topTags(
    tagCounts,
    ['systems-strategy', 'technology', 'power', 'metaspace'],
    3,
  );
  addTemplateIfEnoughTags(candidates, {
    id: 'systems-thinking',
    weight: 3,
    prefix: 'Others are systems notes about',
    tags: systemsSet,
  });

  const learningSet = topTags(
    tagCounts,
    ['learning-projects', 'education', 'psychology', 'philosophy'],
    3,
  );
  addTemplateIfEnoughTags(candidates, {
    id: 'learning',
    weight: 3,
    prefix: 'If you are in study mode, I also write about',
    tags: learningSet,
  });

  const courageSet = topTags(
    tagCounts,
    ['vulnerability', 'resilience', 'boundaries', 'self-mastery'],
    3,
  );
  addTemplateIfEnoughTags(candidates, {
    id: 'courage',
    weight: 3,
    prefix: 'The backbone topics here are',
    tags: courageSet,
  });

  const emotionalSet = topTags(
    tagCounts,
    ['emotional-regulation', 'mental-health', 'therapy', 'self-reflection'],
    3,
  );
  addTemplateIfEnoughTags(candidates, {
    id: 'emotional-work',
    weight: 5,
    prefix: 'I keep writing through emotional reality via',
    tags: emotionalSet,
  });

  const bridgeSet = topTags(
    tagCounts,
    ['therapy', 'parenting', 'social-issues', 'power', 'consciousness'],
    3,
  );
  addTemplateIfEnoughTags(candidates, {
    id: 'bridge',
    weight: 2,
    prefix: 'From the living room to public life, I connect',
    tags: bridgeSet,
  });

  const voiceSet = topTags(
    tagCounts,
    ['authenticity', 'truth', 'communication', 'self-reflection'],
    3,
  );
  addTemplateIfEnoughTags(candidates, {
    id: 'voice',
    weight: 3,
    prefix: 'I try to write with signal, not noise:',
    tags: voiceSet,
  });

  const longRantTags = narrativeStats
    .filter(({ averageWords }) => averageWords >= 1400)
    .sort((a, b) => (tagCounts[b.tag] ?? 0) - (tagCounts[a.tag] ?? 0))
    .map(({ tag }) => tag)
    .slice(0, 3);
  if (longRantTags.length > 0) {
    candidates.push({
      id: 'long-rants',
      weight: 3,
      prefix: "I've written some lengthy rants on",
      tags: longRantTags,
    });
  }

  const mediumDeepTags = narrativeStats
    .filter(({ averageWords }) => averageWords >= 1200 && averageWords < 1400)
    .sort((a, b) => (tagCounts[b.tag] ?? 0) - (tagCounts[a.tag] ?? 0))
    .map(({ tag }) => tag)
    .slice(0, 3);
  addTemplateIfEnoughTags(candidates, {
    id: 'deep-dives',
    weight: 2,
    prefix: 'Some posts are deep dives on',
    tags: mediumDeepTags,
  });

  const shortRantTags = narrativeStats
    .filter(({ averageWords }) => averageWords > 600 && averageWords < 1200)
    .sort((a, b) => (tagCounts[b.tag] ?? 0) - (tagCounts[a.tag] ?? 0))
    .map(({ tag }) => tag)
    .slice(0, 3);
  if (shortRantTags.length > 0) {
    candidates.push({
      id: 'short-rants',
      weight: 3,
      prefix: 'And even some shorter rants on',
      tags: shortRantTags,
    });
  }

  if (hasTag(tagCounts, 'poems')) {
    candidates.push({
      id: 'poems',
      weight: 6,
      prefix: 'I have poems too over at',
      tags: ['poems'],
    });
  }

  if (hasTag(tagCounts, 'memoir')) {
    candidates.push({
      id: 'memoir',
      weight: 4,
      prefix: 'There are memoir-like pieces too under',
      tags: ['memoir'],
    });
  }

  if (hasTag(tagCounts, 'reflection')) {
    candidates.push({
      id: 'reflection',
      weight: 4,
      prefix: 'And direct reflection posts in',
      tags: ['reflection'],
    });
  }

  return candidates;
};

const pickWeighted = (pool: PreludeTemplateCandidate[]): PreludeTemplateCandidate | null => {
  const totalWeight = pool.reduce((sum, item) => sum + item.weight, 0);
  if (totalWeight <= 0) return null;
  let cursor = Math.random() * totalWeight;
  for (const item of pool) {
    cursor -= item.weight;
    if (cursor <= 0) return item;
  }
  return pool[pool.length - 1] ?? null;
};

export const selectWeightedPreludeTemplates = (
  candidates: PreludeTemplateCandidate[],
  maxItems: number,
): PreludeTemplateCandidate[] => {
  const selected: PreludeTemplateCandidate[] = [];
  const pool = [...candidates];
  while (selected.length < maxItems && pool.length > 0) {
    const next = pickWeighted(pool);
    if (!next) break;
    selected.push(next);
    const nextIndex = pool.findIndex((item) => item.id === next.id);
    if (nextIndex >= 0) pool.splice(nextIndex, 1);
  }
  return selected;
};
