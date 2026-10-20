/** Lowercase, accent-free, apostrophe-free text with every other non-letter run as one space. */
export function normalizeCatalogText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/['’ʼ]/gu, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}
