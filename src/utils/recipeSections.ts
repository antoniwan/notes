/**
 * Ingredients and steps for a recipe's structured data, read from its Markdown.
 *
 * Every recipe has "## Ingredients" (bullets, sometimes in plain-text groups such
 * as "El pollo:") and "## Method" (numbered steps), in both languages. Frontmatter
 * `recipeIngredient` / `recipeInstructions` still win when a recipe sets them.
 */

function sectionLines(body: string, heading: string): string[] {
  const lines = body.split(/\r?\n/);
  const start = lines.findIndex(
    (line) => line.trim().toLowerCase() === `## ${heading.toLowerCase()}`,
  );
  if (start === -1) return [];
  const out: string[] = [];
  for (const line of lines.slice(start + 1)) {
    if (/^#{1,2}\s/.test(line)) break;
    out.push(line);
  }
  return out;
}

/** Markdown inline formatting to plain text: images, links, emphasis, code. */
function plainText(text: string): string {
  return text
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/(\*\*|__|\*|`)/g, '')
    .replace(/(^|\s)_([^_]+)_(?=\s|[.,;:!?]|$)/g, '$1$2')
    .replace(/\s+/g, ' ')
    .trim();
}

function listItems(body: string, heading: string, marker: RegExp): string[] {
  return sectionLines(body, heading)
    .map((line) => line.match(marker)?.[1])
    .filter((item): item is string => Boolean(item))
    .map(plainText)
    .filter(Boolean);
}

export function recipeFromMarkdown(body = ''): { ingredients: string[]; instructions: string[] } {
  return {
    ingredients: listItems(body, 'Ingredients', /^\s*[-*]\s+(.+)$/),
    instructions: listItems(body, 'Method', /^\s*(?:\d+[.)]|[-*])\s+(.+)$/),
  };
}
