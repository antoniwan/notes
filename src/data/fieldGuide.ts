/**
 * The Field Guide: short, reader-first entries that sit beside the Notes.
 * Notes are dated and argue something; an entry explains one thing and gets
 * revised in place. Three shelves, each its own content collection.
 */
export type FieldGuideLang = 'en' | 'es';

export const fieldGuideKinds = ['concepts', 'values', 'beliefs'] as const;
export type FieldGuideKind = (typeof fieldGuideKinds)[number];

interface ShelfCopy {
  /** Shelf name, as a heading. */
  name: string;
  /** Singular label for an entry's eyebrow. */
  singular: string;
  /** URL segment under the Field Guide root. */
  segment: string;
  blurb: string;
}

export const FIELD_GUIDE_ROOT = {
  en: '/field-guide',
  es: '/es/guia-de-campo',
} as const satisfies Record<FieldGuideLang, string>;

export const FIELD_GUIDE_COPY: Record<
  FieldGuideLang,
  { title: string; description: string; revised: string; origin: string; topic: string }
> = {
  en: {
    title: 'Field Guide',
    description:
      'Short entries on the concepts, values, and beliefs I keep coming back to. Each one explains one thing, and gets revised when I learn more.',
    revised: 'Last revised',
    origin: 'Where it comes from',
    topic: 'On',
  },
  es: {
    title: 'Guía de campo',
    description:
      'Entradas cortas sobre los conceptos, valores y creencias a los que siempre regreso. Cada una explica una sola cosa, y la reviso cuando aprendo más.',
    revised: 'Revisado por última vez',
    origin: 'De dónde viene',
    topic: 'Sobre',
  },
};

export const FIELD_GUIDE_SHELVES: Record<FieldGuideKind, Record<FieldGuideLang, ShelfCopy>> = {
  concepts: {
    en: {
      name: 'Concepts',
      singular: 'Concept',
      segment: 'concepts',
      blurb: 'Ideas that help explain how people and things work.',
    },
    es: {
      name: 'Conceptos',
      singular: 'Concepto',
      segment: 'conceptos',
      blurb: 'Ideas que ayudan a explicar cómo funcionan las personas y las cosas.',
    },
  },
  values: {
    en: {
      name: 'Values',
      singular: 'Value',
      segment: 'values',
      blurb: 'What I choose to live by, and what that looks like on an ordinary day.',
    },
    es: {
      name: 'Valores',
      singular: 'Valor',
      segment: 'valores',
      blurb: 'Lo que elijo como guía, y cómo se ve eso en un día cualquiera.',
    },
  },
  beliefs: {
    en: {
      name: 'Beliefs',
      singular: 'Belief',
      segment: 'beliefs',
      blurb: 'Things I hold to be true, written so anyone could hold them too.',
    },
    es: {
      name: 'Creencias',
      singular: 'Creencia',
      segment: 'creencias',
      blurb: 'Cosas que tengo por ciertas, escritas para que cualquiera pueda tenerlas también.',
    },
  },
};

export function fieldGuideEntryPath(kind: FieldGuideKind, lang: FieldGuideLang, slug: string) {
  return `${FIELD_GUIDE_ROOT[lang]}/${FIELD_GUIDE_SHELVES[kind][lang].segment}/${slug}`;
}
