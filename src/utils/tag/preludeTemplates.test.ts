import { describe, expect, it } from 'vitest';
import {
  buildPreludeTemplateCandidates,
  formatPreludeConnectors,
  orderPreludeTemplates,
  PRELUDE_NOW,
  selectPreludeTemplates,
} from './preludeTemplates';

const counts = (entries: Record<string, number>): Record<string, number> => entries;

describe('buildPreludeTemplateCandidates', () => {
  it('opens family, public life, island, kitchen, and craft axes when those tags exist', () => {
    const candidates = buildPreludeTemplateCandidates({
      tagCounts: counts({
        poems: 2,
        fatherhood: 12,
        parenting: 19,
        family: 17,
        consciousness: 41,
        healing: 38,
        'self-reflection': 32,
        'inner-work': 1,
        'social-issues': 11,
        politics: 8,
        'systemic-critique': 8,
        'puerto-rico': 4,
        culture: 7,
        colonialism: 2,
        cooking: 3,
        food: 2,
        recipes: 2,
        'learning-projects': 8,
        technology: 13,
        writing: 2,
      }),
    });
    const ids = candidates.map((item) => item.id);
    expect(ids).toEqual(
      expect.arrayContaining([
        'poems',
        'family',
        'inner-work',
        'public-life',
        'island',
        'kitchen',
        'craft',
      ]),
    );
    expect(candidates.find((item) => item.id === 'family')?.tags).toEqual([
      'fatherhood',
      'parenting',
      'family',
    ]);
    expect(candidates.find((item) => item.id === 'island')?.tags[0]).toBe('puerto-rico');
    expect(candidates.find((item) => item.id === 'inner-work')?.tags[0]).toBe('inner-work');
    expect(candidates.find((item) => item.id === 'inner-work')?.tags).not.toContain('healing');
    for (const candidate of candidates) {
      expect(candidate.prefix.toLowerCase()).not.toMatch(/i'?ve written|i have |some notes are/);
    }
  });

  it('does not emit an axis when too few of its tags are present', () => {
    const candidates = buildPreludeTemplateCandidates({
      tagCounts: counts({ cooking: 3 }),
    });
    expect(candidates.map((item) => item.id)).not.toContain('kitchen');
  });
});

describe('selectPreludeTemplates', () => {
  it('picks a stable highest-weight set', () => {
    const candidates = [
      { id: 'family', weight: 4, prefix: 'family', tags: ['parenting'] },
      { id: 'poems', weight: 6, prefix: 'poems', tags: ['poems'] },
      { id: 'inner-work', weight: 5, prefix: 'inner', tags: ['healing'] },
      { id: 'voice', weight: 3, prefix: 'voice', tags: ['truth'] },
    ];
    expect(selectPreludeTemplates(candidates, 3).map((item) => item.id)).toEqual([
      'poems',
      'inner-work',
      'family',
    ]);
    expect(selectPreludeTemplates(candidates, 3).map((item) => item.id)).toEqual([
      'poems',
      'inner-work',
      'family',
    ]);
  });

  it('strips overlapping tags so a second inner-work sentence cannot reuse healing', () => {
    const selected = selectPreludeTemplates(
      [
        {
          id: 'inner-work',
          weight: 5,
          prefix: 'inner',
          tags: ['consciousness', 'healing', 'self-reflection'],
        },
        {
          id: 'emotional-work',
          weight: 5,
          prefix: 'emotional',
          tags: ['healing', 'therapy', 'mental-health'],
        },
        {
          id: 'family',
          weight: 4,
          prefix: 'family',
          tags: ['parenting', 'fatherhood', 'family'],
        },
      ],
      5,
    );
    expect(selected.map((item) => item.id)).toEqual(['emotional-work', 'inner-work', 'family']);
    expect(selected.find((item) => item.id === 'emotional-work')?.tags).toEqual([
      'healing',
      'therapy',
      'mental-health',
    ]);
    expect(selected.find((item) => item.id === 'inner-work')?.tags).toEqual([
      'consciousness',
      'self-reflection',
    ]);
  });

  it('skips a later axis when fewer than two unused tags remain', () => {
    const selected = selectPreludeTemplates(
      [
        { id: 'a', weight: 5, prefix: 'a', tags: ['healing', 'therapy'] },
        { id: 'b', weight: 4, prefix: 'b', tags: ['healing', 'therapy'] },
      ],
      5,
    );
    expect(selected.map((item) => item.id)).toEqual(['a']);
  });

  it('does not repeat excluded tags in later sentences', () => {
    const selected = selectPreludeTemplates(
      [
        { id: 'memoir', weight: 4, prefix: 'memoir', tags: ['memoir'] },
        { id: 'family', weight: 6, prefix: 'family', tags: ['parenting', 'family'] },
      ],
      5,
      { excludeTags: ['memoir', 'reflection'] },
    );
    expect(selected.map((item) => item.id)).toEqual(['family']);
  });
});

describe('formatPreludeConnectors', () => {
  it('handles 1, 2, and many items', () => {
    expect(formatPreludeConnectors(1)).toEqual([' ']);
    expect(formatPreludeConnectors(2)).toEqual([' ', ' and ']);
    expect(formatPreludeConnectors(3)).toEqual([' ', ', ', ', and ']);
  });
});

describe('orderPreludeTemplates', () => {
  const NOW = new Date('2026-10-22T00:00:00Z');
  const daysAgo = (days: number) => new Date(NOW.valueOf() - days * 24 * 60 * 60 * 1000);
  const sentence = (id: string, tags: string[]) => ({ id, weight: 1, prefix: id, tags });

  const templates = [
    sentence('poems', ['poems']),
    sentence('family', ['fatherhood', 'parenting']),
    sentence('study', ['philosophy']),
    sentence('compass', ['values']),
    sentence('island', ['puerto-rico']),
  ];
  const posts = [
    { tags: ['poems'], pubDate: daysAgo(400) },
    { tags: ['fatherhood'], pubDate: daysAgo(500) },
    { tags: ['philosophy'], pubDate: daysAgo(30) },
    { tags: ['values'], pubDate: daysAgo(200) },
    { tags: ['values'], pubDate: daysAgo(210) },
    { tags: ['values', 'puerto-rico'], pubDate: daysAgo(5) },
  ];

  it('puts the pinned sentences first, in pin order, even when their writing is old', () => {
    const ordered = orderPreludeTemplates(templates, posts, {
      now: NOW,
      pinned: ['family', 'island'],
    });
    expect(ordered.slice(0, 2).map((item) => item.id)).toEqual(['family', 'island']);
    expect(ordered[0].pinned).toBe(true);
    expect(ordered[0].quiet).toBe(false);
  });

  it('ranks the rest by recent writing, then sinks the quiet ones', () => {
    const ordered = orderPreludeTemplates(templates, posts, { now: NOW, pinned: [] });
    expect(ordered.map((item) => item.id)).toEqual([
      'compass',
      'island',
      'study',
      'poems',
      'family',
    ]);
    expect(ordered.filter((item) => item.quiet).map((item) => item.id)).toEqual([
      'poems',
      'family',
    ]);
  });

  it('counts a writing once per sentence, newer writing counting more', () => {
    const [compass] = orderPreludeTemplates(
      [sentence('compass', ['values', 'truth'])],
      [{ tags: ['values', 'truth'], pubDate: NOW }],
      { now: NOW, pinned: [] },
    );
    expect(compass.score).toBe(1);
  });

  it('pins sentences that exist', () => {
    const ids = buildPreludeTemplateCandidates({
      tagCounts: counts({
        fatherhood: 3,
        parenting: 3,
        'puerto-rico': 3,
        culture: 3,
        politics: 3,
        power: 3,
        technology: 3,
        writing: 3,
      }),
    }).map((item) => item.id);
    for (const id of PRELUDE_NOW) expect(ids).toContain(id);
  });

  it('sends the kitchen sentence on to Cookbook', () => {
    const kitchen = buildPreludeTemplateCandidates({
      tagCounts: counts({ cooking: 3, food: 2 }),
    }).find((item) => item.id === 'kitchen');
    expect(kitchen?.link?.href).toBe('https://cookbook.antoniwan.online/');
  });
});
