import getReadingTime from 'reading-time';
import { toString } from 'mdast-util-to-string';

/**
 * Top-level nodes a reader doesn't read through: MDX imports and expressions,
 * raw HTML, and collapsed <details> blocks (credits, long lists), which in
 * plain Markdown arrive as an opening html node, markdown siblings, and a
 * closing html node.
 */
export function readableNodes(children) {
  const kept = [];
  let insideDetails = false;
  for (const node of children) {
    if (node.type === 'html') {
      if (/<details[\s>]/i.test(node.value)) insideDetails = !/<\/details>/i.test(node.value);
      else if (/<\/details>/i.test(node.value)) insideDetails = false;
      continue;
    }
    if (insideDetails) continue;
    if (node.type === 'mdxjsEsm' || node.type === 'mdxFlowExpression') continue;
    if (node.type === 'mdxJsxFlowElement' && node.name === 'details') continue;
    kept.push(node);
  }
  return kept;
}

export function remarkReadingTime() {
  return function (tree, { data }) {
    const textOnPage = readableNodes(tree.children)
      .map((node) => toString(node))
      .join(' ');
    const readingTime = getReadingTime(textOnPage);
    // readingTime.text will give us minutes read as a friendly string,
    // i.e. "3 min read"
    data.astro.frontmatter.minutesRead = readingTime.text;
  };
}
