import { describe, expect, it } from 'vitest';
import { stripHeadingMarkup } from './headingText';

describe('stripHeadingMarkup', () => {
  it('strips wrapping bold from a TOC label', () => {
    expect(stripHeadingMarkup('**2. Joy over validation**')).toBe('2. Joy over validation');
  });

  it('strips inline italics from a TOC label', () => {
    expect(stripHeadingMarkup('Post-Fast Ritual: _Ground + Flow_')).toBe(
      'Post-Fast Ritual: Ground + Flow',
    );
    expect(
      stripHeadingMarkup(
        'What My Kids Are Teaching Me (That I Keep Forgetting, _and remembering..._)',
      ),
    ).toBe('What My Kids Are Teaching Me (That I Keep Forgetting, and remembering...)');
  });

  it('strips backticks so code spans read as plain labels', () => {
    expect(stripHeadingMarkup('Using `getCollection` well')).toBe('Using getCollection well');
  });
});
