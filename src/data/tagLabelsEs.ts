import { canonicalizeTag } from '../utils/tagVocabulary';

/**
 * How a tag reads on a Spanish page. Tags stay English slugs in frontmatter and in
 * `/tag/<slug>` URLs; this only changes the chip's text. Every tag used on a Spanish
 * post needs an entry (`tagLabelsEs.test.ts` checks).
 */
export const TAG_LABELS_ES: Record<string, string> = {
  ai: 'ia',
  'ai-agents': 'agentes-de-ia',
  'art-expression': 'arte',
  attachment: 'apego',
  authenticity: 'autenticidad',
  boundaries: 'límites',
  capitalism: 'capitalismo',
  'child-development': 'desarrollo-infantil',
  children: 'niños',
  'co-parenting': 'crianza-compartida',
  colonialism: 'colonialismo',
  'conscious-parenting': 'crianza-consciente',
  consciousness: 'consciencia',
  craftsmanship: 'oficio',
  creativity: 'creatividad',
  'digital-safety': 'seguridad-digital',
  economics: 'economía',
  education: 'educación',
  'emotional-regulation': 'regulación-emocional',
  family: 'familia',
  fatherhood: 'paternidad',
  freedom: 'libertad',
  'game-development': 'desarrollo-de-juegos',
  gaming: 'videojuegos',
  gratitude: 'gratitud',
  grief: 'duelo',
  healing: 'sanación',
  'inner-child': 'niño-interior',
  intimacy: 'intimidad',
  joy: 'alegría',
  // Not "límites": that is boundaries. Here it means the limits of the body.
  limits: 'limitaciones',
  love: 'amor',
  masculinity: 'masculinidad',
  meaning: 'sentido',
  memoir: 'memorias',
  parenting: 'crianza',
  'personal-growth': 'crecimiento-personal',
  philosophy: 'filosofía',
  poems: 'poemas',
  politics: 'política',
  power: 'poder',
  presence: 'presencia',
  'puerto-rico': 'puerto-rico',
  recovery: 'recuperación',
  relationships: 'relaciones',
  responsibility: 'responsabilidad',
  'self-reflection': 'autorreflexión',
  sexuality: 'sexualidad',
  'social-justice': 'justicia-social',
  'software-development': 'desarrollo-de-software',
  spirituality: 'espiritualidad',
  'systemic-critique': 'crítica-sistémica',
  technology: 'tecnología',
  values: 'valores',
  vulnerability: 'vulnerabilidad',
  work: 'trabajo',
  writing: 'escritura',
};

export function tagLabel(tag: string, lang: 'en' | 'es' = 'en'): string {
  const canonical = canonicalizeTag(tag);
  if (lang === 'es') return TAG_LABELS_ES[canonical] ?? canonical;
  return tag;
}
