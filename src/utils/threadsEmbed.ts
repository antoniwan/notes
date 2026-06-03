export type ThreadsOEmbed = {
  html: string;
  width: number;
};

const OEMBED_ENDPOINT = 'https://graph.threads.net/v1.0/oembed';
const SCRIPT_TAG_PATTERN = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;

export async function fetchThreadsOEmbed(url: string, maxwidth = 540): Promise<ThreadsOEmbed> {
  const endpoint = new URL(OEMBED_ENDPOINT);
  endpoint.searchParams.set('url', url);
  endpoint.searchParams.set('maxwidth', String(maxwidth));

  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error(`Threads oEmbed request failed (${response.status}) for ${url}`);
  }

  const data = (await response.json()) as { html?: string; width?: number };
  if (!data.html || typeof data.html !== 'string') {
    throw new Error(`Threads oEmbed response missing html for ${url}`);
  }

  return { html: data.html, width: data.width ?? maxwidth };
}

/** oEmbed HTML includes embed.js; we load that script separately in the component. */
export function stripThreadsEmbedScript(html: string): string {
  return html.replace(SCRIPT_TAG_PATTERN, '').trim();
}
