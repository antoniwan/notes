export type ThreadsOEmbed = {
  html: string;
  width: number;
};

const OEMBED_ENDPOINTS = [
  'https://graph.threads.net/v1.0/oembed',
  'https://graph.threads.com/v1.0/oembed',
] as const;

const SCRIPT_TAG_PATTERN = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
const THREADS_POST_PATH = /threads\.(?:com|net)\/(?:@[^/]+\/post\/|t\/)([A-Za-z0-9_-]+)/i;

/** Canonical post URL for oEmbed (strips tracking query params). */
export function normalizeThreadsPostUrl(url: string): string {
  const trimmed = url.trim();
  const match = trimmed.match(THREADS_POST_PATH);
  if (match?.[1]) {
    return `https://www.threads.com/t/${match[1]}`;
  }
  return trimmed.split('?')[0] ?? trimmed;
}

export async function fetchThreadsOEmbed(url: string, maxwidth = 540): Promise<ThreadsOEmbed> {
  const canonicalUrl = normalizeThreadsPostUrl(url);
  let lastError: Error | null = null;

  for (const base of OEMBED_ENDPOINTS) {
    const endpoint = new URL(base);
    endpoint.searchParams.set('url', canonicalUrl);
    endpoint.searchParams.set('maxwidth', String(maxwidth));

    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        lastError = new Error(`Threads oEmbed failed (${response.status}) via ${base}`);
        continue;
      }

      const data = (await response.json()) as { html?: string; width?: number };
      if (!data.html || typeof data.html !== 'string') {
        lastError = new Error(`Threads oEmbed missing html via ${base}`);
        continue;
      }

      return { html: data.html, width: data.width ?? maxwidth };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
    }
  }

  throw lastError ?? new Error(`Threads oEmbed failed for ${canonicalUrl}`);
}

/** oEmbed HTML includes embed.js; we load that script separately. Prefer auto theme. */
export function prepareThreadsEmbedMarkup(html: string): string {
  return stripThreadsEmbedScript(html).replace(/data-theme="light"/gi, 'data-theme="auto"');
}

export function stripThreadsEmbedScript(html: string): string {
  return html.replace(SCRIPT_TAG_PATTERN, '').trim();
}
