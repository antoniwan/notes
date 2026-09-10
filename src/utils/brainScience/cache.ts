import fs from 'node:fs';
import path from 'node:path';
import type { CollectionEntry } from 'astro:content';
import type { WritingPhilosophyAnalysis } from './metaAnalysis';
import { contentDigest } from './buildMemo';

const CACHE_VERSION = 3;

interface MetaAnalysisCache {
  version: typeof CACHE_VERSION;
  postsSignature: Array<{
    id: string;
    contentHash: string;
    pubDate: string | null;
  }>;
  analyses: WritingPhilosophyAnalysis[];
}

const CACHE_DIR = path.join(process.cwd(), 'src', 'data', '.brain-science-cache');
const CACHE_FILE = path.join(CACHE_DIR, 'meta-analysis.json');

function buildPostsSignature(
  posts: CollectionEntry<'blog'>[],
): MetaAnalysisCache['postsSignature'] {
  return posts
    .map((post) => ({
      id: post.id,
      contentHash: contentDigest(`${post.data.title}\0${post.body || ''}`),
      pubDate:
        post.data.pubDate instanceof Date
          ? post.data.pubDate.toISOString()
          : (post.data.pubDate ?? null),
    }))
    .sort((a, b) => a.id.localeCompare(b.id));
}

export function loadMetaAnalysisCache(
  posts: CollectionEntry<'blog'>[],
): WritingPhilosophyAnalysis[] | null {
  try {
    if (!fs.existsSync(CACHE_FILE)) return null;

    const raw = fs.readFileSync(CACHE_FILE, 'utf8');
    const parsed = JSON.parse(raw) as MetaAnalysisCache;

    if (parsed.version !== CACHE_VERSION || !Array.isArray(parsed.postsSignature)) return null;

    const currentSignature = buildPostsSignature(posts);

    if (currentSignature.length !== parsed.postsSignature.length) return null;

    for (let i = 0; i < currentSignature.length; i += 1) {
      const a = currentSignature[i];
      const b = parsed.postsSignature[i];
      if (!b || a.id !== b.id || a.contentHash !== b.contentHash || a.pubDate !== b.pubDate) {
        return null;
      }
    }

    // JSON.parse turns Date fields into strings — revive before callers sort/compare.
    return parsed.analyses.map((analysis) => ({
      ...analysis,
      postDate: new Date(analysis.postDate as unknown as string),
    }));
  } catch {
    return null;
  }
}

export function saveMetaAnalysisCache(
  posts: CollectionEntry<'blog'>[],
  analyses: WritingPhilosophyAnalysis[],
): void {
  try {
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }

    const cache: MetaAnalysisCache = {
      version: CACHE_VERSION,
      postsSignature: buildPostsSignature(posts),
      analyses,
    };

    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf8');
  } catch {
    // If cache writing fails for any reason, ignore and continue with fresh analyses
  }
}
