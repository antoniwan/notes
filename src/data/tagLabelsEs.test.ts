import fs from 'node:fs';
import path from 'node:path';
import { load } from 'js-yaml';
import { describe, expect, it } from 'vitest';
import { canonicalizeTag } from '../utils/tagVocabulary';
import { TAG_LABELS_ES, tagLabel } from './tagLabelsEs';

function spanishPostTags(): string[] {
  const dir = path.join('src', 'content', 'p');
  const tags = new Set<string>();
  for (const file of fs.readdirSync(dir).filter((name) => name.endsWith('.md'))) {
    const raw = fs.readFileSync(path.join(dir, file), 'utf8');
    const frontmatter = raw.match(/^---\n([\s\S]*?)\n---/)?.[1];
    if (!frontmatter) continue;
    const data = load(frontmatter) as { language?: string[]; tags?: string[] };
    if (data.language?.[0] !== 'es') continue;
    for (const tag of data.tags ?? []) tags.add(canonicalizeTag(tag));
  }
  return [...tags];
}

describe('Spanish tag labels', () => {
  it('cover every tag on a Spanish post', () => {
    const missing = spanishPostTags().filter((tag) => !(tag in TAG_LABELS_ES));
    expect(missing).toEqual([]);
  });

  it('keep boundaries and limits apart', () => {
    expect(TAG_LABELS_ES.boundaries).not.toBe(TAG_LABELS_ES.limits);
  });

  it('labels Spanish aliases through their canonical tag, and leaves English pages alone', () => {
    expect(tagLabel('crianza', 'es')).toBe('crianza');
    expect(tagLabel('fatherhood', 'es')).toBe('paternidad');
    expect(tagLabel('fatherhood')).toBe('fatherhood');
  });
});
