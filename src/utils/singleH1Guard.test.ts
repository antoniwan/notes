import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();

function countRawH1(source: string): number {
  return (source.match(/<h1\b/gi) || []).length;
}

describe('single H1 guardrails', () => {
  it('BlogLayout has no raw <h1> (canonical H1 comes from PageHeader only)', () => {
    const src = readFileSync(join(root, 'src/layouts/BlogLayout.astro'), 'utf8');
    expect(countRawH1(src)).toBe(0);
    expect(src).toContain('PageHeader');
    expect(src).toMatch(/lg:sr-only/);
    expect(src).toMatch(/aria-hidden="true"/);
  });

  it('PageHeader is the only shared layout component that emits h1 by default', () => {
    const src = readFileSync(join(root, 'src/components/PageHeader.astro'), 'utf8');
    expect(src).toMatch(/as\?:\s*'h1'\s*\|\s*'p'/);
    expect(src).toMatch(/as = 'h1'/);
  });

  it('no layout/page emits more than one raw <h1> in source', () => {
    const dirs = ['src/layouts', 'src/pages', 'src/components'];
    const offenders: string[] = [];

    for (const dir of dirs) {
      const walk = (d: string) => {
        for (const entry of readdirSync(join(root, d), { withFileTypes: true })) {
          const rel = join(d, entry.name);
          if (entry.isDirectory()) {
            walk(rel);
            continue;
          }
          if (!entry.name.endsWith('.astro')) continue;
          const src = readFileSync(join(root, rel), 'utf8');
          const count = countRawH1(src);
          // PageHeader may reference h1 via dynamic tag; BrainScienceLayout has one intentional h1.
          if (count > 1) offenders.push(`${rel}: ${count} <h1>`);
        }
      };
      walk(dir);
    }

    expect(offenders).toEqual([]);
  });
});
