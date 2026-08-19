import { describe, expect, it } from 'vitest';
import { remarkDemoteMarkdownH1 } from './remarkDemoteMarkdownH1.mjs';

type MdastNode = {
  type: string;
  depth?: number;
  value?: string;
  children?: MdastNode[];
};

describe('remarkDemoteMarkdownH1', () => {
  it('demotes depth-1 headings to depth 2 and leaves others alone', () => {
    const tree: MdastNode = {
      type: 'root',
      children: [
        { type: 'heading', depth: 1, children: [{ type: 'text', value: 'Nope' }] },
        { type: 'heading', depth: 2, children: [{ type: 'text', value: 'Keep' }] },
        {
          type: 'blockquote',
          children: [{ type: 'heading', depth: 1, children: [{ type: 'text', value: 'Nested' }] }],
        },
      ],
    };

    remarkDemoteMarkdownH1()(tree);

    expect(tree.children?.[0]?.depth).toBe(2);
    expect(tree.children?.[1]?.depth).toBe(2);
    expect(tree.children?.[2]?.children?.[0]?.depth).toBe(2);
  });
});
