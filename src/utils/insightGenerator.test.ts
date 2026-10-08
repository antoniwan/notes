import { describe, expect, it } from 'vitest';
import { streakCycleRatio } from './insightGenerator';

describe('streakCycleRatio', () => {
  it('returns null when both lists are empty, so the page never shows NaN%', () => {
    expect(streakCycleRatio([], [])).toBeNull();
  });

  it('is streaks over streaks-plus-gaps', () => {
    expect(streakCycleRatio([1, 2], [1])).toBe(2 / 3);
    expect(streakCycleRatio([1], [])).toBe(1);
    expect(streakCycleRatio([], [1])).toBe(0);
  });
});
