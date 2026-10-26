import { describe, expect, it } from 'vitest';
import { calculateReadingTimeFromMarkdown, localizeReadingTime } from './readingTime';

describe('localizeReadingTime', () => {
  it('keeps the English label', () => {
    expect(localizeReadingTime('30 min read', 'en')).toBe('30 min read');
  });

  it('says it in Spanish for Spanish posts', () => {
    expect(localizeReadingTime('30 min read', 'es')).toBe('30 min de lectura');
  });
});

describe('calculateReadingTimeFromMarkdown', () => {
  it('skips collapsed details blocks and MDX imports', () => {
    const credits = Array.from({ length: 2000 }, () => 'credit').join(' ');
    const markdown = [
      "import Rotator from '../../components/ImageRotator.astro';",
      'A short paragraph.',
      `<details>\n<summary>Credits</summary>\n\n${credits}\n\n</details>`,
    ].join('\n\n');
    expect(calculateReadingTimeFromMarkdown(markdown)).toBe('1 min read');
  });
});
