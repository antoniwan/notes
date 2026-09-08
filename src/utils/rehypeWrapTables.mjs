/**
 * Wrap markdown tables so wide ones can scroll without collapsing cell padding.
 * Rehype runs after remark-rehype, so GFM tables are already `<table>` elements.
 */

export const TABLE_SCROLL_CLASS = 'table-scroll';

function classList(value) {
  if (Array.isArray(value)) return value.map(String);
  return String(value ?? '')
    .split(/\s+/)
    .filter(Boolean);
}

function isHastTable(node) {
  return node?.type === 'element' && node.tagName === 'table';
}

function isTableScroll(node) {
  if (node?.type !== 'element' || node.tagName !== 'div') return false;
  return classList(node.properties?.className).includes(TABLE_SCROLL_CLASS);
}

function wrapHastTables(node) {
  if (!node || typeof node !== 'object' || !Array.isArray(node.children)) return;
  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];
    if (isHastTable(child) && !isTableScroll(node)) {
      node.children[i] = {
        type: 'element',
        tagName: 'div',
        properties: { className: [TABLE_SCROLL_CLASS] },
        children: [child],
      };
    } else {
      wrapHastTables(child);
    }
  }
}

/** Rehype: wrap already-converted `<table>` nodes. */
export function rehypeWrapTables() {
  return (tree) => wrapHastTables(tree);
}
