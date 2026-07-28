/**
 * Build-process memo helpers for expensive analytics used across many Astro pages.
 * Caches live for the lifetime of the Node build process only.
 */

export function postsSignature(posts: Array<{ id: string; body?: string }>): string {
  return posts
    .map((p) => `${p.id}:${(p.body || '').length}`)
    .sort()
    .join('|');
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
