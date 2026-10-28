import { getCollection, type CollectionEntry } from 'astro:content';
import {
  FIELD_GUIDE_SHELVES,
  fieldGuideEntryPath,
  fieldGuideSortKey,
  fieldGuideKinds,
  type FieldGuideKind,
  type FieldGuideLang,
} from '../data/fieldGuide';

export type FieldGuideEntry =
  CollectionEntry<'concepts'> | CollectionEntry<'values'> | CollectionEntry<'beliefs'>;

export interface ShelvedEntry {
  kind: FieldGuideKind;
  entry: FieldGuideEntry;
  path: string;
}

/** Every published entry, all shelves and languages, sorted by title. */
export async function getFieldGuide(): Promise<ShelvedEntry[]> {
  const shelves = await Promise.all(
    fieldGuideKinds.map(async (kind) => {
      const entries: FieldGuideEntry[] = await getCollection(kind, ({ data }) => !data.draft);
      return entries.map((entry) => ({
        kind,
        entry,
        path: fieldGuideEntryPath(kind, entry.data.language, entry.id),
      }));
    }),
  );
  return shelves
    .flat()
    .sort((a, b) =>
      fieldGuideSortKey(a.entry.data.title).localeCompare(fieldGuideSortKey(b.entry.data.title)),
    );
}

/** Static paths for one language's entry route (`[kind]/[slug]`). */
export async function fieldGuidePaths(lang: FieldGuideLang) {
  const all = await getFieldGuide();
  return all
    .filter(({ entry }) => entry.data.language === lang)
    .map((item) => ({
      params: { kind: FIELD_GUIDE_SHELVES[item.kind][lang].segment, slug: item.entry.id },
      props: { item, twin: twinOf(all, item) },
    }));
}

/** The same entry in the other language, when one exists. */
export function twinOf(all: ShelvedEntry[], item: ShelvedEntry): ShelvedEntry | undefined {
  const group = item.entry.data.translationGroup;
  if (!group) return undefined;
  return all.find(
    (other) =>
      other.kind === item.kind &&
      other.entry.data.translationGroup === group &&
      other.entry.data.language !== item.entry.data.language,
  );
}

/** Static paths for one language's shelf route (`[kind]`). */
export function fieldGuideShelfPaths(lang: FieldGuideLang) {
  return fieldGuideKinds.map((kind) => ({
    params: { kind: FIELD_GUIDE_SHELVES[kind][lang].segment },
    props: { kind },
  }));
}

function escapeHtml(text: string) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * The dictionary sense of an entry: the first paragraph under its first
 * heading, with links flattened to text and only italics and bold kept.
 */
export function fieldGuideDefinition(body: string | undefined, fallback = ''): string {
  if (!body) return escapeHtml(fallback);
  const section = body.split(/^## .*$/m)[1] ?? body;
  const paragraph =
    section
      .trim()
      .split(/\n\s*\n/)
      .find((block) => !/^\s*[-*]\s/.test(block)) ?? '';
  // A paragraph that only leads into a list doesn't stand alone; use the summary.
  if (!paragraph || paragraph.trim().endsWith(':')) return escapeHtml(fallback);
  return escapeHtml(paragraph.replace(/\s*\n\s*/g, ' ').trim())
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[\s(“"])_([^_]+)_/g, '$1<em>$2</em>');
}
