import { describe, expect, it } from 'vitest';
import {
  explainLengthStability,
  explainPostingRegularity,
  explainRelativeGrade,
  explainTopicConsistency,
  postingRegularityFromIntervals,
  relativeLetterGrade,
  scoreToLetterGrade,
} from './grades';

describe('letter grades', () => {
  it('maps 0–100 bands including A and F', () => {
    expect(scoreToLetterGrade(97)).toBe('A+');
    expect(scoreToLetterGrade(93)).toBe('A');
    expect(scoreToLetterGrade(62)).toBe('D-');
    expect(scoreToLetterGrade(59)).toBe('F');
  });

  it('explains posting regularity from actual gaps', () => {
    const even = explainPostingRegularity([7, 7, 7, 7]);
    expect(even.grade).toBe('A+');
    expect(even.why).toMatch(/7–7 days/);
    expect(even.aLooksLike).toMatch(/An A/);

    const burst = explainPostingRegularity([1, 1, 90, 1]);
    expect(scoreToLetterGrade(burst.score) === burst.grade).toBe(true);
    expect(burst.score).toBeLessThan(even.score);
    expect(burst.why).toMatch(/this set is/);
  });

  it('explains topic concentration as share of this corpus', () => {
    const explained = explainTopicConsistency({
      topTag: 'fatherhood',
      topCount: 10,
      totalPosts: 100,
    });
    expect(explained.score).toBe(10);
    expect(explained.grade).toBe('F');
    expect(explained.why).toMatch(/fatherhood/);
    expect(explained.aLooksLike).toMatch(/93\+/);
  });

  it('explains length stability from mixed word counts', () => {
    const tight = explainLengthStability([800, 810, 790, 805]);
    const mixed = explainLengthStability([120, 4000, 200, 3500]);
    expect(tight.score).toBeGreaterThan(mixed.score);
    expect(mixed.why).toMatch(/120/);
    expect(mixed.aLooksLike).toMatch(/An A/);
  });

  it('explains relative grades against a chart max', () => {
    expect(relativeLetterGrade(93, 100)).toBe('A');
    const explained = explainRelativeGrade({
      metric: 'Words',
      value: 400,
      max: 2000,
      unit: 'words',
    });
    expect(explained.grade).toBe('F');
    expect(explained.why).toMatch(/20%/);
    expect(explained.aLooksLike).toMatch(/1860/);
  });

  it('keeps the posting formula aligned with 100 − variance/10', () => {
    expect(postingRegularityFromIntervals([10, 10, 10])).toBe(100);
  });
});
