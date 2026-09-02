import { describe, expect, it } from 'vitest';
import { PREFERRED_TAGS } from './tagVocabulary';
import {
  getTagCategory,
  getTagMetadata,
  getTagWeight,
  MASLOW_CATEGORIES,
  MASLOW_TAGS_BY_KEY,
  TAG_METADATA,
  TAG_WEIGHT_OVERRIDES,
  TAG_WEIGHTS,
} from './tags';

const preferred = PREFERRED_TAGS as readonly string[];

describe('tag analytics follow preferred vocabulary', () => {
  it('gives every preferred tag a weight of at least 4 and unknown tags the default 1', () => {
    for (const tag of preferred) {
      expect(getTagWeight(tag), tag).toBeGreaterThanOrEqual(4);
    }
    expect(getTagWeight('consciousness')).toBe(10);
    expect(getTagWeight('poems')).toBe(4);
    expect(getTagWeight('berserk')).toBe(1);
    expect(getTagWeight('wezterm')).toBe(1);
  });

  it('does not keep alias leftovers or dead terminal keys in TAG_WEIGHTS', () => {
    expect(TAG_WEIGHTS.wellness).toBeUndefined();
    expect(TAG_WEIGHTS['self-discovery']).toBeUndefined();
    expect(TAG_WEIGHTS.wezterm).toBeUndefined();
    expect(TAG_WEIGHTS.fzf).toBeUndefined();
    expect(TAG_WEIGHTS.nvm).toBeUndefined();
  });

  it('only overrides weights for preferred slugs that are not the default 4', () => {
    for (const [tag, weight] of Object.entries(TAG_WEIGHT_OVERRIDES)) {
      expect(preferred, tag).toContain(tag);
      expect(weight, tag).not.toBe(4);
      expect(TAG_WEIGHTS[tag]).toBe(weight);
    }
  });

  it('places every preferred tag in exactly one Maslow bucket', () => {
    const seen = new Map<string, string>();
    for (const category of MASLOW_CATEGORIES) {
      for (const tag of category.tags) {
        expect(seen.has(tag), `${tag} duplicated in ${seen.get(tag)} and ${category.key}`).toBe(
          false,
        );
        seen.set(tag, category.key);
        expect(preferred, `${tag} in Maslow is not preferred`).toContain(tag);
      }
    }

    const missing = preferred.filter((tag) => !seen.has(tag));
    expect(missing).toEqual([]);
    expect(seen.size).toBe(preferred.length);
  });

  it('builds metadata for every preferred tag from weight + Maslow + display name', () => {
    for (const tag of preferred) {
      const metadata = getTagMetadata(tag);
      expect(metadata.name.length).toBeGreaterThan(0);
      expect(metadata.weight).toBe(getTagWeight(tag));
      expect(metadata.category, tag).toBe(getTagCategory(tag)?.key);
      expect(TAG_METADATA[tag]).toEqual(metadata);
    }
    expect(getTagMetadata('poems').description).toMatch(/poem/i);
    expect(getTagMetadata('love').description).toMatch(/closeness/i);
    expect(getTagMetadata('crimson-desert').name).toBe('Crimson Desert');
    expect(getTagMetadata('crimson-desert').category).toBeUndefined();
  });

  it('keeps Maslow key lists aligned with exported categories', () => {
    for (const [key, tags] of Object.entries(MASLOW_TAGS_BY_KEY)) {
      const category = MASLOW_CATEGORIES.find((entry) => entry.key === key);
      expect(category?.tags).toEqual([...tags]);
    }
  });
});
