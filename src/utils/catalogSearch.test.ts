import { describe, expect, it } from 'vitest';
import { normalizeCatalogText } from './catalogSearch';

describe('normalizeCatalogText', () => {
  it('drops accents and letter case', () => {
    expect(normalizeCatalogText('Brené Brown')).toBe('brene brown');
    expect(normalizeCatalogText('PLÁTANO')).toBe('platano');
  });

  it('drops apostrophes, straight or curly, without splitting the word', () => {
    expect(normalizeCatalogText('Mia’s Cinnamon Pancakes')).toBe('mias cinnamon pancakes');
    expect(normalizeCatalogText("Mia's")).toBe('mias');
    expect(normalizeCatalogText('Miaʼs')).toBe('mias');
  });

  it('turns punctuation and spacing into single spaces', () => {
    expect(normalizeCatalogText('  Lemon-Pepper   Chicken!  ')).toBe('lemon pepper chicken');
    expect(normalizeCatalogText('[pollo|turkey]')).toBe('pollo turkey');
  });

  it('keeps digits and leaves punctuation-only text empty', () => {
    expect(normalizeCatalogText('Notes 2026')).toBe('notes 2026');
    expect(normalizeCatalogText('---')).toBe('');
  });
});
