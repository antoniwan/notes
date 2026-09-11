/**
 * Heading text helpers for the table of contents.
 *
 * The TOC is built from the raw Markdown source, so a heading written as
 * `## **Title**` would otherwise show its markers as literal text.
 */

/** Strip `**`, `_`, and backticks so TOC labels read as plain text. */
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
