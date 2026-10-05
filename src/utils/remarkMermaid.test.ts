import { describe, expect, it } from 'vitest';
import { XMLValidator } from 'fast-xml-parser';
import { renderMermaidFigure, remarkMermaid } from './remarkMermaid.mjs';

const source = `flowchart TD
accTitle: My decision & next step
accDescr: I read a note, decide, then act.
A[Read] --> B{Approve?}
B -->|Yes| C[Act]
B -->|No| D[Wait]`;

describe('build-time Mermaid', () => {
  it('renders labelled SVG with local fonts and no browser script or external import', () => {
    const html = renderMermaidFigure(source);
    const svg = html.match(/<svg[\s\S]*<\/svg>/)?.[0] ?? '';
    expect(XMLValidator.validate(svg)).toBe(true);
    expect(html).toContain('role="img"');
    expect(html).toContain('aria-labelledby="diagram-');
    expect(html).toContain('aria-describedby="diagram-');
    expect(html).toContain('My decision &amp; next step');
    expect(html).toContain('font-family: var(--font-sans)');
    expect(html).not.toMatch(/<script|@import|https:\/\/fonts/);
  });

  it('namespaces marker IDs and references across multiple diagram instances', () => {
    const first = renderMermaidFigure(source, 'first');
    const second = renderMermaidFigure(source, 'second');
    const ids = [...(first + second).matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
    expect(new Set(ids).size).toBe(ids.length);
    expect(first).toMatch(/url\(#diagram-[a-f0-9]+-arrowhead\)/);
    expect(first).not.toContain('url(#arrowhead)');
  });

  it('escapes diagram labels and accessible metadata rather than injecting markup', () => {
    const html = renderMermaidFigure(
      source
        .replace('Read]', '<script>alert(1)</script>]')
        .replace('My decision & next step', '<img src=x onerror=alert(1)>'),
    );
    expect(html).not.toContain('<script>');
    expect(html).not.toContain('<img');
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain('&lt;img');
  });

  it('preserves dollar expressions in accessible metadata as literal text', () => {
    const html = renderMermaidFigure(
      source.replace('My decision & next step', () => 'Cost $& and $1'),
    );
    expect(html).toContain('Cost $&amp; and $1</title>');
    const svg = html.match(/<svg[\s\S]*<\/svg>/)?.[0] ?? '';
    expect(XMLValidator.validate(svg)).toBe(true);
  });

  it('rejects unsupported or unlabelled diagrams', () => {
    expect(() => renderMermaidFigure('flowchart TD\nA --> B')).toThrow('accTitle');
    expect(() => renderMermaidFigure(source.replace('flowchart TD', 'pie'))).toThrow('supports');
  });

  it('rejects empty metadata rather than reading the next line as a title', () => {
    expect(() =>
      renderMermaidFigure(source.replace('accTitle: My decision & next step', 'accTitle:')),
    ).toThrow('accTitle');
    expect(() =>
      renderMermaidFigure(
        source.replace('accDescr: I read a note, decide, then act.', 'accDescr:'),
      ),
    ).toThrow('accDescr');
  });

  it('leaves ordinary code fences unchanged and renders nested Mermaid blocks', () => {
    const ordinary = { type: 'code', lang: 'js', value: 'console.log(1)' };
    const nested = {
      type: 'blockquote',
      children: [{ type: 'code', lang: 'mermaid', value: source }],
    };
    const tree = {
      type: 'root',
      children: [ordinary, nested],
    };
    remarkMermaid()(tree, { path: 'essay.md' });
    expect(tree.children[0]).toBe(ordinary);
    expect(nested.children[0].type).toBe('html');
  });

  it('renders a state diagram with the same accessibility contract', () => {
    const html = renderMermaidFigure(`stateDiagram-v2
accTitle: Feature stages
accDescr: An idea moves from proposal to discussion.
[*] --> Proposal
Proposal --> Discussion`);
    expect(html).toContain('<svg');
    expect(html).toContain('Feature stages');
  });
});
