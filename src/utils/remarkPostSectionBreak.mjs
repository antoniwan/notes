/**
 * Insert the shared ✦ break before citation / sources headings so those
 * sections use the same divisor as comments, without editing every post.
 */

export const POST_SECTION_BREAK_HTML =
  '<div class="post-section-break post-section-break--almost" aria-hidden="true">✦</div>';

const REFERENCE_HEADINGS = new Set([
  'references',
  'referencias',
  'sources',
  'fuentes',
  'referenced materials',
  'scientific references',
  'research sources and references',
]);

/**
 * @param {string} text
 * @returns {boolean}
 */
export function isReferenceHeadingText(text) {
  const normalized = String(text)
    .replace(/\p{Extended_Pictographic}/gu, '')
    .replace(/[\uFE0F\u200D]/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

  return REFERENCE_HEADINGS.has(normalized);
}

/**
 * @param {{ type?: string, value?: string, children?: unknown[] }} node
 * @returns {string}
 */
function headingPlainText(node) {
  if (!node || typeof node !== 'object') return '';
  if (node.type === 'text' || node.type === 'inlineCode') return node.value || '';
  if (!Array.isArray(node.children)) return node.value || '';
  return node.children.map((child) => headingPlainText(child)).join('');
}

/**
 * @param {{ type?: string, value?: string }} node
 * @returns {boolean}
 */
function isSectionBreakHtml(node) {
  return (
    node?.type === 'html' &&
    typeof node.value === 'string' &&
    node.value.includes('post-section-break')
  );
}

export function remarkPostSectionBreak() {
  return (tree) => {
    const children = tree?.children;
    if (!Array.isArray(children)) return;

    for (let i = 0; i < children.length; i++) {
      const node = children[i];
      if (node?.type !== 'heading' || node.depth !== 2) continue;
      if (!isReferenceHeadingText(headingPlainText(node))) continue;

      const prev = children[i - 1];
      if (isSectionBreakHtml(prev)) continue;

      let insertAt = i;
      if (prev?.type === 'thematicBreak') {
        children.splice(i - 1, 1);
        insertAt = i - 1;
      }

      children.splice(insertAt, 0, {
        type: 'html',
        value: POST_SECTION_BREAK_HTML,
      });
      i = insertAt + 1;
    }
  };
}
