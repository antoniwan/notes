export interface ContentFormPreludeItem {
  label: string;
  href: string;
  count: number;
}

type ContentFormCanonicalLabel = (typeof CONTENT_FORM_CANONICAL_LABELS)[number];

export const CONTENT_FORM_CANONICAL_LABELS = [
  'essays',
  'ideas',
  'letters',
  'manifestos',
  'memoirs',
  'notes',
  'poems',
  'reflections',
  'songs',
  'stories',
] as const;

export const CONTENT_FORM_TARGET_SLUGS: Record<ContentFormCanonicalLabel, string> = {
  essays: 'essays',
  ideas: 'ideas',
  letters: 'letters',
  manifestos: 'manifestos',
  memoirs: 'memoir',
  notes: 'notes',
  poems: 'poems',
  reflections: 'reflection',
  songs: 'songs',
  stories: 'stories',
};

export const normalizeTagLabel = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const CONTENT_FORM_VARIANTS: Record<ContentFormCanonicalLabel, string[]> = {
  essays: ['essay', 'essays', 'ensayo', 'ensayos'],
  ideas: ['idea', 'ideas'],
  letters: ['letter', 'letters', 'carta', 'cartas'],
  manifestos: ['manifesto', 'manifestos', 'manifiesto', 'manifiestos'],
  memoirs: ['memoir', 'memoirs'],
  notes: ['note', 'notes', 'nota', 'notas'],
  poems: ['poem', 'poems', 'poema', 'poemas', 'poetry'],
  reflections: ['reflection', 'reflections'],
  songs: ['song', 'songs', 'cancion', 'canciones'],
  stories: ['story', 'stories', 'historia', 'historias'],
};

const contentFormVariantMap: Record<string, ContentFormCanonicalLabel> = {};
for (const canonical of CONTENT_FORM_CANONICAL_LABELS) {
  for (const variant of CONTENT_FORM_VARIANTS[canonical]) {
    contentFormVariantMap[normalizeTagLabel(variant)] = canonical;
  }
}

export const CONTENT_FORM_VARIANT_MAP = Object.freeze(contentFormVariantMap);

export const getCanonicalContentFormLabel = (value: string): ContentFormCanonicalLabel | null => {
  const normalized = normalizeTagLabel(value);
  return CONTENT_FORM_VARIANT_MAP[normalized] ?? null;
};

export const getContentFormTagGroups = (
  tagCounts: Record<string, number>,
): Array<{ label: ContentFormCanonicalLabel; count: number }> => {
  const grouped = new Map<ContentFormCanonicalLabel, number>();

  for (const [rawTag, count] of Object.entries(tagCounts)) {
    const canonical = getCanonicalContentFormLabel(rawTag);
    if (!canonical) continue;
    grouped.set(canonical, (grouped.get(canonical) ?? 0) + count);
  }

  return Array.from(grouped.entries()).map(([label, count]) => ({ label, count }));
};

export const sortContentFormItems = (
  items: Array<{ label: ContentFormCanonicalLabel; count: number }>,
): Array<{ label: ContentFormCanonicalLabel; count: number }> =>
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
    href: `/tag/${encodeURIComponent(CONTENT_FORM_TARGET_SLUGS[label])}`,
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
