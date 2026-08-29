import { describe, expect, it } from 'vitest';
import {
  CONFIDENCE_WORDS,
  CURIOSITY_WORDS,
  EMOTIONAL_WORDS,
  INTELLECTUAL_WORDS,
  SENTIMENT_WORDS,
  VULNERABILITY_WORDS,
  WISDOM_WORDS,
} from './vocabulary';

function assertUnique(label: string, words: readonly string[]) {
  expect(new Set(words).size, `${label} has duplicates`).toBe(words.length);
}

describe('writing insights vocabulary', () => {
  it('keeps lexicon lists unique', () => {
    assertUnique('emotional', EMOTIONAL_WORDS);
    assertUnique('vulnerability', VULNERABILITY_WORDS);
    assertUnique('confidence', CONFIDENCE_WORDS);
    assertUnique('intellectual', INTELLECTUAL_WORDS);
    assertUnique('curiosity', CURIOSITY_WORDS);
    assertUnique('wisdom', WISDOM_WORDS);
    assertUnique('sentiment.positive', SENTIMENT_WORDS.positive);
    assertUnique('sentiment.negative', SENTIMENT_WORDS.negative);
    assertUnique('sentiment.neutral', SENTIMENT_WORDS.neutral);
  });

  it('includes Spanish affect tokens and drops hedge words from vulnerability', () => {
    expect(EMOTIONAL_WORDS).toContain('amor');
    expect(EMOTIONAL_WORDS).toContain('vergüenza');
    expect(VULNERABILITY_WORDS).not.toContain('maybe');
    expect(VULNERABILITY_WORDS).not.toContain('sometimes');
    expect(CONFIDENCE_WORDS).not.toContain('know');
  });
});
