import { describe, expect, it } from 'vitest';
import { TABLE_SCROLL_CLASS } from './rehypeWrapTables.mjs';
import {
  preparePostHtml,
  stripHeadingMarkup,
  unwrapHeadingEmphasis,
  wrapTablesInHtml,
} from './wrapTablesInHtml';

describe('wrapTablesInHtml', () => {
  it('wraps a bare table and leaves surrounding markup alone', () => {
    const html = '<h2>Title</h2><table><tr><td>A</td></tr></table><p>After</p>';
    expect(wrapTablesInHtml(html)).toBe(
      `<h2>Title</h2><div class="${TABLE_SCROLL_CLASS}"><table><tr><td>A</td></tr></table></div><p>After</p>`,
    );
  });

  it('does not double-wrap a table already in the scroll container', () => {
    const html = `<div class="${TABLE_SCROLL_CLASS}"><table><tr><td>A</td></tr></table></div>`;
    expect(wrapTablesInHtml(html)).toBe(html);
  });
});

describe('unwrapHeadingEmphasis', () => {
  it('unwraps a heading whose only child is strong', () => {
    expect(
      unwrapHeadingEmphasis('<h3 id="2-joy"><strong>2. Joy over validation</strong></h3>'),
    ).toBe('<h3 id="2-joy">2. Joy over validation</h3>');
  });

  it('flattens inline italics inside a heading', () => {
    expect(unwrapHeadingEmphasis('<h2>Post-Fast Ritual: <em>Ground + Flow</em></h2>')).toBe(
      '<h2>Post-Fast Ritual: Ground + Flow</h2>',
    );
  });

  it('leaves emphasis in body copy alone', () => {
    const html = '<h2>Hello</h2><p>Keep <strong>this</strong> and <em>that</em>.</p>';
    expect(unwrapHeadingEmphasis(html)).toBe(html);
  });
});

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
});

describe('preparePostHtml', () => {
  it('unwraps heading bold even when the post has no table', () => {
    expect(preparePostHtml('<h3><strong>2. Joy over validation</strong></h3><p>Hi</p>')).toBe(
      '<h3>2. Joy over validation</h3><p>Hi</p>',
    );
  });
});
