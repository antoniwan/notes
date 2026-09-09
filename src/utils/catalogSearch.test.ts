import { describe, expect, it } from 'vitest';
import { matchesCatalogSearch } from './catalogSearch';

describe('matchesCatalogSearch', () => {
  it('matches without requiring accents or matching letter case', () => {
    expect(matchesCatalogSearch('BRENE', 'Brené Brown')).toBe(true);
    expect(matchesCatalogSearch('platano', 'Plátano')).toBe(true);
  });

  it('matches words across title and author in either order', () => {
    expect(matchesCatalogSearch('aurelius meditations', 'Meditations', 'Marcus Aurelius')).toBe(
      true,
    );
  });

  it('allows omitted words in a dish name', () => {
    expect(matchesCatalogSearch('pollo arroz', 'Arroz con Pollo')).toBe(true);
  });

  it('treats punctuation and spacing as word boundaries', () => {
    expect(matchesCatalogSearch('  lemon pepper  ', 'Lemon-Pepper Chicken Thighs')).toBe(true);
    expect(matchesCatalogSearch('mias', 'Mia’s Cinnamon Pancakes')).toBe(true);
    expect(matchesCatalogSearch('mias', "Mia's Cinnamon Pancakes")).toBe(true);
    expect(matchesCatalogSearch('mia cinnamon', 'Mia’s Cinnamon Pancakes')).toBe(true);
  });

  it('preserves partial-word matching while typing', () => {
    expect(matchesCatalogSearch('medit', 'Meditations')).toBe(true);
  });

  it('requires all meaningful search words to match', () => {
    expect(matchesCatalogSearch('arroz turkey', 'Arroz con Pollo')).toBe(false);
  });

  it('shows all entries for a blank or punctuation-only query', () => {
    expect(matchesCatalogSearch('   ', 'Meditations')).toBe(true);
    expect(matchesCatalogSearch('---', 'Sofrito')).toBe(true);
  });

  it('does not treat search text as an expression', () => {
    expect(matchesCatalogSearch('[pollo|turkey]', 'Arroz con Pollo')).toBe(false);
  });
});
