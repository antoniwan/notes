import { describe, expect, it } from 'vitest';
import { PREFERRED_TAGS } from './tagVocabulary';
import { getTagCategory } from './tags';
import {
  TAG_FAMILIES,
  TAG_FAMILY_MEMBERS,
  getTagFamily,
  unassignedPreferredTags,
} from './tagFamilies';

const preferred = PREFERRED_TAGS as readonly string[];

describe('reader idea families', () => {
  it('assigns every preferred tag to exactly one family', () => {
    const seen = new Map<string, string>();
    for (const family of TAG_FAMILIES) {
      for (const tag of TAG_FAMILY_MEMBERS[family]) {
        expect(seen.has(tag), `${tag} assigned to both ${seen.get(tag)} and ${family}`).toBe(false);
        seen.set(tag, family);
        expect(preferred, `${tag} in ${family} is not preferred`).toContain(tag);
      }
    }

    expect(unassignedPreferredTags()).toEqual([]);
    expect(seen.size).toBe(preferred.length);
  });

  it('leaves long-tail tags in rest and follows aliases into families', () => {
    expect(getTagFamily('berserk')).toBe('rest');
    expect(getTagFamily('crimson-desert')).toBe('rest');
    expect(getTagFamily('limits')).toBe('rest');
    expect(getTagFamily('limites')).toBe('kinship');
    expect(getTagFamily('cooking')).toBe('kitchen');
    expect(getTagFamily('family')).toBe('kinship');
    expect(getTagFamily('puerto-rico')).toBe('island');
    expect(getTagFamily('consciousness')).toBe('inner');
    expect(getTagFamily('healing')).toBe('repair');
    expect(getTagFamily('personal-growth')).toBe('becoming');
    expect(getTagFamily('politics')).toBe('public');
    expect(getTagFamily('writing')).toBe('craft');
    expect(getTagFamily('poems')).toBe('craft');
  });

  it('is not Maslow — family color does not follow Insights buckets', () => {
    expect(getTagFamily('cooking')).toBe('kitchen');
    expect(getTagCategory('cooking')?.key).not.toBe('kitchen');
    expect(getTagFamily('fatherhood')).toBe('kinship');
    expect(getTagCategory('fatherhood')?.key).toBeDefined();
    expect(getTagCategory('fatherhood')?.key).not.toBe('kinship');
  });
});
