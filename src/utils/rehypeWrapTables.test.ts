import { describe, expect, it } from 'vitest';
import { rehypeWrapTables, TABLE_SCROLL_CLASS } from './rehypeWrapTables.mjs';

type UnistNode = {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: UnistNode[];
};

describe('rehypeWrapTables', () => {
  it('wraps tables in a scroll container and leaves other elements alone', () => {
    const tree: UnistNode = {
      type: 'root',
      children: [
        { type: 'element', tagName: 'p', children: [] },
        { type: 'element', tagName: 'table', children: [] },
      ],
    };

    rehypeWrapTables()(tree);

    expect(tree.children?.[0]?.tagName).toBe('p');
    expect(tree.children?.[1]?.tagName).toBe('div');
    expect(tree.children?.[1]?.properties?.className).toEqual([TABLE_SCROLL_CLASS]);
    expect(tree.children?.[1]?.children?.[0]?.tagName).toBe('table');
  });

  it('does not double-wrap a table already inside the scroll container', () => {
    const tree: UnistNode = {
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'div',
          properties: { className: [TABLE_SCROLL_CLASS] },
          children: [{ type: 'element', tagName: 'table', children: [] }],
        },
      ],
    };

    rehypeWrapTables()(tree);

    expect(tree.children?.[0]?.tagName).toBe('div');
    expect(tree.children?.[0]?.children?.[0]?.tagName).toBe('table');
  });
});
