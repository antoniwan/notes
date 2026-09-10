import type { ImageMetadata } from 'astro';

/**
 * Resolves a `heroImage` frontmatter string to an optimizable image (R20).
 *
 * Images that Astro should optimize have to live under `src/`; anything in
 * `public/` is copied verbatim and can never gain a `srcset`. Rather than
 * rewrite `heroImage` in 115 posts to a relative import — which would also
 * change the value every consumer reads, from the Open Graph manifest to the
 * feeds to the search index — the frontmatter keeps its `/images/…` string and
 * this module maps it onto the moved file.
 *
 * `import.meta.glob` with `eager: true` is resolved at build time, so this adds
 * no runtime cost and no client bundle: unreferenced images are never emitted.
 *
 * Images referenced from inside post bodies still live in `public/images/` and
 * are deliberately untouched; `heroImage` is where the measured waste was.
 * `resolveHeroImage()` returns null for those, and callers fall back to a plain
 * `<img>`, so a path this map does not know still renders.
 */
const heroModules = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/images/**/*.{avif,webp,png,jpg,jpeg}',
  { eager: true },
);

/** `/images/2025/foo.avif` → `/src/assets/images/2025/foo.avif` */
function toAssetKey(heroImage: string): string {
  const clean = heroImage.split('?')[0].split('#')[0];
  return clean.replace(/^\/images\//, '/src/assets/images/');
}

export function resolveHeroImage(heroImage: string | undefined | null): ImageMetadata | null {
  if (!heroImage || !heroImage.startsWith('/images/')) return null;
  return heroModules[toAssetKey(heroImage)]?.default ?? null;
}

/** True when this path has a moved, optimizable counterpart. */
export function hasOptimizedHero(heroImage: string | undefined | null): boolean {
  return resolveHeroImage(heroImage) !== null;
}

/**
 * Widths generated for hero art, and the quality they are encoded at.
 *
 * Both were measured, not guessed. Source images are already densely encoded
 * AVIF — `broken-signals.avif` is 1456px at 255 KB, about 215 KB per megapixel —
 * and Sharp re-encodes less efficiently than whatever produced them. At the
 * default quality a 1200px derivative came out at 331 KB, *larger* than the
 * full-size original, which would have regressed desktop to fix mobile. A 1600
 * entry was worse still: it upscales a 1456px source.
 *
 * At quality 45 every derivative lands at or below its source (1200px → 181 KB
 * against a 255 KB original) while the small widths, which are the entire point,
 * fall dramatically: 400px → 20 KB, a 92% cut for a phone that paints a 358px
 * box.
 *
 * 400 serves a phone at 1x, 800 a phone at 2x or a tablet, 1200 a desktop.
 * Astro will not upscale beyond the source, so a smaller original simply offers
 * fewer candidates.
 */
export const HERO_WIDTHS = [400, 800, 1200];
export const HERO_QUALITY = 45;

/**
 * `sizes` per surface. These describe the painted box, so the browser can pick
 * before layout. Getting them wrong is worse than omitting them, so each is
 * derived from the measured layout rather than guessed.
 */
export const HERO_SIZES = {
  /** PostCard thumbnails: full width on phones, then a fixed card column. */
  card: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px',
  /** Article hero: full width up to the prose column's maximum. */
  article: '(max-width: 1024px) 100vw, 1024px',
} as const;
