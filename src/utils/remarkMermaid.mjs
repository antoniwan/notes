import { createHash } from 'node:crypto';
import { renderMermaidSVG } from 'beautiful-mermaid';

/** Mermaid fences become inline SVG during Markdown compilation, with no browser runtime. */
const escapeHtml = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char],
  );

export function renderMermaidFigure(source, identity = source) {
  const title = source.match(/^[\t ]*accTitle:[\t ]*(.+)$/m)?.[1]?.trim();
  const description = source.match(/^[\t ]*accDescr:[\t ]*(.+)$/m)?.[1]?.trim();
  if (!title || !description) {
    throw new Error(
      'Mermaid diagrams need single-line accTitle and accDescr for accessible reading.',
    );
  }
  const diagram = source.replace(/^[\t ]*acc(?:Title|Descr):[^\r\n]*(?:\r?\n|$)/gm, '').trim();
  if (!/^(?:flowchart|graph)\s+(?:TD|TB|LR|RL|BT)\b|^stateDiagram-v2\b/.test(diagram)) {
    throw new Error('The Notes renderer supports Mermaid flowcharts and state diagrams.');
  }

  const prefix = 'diagram-' + createHash('sha256').update(identity).digest('hex').slice(0, 12);
  let svg = renderMermaidSVG(diagram, {
    bg: 'rgb(var(--color-bg))',
    fg: 'rgb(var(--color-text))',
    font: 'DM Sans',
    transparent: true,
    padding: 20,
    layerSpacing: 32,
  });

  // The library includes a Google Fonts import. Notes already serves its own fonts.
  svg = svg.replace(/@import\s+url\([^)]*\);?/g, '');
  svg = svg.replace(
    /\btext\s*\{[^}]*\}/,
    '.mermaid-diagram svg text { font-family: var(--font-sans), system-ui, sans-serif; }',
  );
  svg = svg.replace(/\bsvg\s*\{/, '.mermaid-diagram svg {');

  // SVG marker IDs must be distinct when several diagrams appear on the same page.
  const ids = [...svg.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  for (const id of ids) {
    const replacement = prefix + '-' + id;
    svg = svg.replaceAll(' id="' + id + '"', ' id="' + replacement + '"');
    svg = svg.replaceAll('url(#' + id + ')', 'url(#' + replacement + ')');
    svg = svg.replaceAll('href="#' + id + '"', 'href="#' + replacement + '"');
  }

  const width = svg.match(/<svg\b[^>]*\bwidth="([\d.]+)"/)?.[1];
  if (!width) throw new Error('Mermaid SVG has no measurable width.');
  svg = svg.replace(
    /<svg\b([^>]*)>/,
    '<svg$1 role="img" aria-labelledby="' +
      prefix +
      '-title" aria-describedby="' +
      prefix +
      '-description">',
  );
  svg = svg.replace(
    /(<svg\b[^>]*>)/,
    (root) =>
      root +
      '<title id="' +
      prefix +
      '-title">' +
      escapeHtml(title) +
      '</title><desc id="' +
      prefix +
      '-description">' +
      escapeHtml(description) +
      '</desc>',
  );

  return (
    '<figure class="mermaid-diagram" style="--diagram-width:' +
    width +
    'px"><div class="mermaid-diagram__viewport" tabindex="0" role="region" aria-label="' +
    escapeHtml(title) +
    '">' +
    svg +
    '</div><figcaption>' +
    escapeHtml(title) +
    '</figcaption></figure>'
  );
}

export function remarkMermaid() {
  return (tree, file) => {
    let count = 0;
    function visit(node) {
      if (!Array.isArray(node.children)) return;
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        if (child.type === 'code' && child.lang === 'mermaid') {
          count += 1;
          try {
            node.children[i] = {
              type: 'html',
              value: renderMermaidFigure(
                child.value,
                String(file?.path ?? '') + ':' + count + ':' + child.value,
              ),
            };
          } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            if (file?.fail) file.fail('Mermaid diagram ' + count + ': ' + message, child);
            throw error;
          }
        } else visit(child);
      }
    }
    visit(tree);
  };
}
