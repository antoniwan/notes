import { describe, expect, it } from 'vitest';
import {
  CONTENT_FORM_TARGET_SLUGS,
  formatPreludeConnectors,
  getCanonicalContentFormLabel,
  toContentFormPreludeItems,
} from './contentFormTags';

describe('content-form grouping', () => {
  it('groups poem variants onto poems and links the poems slug', () => {
    const items = toContentFormPreludeItems({ poem: 1, poems: 1, poetry: 1 });
    const poems = items.find((item) => item.label === 'poems');
    expect(poems?.count).toBe(3);
    expect(poems?.href).toBe('/tag/poems');
  });

  it('keeps memoirs distinct from reflections', () => {
    const items = toContentFormPreludeItems({
      memoir: 2,
      reflection: 3,
    });
    expect(items.map((item) => item.label)).toEqual(['reflections', 'memoirs']);
    expect(items.find((item) => item.label === 'memoirs')?.href).toBe('/tag/memoir');
    expect(items.find((item) => item.label === 'reflections')?.href).toBe('/tag/reflection');
  });

  it('sorts by count then label', () => {
    const items = toContentFormPreludeItems({ memoir: 2, poems: 5, reflection: 2 });
    expect(items.map((item) => item.label)).toEqual(['poems', 'memoirs', 'reflections']);
  });

  it('maps display labels to canonical slugs and ignores empty form shelves', () => {
    expect(CONTENT_FORM_TARGET_SLUGS.memoirs).toBe('memoir');
    expect(CONTENT_FORM_TARGET_SLUGS.reflections).toBe('reflection');
    expect(getCanonicalContentFormLabel('poema')).toBe('poems');
    expect(getCanonicalContentFormLabel('ensayo')).toBeNull();
    expect(getCanonicalContentFormLabel('ideas')).toBeNull();
  });
});

describe('formatPreludeConnectors', () => {
  it('handles 1, 2, and many items', () => {
    expect(formatPreludeConnectors(1)).toEqual([' ']);
    expect(formatPreludeConnectors(2)).toEqual([' ', ' and ']);
    expect(formatPreludeConnectors(3)).toEqual([' ', ', ', ', and ']);
  });
});
