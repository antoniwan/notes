# Field Guide

Notes (`src/content/p`) are Antonio's: dated, finished, and arguing something. The Field Guide is for the reader: short entries that explain one thing each and get revised in place.

## Shelves

| Shelf    | Folder                  | URL (EN / ES)                                                         |
| -------- | ----------------------- | --------------------------------------------------------------------- |
| Concepts | `src/content/concepts/` | `/field-guide/concepts/<slug>` / `/es/guia-de-campo/conceptos/<slug>` |
| Values   | `src/content/values/`   | `/field-guide/values/<slug>` / `/es/guia-de-campo/valores/<slug>`     |
| Beliefs  | `src/content/beliefs/`  | `/field-guide/beliefs/<slug>` / `/es/guia-de-campo/creencias/<slug>`  |

Shelf names, URL segments, and blurbs live in `src/data/fieldGuide.ts`.

## Adding an entry

Every entry is hand-crafted, usually from a note in Panda. Nothing syncs from the vault.

1. Write one file per language. The filename is the slug, so the Spanish twin gets a Spanish filename.
2. Give both files the same `translationGroup`.
3. Frontmatter:

```yaml
title: Locus of control
summary: One sentence, shown under the title and on the shelf.
language: en # or es
translationGroup: locus-of-control
revised: 2026-10-27 # bump when the entry changes
origin: Julian Rotter, psychologist (1966) # concepts only, when someone else named it
topic: dignity # beliefs only; the shelf reads "On dignity"
draft: false
```

4. Body, in this order: what it is, how it shows up for me, go next (links to related entries or posts).

## Rules

- The test for inclusion is "would this help someone", not "did Antonio coin it". Credit the origin.
- Write it so any reader can relate. Antonio is the example, not the subject.
- When a belief is one he sometimes fails, say so in a line.
- Current wording only, with "Last revised". Add an "I used to think" line by hand only when the change helps a reader.
- Never publish from Panda's People, Lies, Shadows, or "My Lens on" notes.
