import { TABLE_SCROLL_CLASS } from './rehypeWrapTables.mjs';

const ALREADY_WRAPPED = new RegExp(
  `<div class="${TABLE_SCROLL_CLASS}">[\\s\\S]*?<\\/div>|<table\\b[\\s\\S]*?<\\/table>`,
  'gi',
);

const HEADING_EMPHASIS = /<\/?(?:strong|b|em|i)>/gi;

/** Flatten bold/italic tags inside headings (from `## **Title**` / `_phrase_`). */
export function unwrapHeadingEmphasis(html: string): string {
  return html.replace(
    /<(h[1-6])(\s[^>]*)?>([\s\S]*?)<\/\1>/gi,
    (_full, tag: string, attrs: string | undefined, inner: string) =>
      `<${tag}${attrs ?? ''}>${inner.replace(HEADING_EMPHASIS, '')}</${tag}>`,
  );
}

/** Strip `**`, `_`, and similar markers so TOC labels don't show markdown. */
export function stripHeadingMarkup(text: string): string {
  let value = text.trim();
  let previous = '';
  while (value !== previous) {
    previous = value;
    value = value
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/__([^_]+)__/g, '$1')
      .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '$1')
      .replace(/(?<!_)_([^_]+)_(?!_)/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      .trim();
  }
  return value.replace(/\*\*/g, '').trim();
}

/** Wrap bare `<table>` HTML so wide tables can scroll. No-op if already wrapped. */
export function wrapTablesInHtml(html: string | undefined): string | undefined {
  if (!html || !html.includes('<table')) return html;
  return html.replace(ALREADY_WRAPPED, (chunk) => {
    if (chunk.startsWith('<div')) return chunk;
    return `<div class="${TABLE_SCROLL_CLASS}">${chunk}</div>`;
  });
}

/** Post HTML: flatten heading emphasis, then wrap wide tables. */
export function preparePostHtml(html: string | undefined): string | undefined {
  if (!html) return html;
  return wrapTablesInHtml(unwrapHeadingEmphasis(html));
}
