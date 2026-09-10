/**
 * Build-process memo helpers for expensive analytics used across many Astro pages.
 * Caches live for the lifetime of the Node build process only.
 */
import { createHash } from 'node:crypto';

type PostSignatureInput = {
  id: string;
  body?: string;
  data?: {
    title?: string;
    pubDate?: Date | string;
    tags?: string[];
  };
};

export function contentDigest(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

export function postsSignature(posts: PostSignatureInput[]): string {
  const normalized = posts
    .map((post) => ({
      id: post.id,
      body: post.body || '',
      title: post.data?.title || '',
      pubDate:
        post.data?.pubDate instanceof Date
          ? post.data.pubDate.toISOString()
          : (post.data?.pubDate ?? ''),
      tags: [...(post.data?.tags ?? [])].sort(),
    }))
    .sort((a, b) => a.id.localeCompare(b.id));

  return contentDigest(JSON.stringify(normalized));
}

export function createMemoBySignature<TInput extends { length: number }, TResult>(
  keyFn: (input: TInput) => string,
  compute: (input: TInput) => TResult,
): (input: TInput) => TResult {
  let cachedKey: string | null = null;
  let cachedValue: TResult | null = null;

  return (input: TInput) => {
    const key = `${input.length}::${keyFn(input)}`;
    if (cachedKey === key && cachedValue !== null) {
      return cachedValue;
    }
    cachedValue = compute(input);
    cachedKey = key;
    return cachedValue;
  };
}
