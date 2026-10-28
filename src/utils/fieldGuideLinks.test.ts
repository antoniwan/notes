import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  FIELD_GUIDE_ROOT,
  fieldGuideEntryPath,
  fieldGuideKinds,
  fieldGuideShelfPath,
} from '../data/fieldGuide';
import { PAGE_REDIRECTS } from './seoRouting';

// A link into the Field Guide from any entry or post must land on a page that
// is built, or on a redirect to one. Entries are merged and renamed by hand, and
// a link to the wrong shelf (a value linked as a concept) is an easy 404.
const CONTENT = path.resolve(__dirname, '../content');

function markdownFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return markdownFiles(full);
    return /\.mdx?$/.test(entry.name) ? [full] : [];
  });
}

function builtGuidePaths(): Set<string> {
  const paths = new Set<string>([FIELD_GUIDE_ROOT.en, FIELD_GUIDE_ROOT.es]);
  for (const kind of fieldGuideKinds) {
    paths.add(fieldGuideShelfPath(kind, 'en'));
    paths.add(fieldGuideShelfPath(kind, 'es'));
    for (const file of markdownFiles(path.join(CONTENT, kind))) {
      const raw = fs.readFileSync(file, 'utf8');
      if (/^draft:\s*true/m.test(raw)) continue;
      const lang = /^language:\s*es\b/m.test(raw) ? 'es' : 'en';
      paths.add(fieldGuideEntryPath(kind, lang, path.basename(file).replace(/\.mdx?$/, '')));
    }
  }
  return paths;
}

const sources = ['p', ...fieldGuideKinds].flatMap((dir) => markdownFiles(path.join(CONTENT, dir)));

describe('links into the Field Guide', () => {
  it('all resolve to a built entry, shelf, or redirect', () => {
    const built = builtGuidePaths();
    const broken: string[] = [];
    for (const file of sources) {
      const raw = fs.readFileSync(file, 'utf8');
      for (const [, href] of raw.matchAll(/\]\(((?:\/field-guide|\/es\/guia-de-campo)[^)\s#]*)/g)) {
        const target = href.replace(/\/$/, '');
        if (!built.has(target) && !PAGE_REDIRECTS[target]) {
          broken.push(`${path.relative(CONTENT, file)} → ${href}`);
        }
      }
    }
    expect(broken).toEqual([]);
  });

  it('link to posts without a trailing slash, which would cost a redirect', () => {
    const slashed = sources.flatMap((file) =>
      [...fs.readFileSync(file, 'utf8').matchAll(/\]\((\/p\/[^)#\s]+\/)\)/g)].map(
        ([, href]) => `${path.relative(CONTENT, file)} → ${href}`,
      ),
    );
    expect(slashed).toEqual([]);
  });
});
