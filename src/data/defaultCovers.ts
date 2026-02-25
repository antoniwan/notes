import { readdirSync } from 'fs';
import { join } from 'path';

const DEFAULT_COVERS_DIR = join(process.cwd(), 'public', 'images', 'default_covers');
const FALLBACK_IMAGE = '/images/default.avif';

/**
 * Default cover image URLs, resolved once at build time.
 * Used by DefaultImage so we don't run readdirSync per component instance.
 */
let cached: string[] | null = null;

export function getDefaultCoverUrls(): string[] {
  if (cached !== null) return cached;
  try {
    const files = readdirSync(DEFAULT_COVERS_DIR);
    cached = files
      .filter((file) => /\.(avif|webp|jpg|jpeg|png)$/i.test(file))
      .map((file) => `/images/default_covers/${file}`);
    if (cached.length === 0) cached = [FALLBACK_IMAGE];
  } catch {
    cached = [FALLBACK_IMAGE];
  }
  return cached;
}
