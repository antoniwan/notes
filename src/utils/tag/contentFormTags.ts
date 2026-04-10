export interface ContentFormPreludeItem {
  label: string;
  href: string;
  count: number;
}

export const CONTENT_FORM_CANONICAL_LABELS = [
  'essays',
  'ideas',
  'letters',
  'manifestos',
  'notes',
  'poems',
  'songs',
  'stories',
] as const;

export const normalizeTagLabel = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const CONTENT_FORM_VARIANTS: Record<(typeof CONTENT_FORM_CANONICAL_LABELS)[number], string[]> = {
  essays: ['essay', 'essays', 'ensayo', 'ensayos'],
  ideas: ['idea', 'ideas'],
  letters: ['letter', 'letters', 'carta', 'cartas'],
  manifestos: ['manifesto', 'manifestos', 'manifiesto', 'manifiestos'],
  notes: ['note', 'notes', 'nota', 'notas'],
  poems: ['poem', 'poems', 'poema', 'poemas'],
  songs: ['song', 'songs', 'cancion', 'canciones', 'canción', 'canciónes'],
  stories: ['story', 'stories', 'historia', 'historias'],
};

export const CONTENT_FORM_VARIANT_MAP = Object.freeze(
  Object.entries(CONTENT_FORM_VARIANTS).reduce<Record<string, string>>(
    (acc, [canonical, variants]) => {
      for (const variant of variants) {
        acc[normalizeTagLabel(variant)] = canonical;
      }

      return acc;
    },
    {},
  ),
);

export const getCanonicalContentFormLabel = (value: string): string | null => {
  const normalized = normalizeTagLabel(value);
  return CONTENT_FORM_VARIANT_MAP[normalized] ?? null;
};

export const getContentFormTagGroups = (
  tagCounts: Record<string, number>,
): Array<{ label: string; count: number }> => {
  const grouped = new Map<string, number>();

  for (const [rawTag, count] of Object.entries(tagCounts)) {
    const canonical = getCanonicalContentFormLabel(rawTag);
    if (!canonical) continue;
    grouped.set(canonical, (grouped.get(canonical) ?? 0) + count);
  }

  return Array.from(grouped.entries()).map(([label, count]) => ({ label, count }));
};

export const sortContentFormItems = (
  items: Array<{ label: string; count: number }>,
): Array<{ label: string; count: number }> =>
  [...items].sort((a, b) => {
    if (b.count !== a.count) {
      return b.count - a.count;
    }
    return a.label.localeCompare(b.label);
  });

export const toContentFormPreludeItems = (
  tagCounts: Record<string, number>,
): ContentFormPreludeItem[] =>
  sortContentFormItems(getContentFormTagGroups(tagCounts)).map(({ label, count }) => ({
    label,
    count,
    href: `/tag/${encodeURIComponent(label)}/`,
  }));

export const formatPreludeConnectors = (itemsCount: number): string[] => {
  if (itemsCount <= 0) return [];
  if (itemsCount === 1) return [' '];
  if (itemsCount === 2) return [' ', ' and '];

  return Array.from({ length: itemsCount }, (_, index) => {
    if (index === 0) return ' ';
    if (index === itemsCount - 1) return ', and ';
    return ', ';
  });
};
