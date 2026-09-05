import { describe, expect, it } from 'vitest';
import {
  isReferenceHeadingText,
  POST_SECTION_BREAK_HTML,
  remarkPostSectionBreak,
} from './remarkPostSectionBreak.mjs';

type MdastNode = {
  type: string;
  depth?: number;
  value?: string;
  children?: MdastNode[];
};

function heading(text: string, extra: Partial<MdastNode> = {}): MdastNode {
  return { type: 'heading', depth: 2, children: [{ type: 'text', value: text }], ...extra };
}

describe('isReferenceHeadingText', () => {
  it('matches English and Spanish citation headings, including emoji and bold', () => {
    expect(isReferenceHeadingText('References')).toBe(true);
    expect(isReferenceHeadingText('📚 REFERENCES')).toBe(true);
    expect(isReferenceHeadingText('Sources')).toBe(true);
    expect(isReferenceHeadingText('Fuentes')).toBe(true);
    expect(isReferenceHeadingText('Referencias')).toBe(true);
    expect(isReferenceHeadingText('📚 Research Sources & References')).toBe(true);
    expect(isReferenceHeadingText('🧠 Scientific References')).toBe(true);
    expect(isReferenceHeadingText('Referenced materials')).toBe(true);
  });

  it('ignores ordinary essay headings', () => {
    expect(isReferenceHeadingText('Final Thoughts')).toBe(false);
    expect(isReferenceHeadingText('The Sources of My Anxiety')).toBe(false);
    expect(isReferenceHeadingText('Further Reading')).toBe(false);
  });
});

describe('remarkPostSectionBreak', () => {
  it('inserts the shared break before a references heading', () => {
    const tree: MdastNode = {
      type: 'root',
      children: [
        { type: 'paragraph', children: [{ type: 'text', value: 'Body' }] },
        heading('References'),
      ],
    };

    remarkPostSectionBreak()(tree);

    expect(tree.children?.[1]).toEqual({ type: 'html', value: POST_SECTION_BREAK_HTML });
    expect(tree.children?.[2]?.type).toBe('heading');
  });

  it('replaces a preceding thematic break instead of stacking separators', () => {
    const tree: MdastNode = {
      type: 'root',
      children: [{ type: 'thematicBreak' }, heading('📚 REFERENCES')],
    };

    remarkPostSectionBreak()(tree);

    expect(tree.children).toHaveLength(2);
    expect(tree.children?.[0]).toEqual({ type: 'html', value: POST_SECTION_BREAK_HTML });
    expect(tree.children?.[1]?.type).toBe('heading');
  });

  it('does not insert twice', () => {
    const tree: MdastNode = {
      type: 'root',
      children: [{ type: 'html', value: POST_SECTION_BREAK_HTML }, heading('Sources')],
    };

    remarkPostSectionBreak()(tree);

    expect(tree.children).toHaveLength(2);
  });

  it('reads emphasis-wrapped titles like **Fuentes**', () => {
    const tree: MdastNode = {
      type: 'root',
      children: [
        {
          type: 'heading',
          depth: 2,
          children: [{ type: 'strong', children: [{ type: 'text', value: 'Fuentes' }] }],
        },
      ],
    };

    remarkPostSectionBreak()(tree);

    expect(tree.children?.[0]).toEqual({ type: 'html', value: POST_SECTION_BREAK_HTML });
  });
});
