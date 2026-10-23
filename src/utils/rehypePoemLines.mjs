/**
 * Set `<pre class="a-poem">` blocks as verse instead of preformatted text.
 * Markdown passes the block through as one raw HTML node, so this rewrites the
 * string: each blank-line-separated stanza becomes a <p>, and each line a block
 * <span> so a long line can wrap with a hanging indent instead of looking like
 * two lines. Inline markup inside a line (e.g. <strong>) is kept as is.
 */

export const POEM_CLASS = 'a-poem';

const POEM_BLOCK = /^\s*<pre class="a-poem">\n?([\s\S]*?)\n?<\/pre>\s*$/;

export function poemToHtml(inner) {
  const stanzas = inner
    .split(/\n[ \t]*\n/)
    .map((stanza) => stanza.split('\n').filter((line) => line.trim() !== ''))
    .filter((lines) => lines.length > 0);
  const body = stanzas
    .map(
      (lines) =>
        `<p class="poem-stanza">${lines.map((line) => `<span class="poem-line">${line}</span>`).join('')}</p>`,
    )
    .join('');
  return `<div class="${POEM_CLASS}">${body}</div>`;
}

function rewritePoems(node) {
  if (!node || typeof node !== 'object' || !Array.isArray(node.children)) return;
  for (const child of node.children) {
    if (child.type === 'raw' && typeof child.value === 'string') {
      const match = child.value.match(POEM_BLOCK);
      if (match) child.value = poemToHtml(match[1]);
    } else {
      rewritePoems(child);
    }
  }
}

/** Rehype: turn raw poem `<pre>` blocks into stanzas and lines. */
export function rehypePoemLines() {
  return (tree) => rewritePoems(tree);
}
