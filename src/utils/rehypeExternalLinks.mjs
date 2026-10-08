/**
 * Mark links that leave Notes so CSS can add a small ↗ after them.
 * Rehype runs after remark-rehype, so Markdown links are already `<a>` elements.
 * Raw HTML in a post (embeds, tweets) stays untouched.
 */

export const EXTERNAL_LINK_CLASS = 'link-external';
export const NOTES_HOST = 'notes.antoniwan.online';

function classList(value) {
  if (Array.isArray(value)) return value.map(String);
  return String(value ?? '')
    .split(/\s+/)
    .filter(Boolean);
}

/** True for an absolute http(s) URL on any host other than Notes. */
export function isExternalHref(href) {
  if (typeof href !== 'string' || !/^https?:\/\//i.test(href)) return false;
  try {
    return new URL(href).hostname.toLowerCase() !== NOTES_HOST;
  } catch {
    return false;
  }
}

function wrapsOnlyAnImage(node) {
  const children = (node.children ?? []).filter(
    (child) => !(child.type === 'text' && !child.value.trim()),
  );
  return children.length > 0 && children.every((child) => child.tagName === 'img');
}

function markExternalLinks(node) {
  if (!node || typeof node !== 'object') return;
  if (
    node.type === 'element' &&
    node.tagName === 'a' &&
    isExternalHref(node.properties?.href) &&
    !wrapsOnlyAnImage(node)
  ) {
    const classes = classList(node.properties.className);
    if (!classes.includes(EXTERNAL_LINK_CLASS)) {
      node.properties.className = [...classes, EXTERNAL_LINK_CLASS];
    }
  }
  if (Array.isArray(node.children)) node.children.forEach(markExternalLinks);
}

/** Rehype: add `link-external` to every link whose host is not Notes. */
export function rehypeExternalLinks() {
  return (tree) => markExternalLinks(tree);
}
