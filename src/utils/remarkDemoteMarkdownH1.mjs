/**
 * Demote markdown ATX headings (`#`) from depth 1 → 2 so post bodies never
 * emit a second document `<h1>` alongside PageHeader.
 */
export function remarkDemoteMarkdownH1() {
  return (tree) => {
    const walk = (node) => {
      if (!node || typeof node !== 'object') return;
      if (node.type === 'heading' && node.depth === 1) {
        node.depth = 2;
      }
      if (Array.isArray(node.children)) {
        for (const child of node.children) walk(child);
      }
    };
    walk(tree);
  };
}
