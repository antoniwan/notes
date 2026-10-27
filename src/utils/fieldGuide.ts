import { getCollection, type CollectionEntry } from 'astro:content';
import {
  FIELD_GUIDE_SHELVES,
  fieldGuideEntryPath,
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
  return shelves.flat().sort((a, b) => a.entry.data.title.localeCompare(b.entry.data.title));
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
