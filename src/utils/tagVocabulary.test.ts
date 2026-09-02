import { describe, expect, it } from 'vitest';
import { CONTENT_FORM_TAGS, PREFERRED_TAGS, TAG_ALIAS_MAP } from '../data/tagVocabulary';
import {
  canonicalizeTag,
  canonicalizeTags,
  humanizeTagSlug,
  isContentFormTag,
  isPreferredTag,
  normalizeTagInput,
} from './tagVocabulary';

describe('normalizeTagInput', () => {
  it('lowercases, strips accents, and kebab-cases', () => {
    expect(normalizeTagInput('  Auto-Reflexión  ')).toBe('auto-reflexion');
    expect(normalizeTagInput('ai agents')).toBe('ai-agents');
    expect(normalizeTagInput('AI_Agent')).toBe('ai-agent');
  });
});

describe('canonicalizeTag', () => {
  it('maps Spanish thematic aliases to English canonical slugs', () => {
    expect(canonicalizeTag('límites')).toBe('boundaries');
    expect(canonicalizeTag('culpa')).toBe('guilt');
    expect(canonicalizeTag('amor')).toBe('love');
    expect(canonicalizeTag('crianza')).toBe('parenting');
    expect(canonicalizeTag('responsabilidad')).toBe('responsibility');
    expect(canonicalizeTag('vulnerabilidad')).toBe('vulnerability');
    expect(canonicalizeTag('libertad')).toBe('freedom');
    expect(canonicalizeTag('revolución')).toBe('revolution');
    expect(canonicalizeTag('sanación-colectiva')).toBe('collective-healing');
  });

  it('maps recovery and writing without collapsing into neighboring themes', () => {
    expect(canonicalizeTag('recuperación')).toBe('recovery');
    expect(canonicalizeTag('escritura')).toBe('writing');
    expect(canonicalizeTag('sanación')).toBe('healing');
  });

  it('keeps writing-form tags on the form axis', () => {
    expect(canonicalizeTag('poem')).toBe('poems');
    expect(canonicalizeTag('poetry')).toBe('poems');
    expect(canonicalizeTag('poems')).toBe('poems');
    expect(canonicalizeTag('idea')).toBe('ideas');
    expect(canonicalizeTag('ideas')).toBe('ideas');
    expect(canonicalizeTag('note')).toBe('notes');
    expect(canonicalizeTag('notes')).toBe('notes');
    expect(canonicalizeTag('essay')).toBe('essays');
    expect(canonicalizeTag('letter')).toBe('letters');
    expect(canonicalizeTag('story')).toBe('stories');
    expect(canonicalizeTag('manifesto')).toBe('manifestos');
    expect(canonicalizeTag('song')).toBe('songs');
    expect(canonicalizeTag('reflections')).toBe('reflection');
    expect(canonicalizeTag('memoirs')).toBe('memoir');
  });

  it('does not send form slugs into thematic tags', () => {
    expect(canonicalizeTag('notes')).not.toBe('reflection');
    expect(canonicalizeTag('essays')).not.toBe('reflection');
    expect(canonicalizeTag('manifestos')).not.toBe('political-awakening');
    expect(canonicalizeTag('letters')).not.toBe('memoir');
    expect(canonicalizeTag('stories')).not.toBe('memoir');
  });

  it('dedupes mixed EN/ES arrays onto the English twin', () => {
    expect(
      canonicalizeTags(['límites', 'boundaries', 'regulación-emocional', 'emotional-regulation']),
    ).toEqual(['boundaries', 'emotional-regulation']);
  });
});

describe('preferred + form vocabulary', () => {
  it('does not list slugs that immediately alias away', () => {
    const preferred = PREFERRED_TAGS as readonly string[];
    for (const tag of preferred) {
      expect(canonicalizeTag(tag), tag).toBe(tag);
    }
  });

  it('protects every content-form canonical slug', () => {
    for (const tag of CONTENT_FORM_TAGS) {
      expect(isContentFormTag(tag)).toBe(true);
      expect(canonicalizeTag(tag)).toBe(tag);
    }
  });

  it('treats wellness as health, not as a preferred leftover', () => {
    expect(canonicalizeTag('wellness')).toBe('health');
    expect(isPreferredTag('wellness')).toBe(true);
    expect((PREFERRED_TAGS as readonly string[]).includes('wellness')).toBe(false);
  });
});

describe('TAG_ALIAS_MAP hygiene', () => {
  it('stores only post-normalize kebab keys and non-identity targets', () => {
    for (const [alias, canonical] of Object.entries(TAG_ALIAS_MAP)) {
      expect(alias).toBe(normalizeTagInput(alias));
      expect(alias).not.toBe(canonical);
      expect(canonical).toBe(normalizeTagInput(canonical));
    }
  });
});

describe('humanizeTagSlug', () => {
  it('title-cases kebab slugs', () => {
    expect(humanizeTagSlug('personal-growth')).toBe('Personal Growth');
  });
});
