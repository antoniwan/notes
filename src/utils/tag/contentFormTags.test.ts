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

  it('keeps ideas and notes distinct from reflections', () => {
    const items = toContentFormPreludeItems({
      ideas: 2,
      notes: 4,
      reflection: 3,
    });
    expect(items.map((item) => item.label)).toEqual(['notes', 'reflections', 'ideas']);
    expect(items.find((item) => item.label === 'ideas')?.href).toBe('/tag/ideas');
    expect(items.find((item) => item.label === 'notes')?.href).toBe('/tag/notes');
    expect(items.find((item) => item.label === 'reflections')?.href).toBe('/tag/reflection');
  });

  it('sorts by count then label', () => {
    const items = toContentFormPreludeItems({ stories: 2, letters: 2, poems: 5 });
    expect(items.map((item) => item.label)).toEqual(['poems', 'letters', 'stories']);
  });

  it('maps display labels to canonical slugs', () => {
    expect(CONTENT_FORM_TARGET_SLUGS.memoirs).toBe('memoir');
    expect(CONTENT_FORM_TARGET_SLUGS.reflections).toBe('reflection');
    expect(getCanonicalContentFormLabel('ensayo')).toBe('essays');
  });
});

describe('formatPreludeConnectors', () => {
  it('handles 1, 2, and many items', () => {
    expect(formatPreludeConnectors(1)).toEqual([' ']);
    expect(formatPreludeConnectors(2)).toEqual([' ', ' and ']);
    expect(formatPreludeConnectors(3)).toEqual([' ', ', ', ', and ']);
  });
});
