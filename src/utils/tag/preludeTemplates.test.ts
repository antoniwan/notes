import { describe, expect, it } from 'vitest';
import { buildPreludeTemplateCandidates, selectPreludeTemplates } from './preludeTemplates';

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

  it('does not repeat form-line tags in theme sentences', () => {
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
