import { describe, expect, it } from 'vitest';
import { poemToHtml, rehypePoemLines } from './rehypePoemLines.mjs';

type UnistNode = { type: string; value?: string; children?: UnistNode[] };

describe('rehypePoemLines', () => {
  it('splits a poem into stanzas and lines, keeping inline markup', () => {
    expect(poemToHtml('one\n<strong>two</strong>\n\nthree')).toBe(
      '<div class="a-poem">' +
        '<p class="poem-stanza"><span class="poem-line">one</span><span class="poem-line"><strong>two</strong></span></p>' +
        '<p class="poem-stanza"><span class="poem-line">three</span></p>' +
        '</div>',
    );
  });

  it('rewrites raw poem blocks and leaves other raw HTML alone', () => {
    const tree: UnistNode = {
      type: 'root',
      children: [
        { type: 'raw', value: '<pre class="a-poem">\nhello\nworld\n</pre>' },
        { type: 'raw', value: '<pre>code\n</pre>' },
      ],
    };

    rehypePoemLines()(tree);

    expect(tree.children?.[0]?.value).toBe(
      '<div class="a-poem"><p class="poem-stanza"><span class="poem-line">hello</span><span class="poem-line">world</span></p></div>',
    );
    expect(tree.children?.[1]?.value).toBe('<pre>code\n</pre>');
  });
});
