import { describe, expect, it } from 'vitest';
import { getCategoryDisplayItems, getCategoryNameFromIds } from './categoryUtils';

describe('category names', () => {
  it('uses the English name by default and the Spanish name on Spanish pages', () => {
    expect(getCategoryNameFromIds(['parenting'])).toBe('On parenting');
    expect(getCategoryNameFromIds(['parenting'], 'es')).toBe('Sobre la crianza');
  });

  it('keeps ids and order, and falls back to the raw id for unknown categories', () => {
    expect(getCategoryDisplayItems(['politics', 'unknown'], 'es')).toEqual([
      { id: 'politics', name: 'Sobre política', icon: '⚖️' },
      { id: 'unknown', name: 'unknown', icon: undefined },
    ]);
  });
});
