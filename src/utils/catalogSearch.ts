function normalizeCatalogText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/['’ʼ]/gu, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

/** Match every search word, regardless of case, accents, punctuation, or word order. */
export function matchesCatalogSearch(query: string, ...values: string[]): boolean {
  const words = normalizeCatalogText(query).split(/\s+/).filter(Boolean);
  const text = normalizeCatalogText(values.join(' '));
  return words.every((word) => text.includes(word));
}
