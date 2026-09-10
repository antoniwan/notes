import { describe, expect, it, vi } from 'vitest';
import {
  fetchThreadsOEmbed,
  normalizeThreadsPostUrl,
  prepareThreadsEmbedMarkup,
} from './threadsEmbed';

describe('Threads embeds', () => {
  it('normalizes post URLs and removes the remote script', () => {
    expect(normalizeThreadsPostUrl('https://www.threads.net/@person/post/ABC_123?x=1')).toBe(
      'https://www.threads.com/t/ABC_123',
    );
    expect(
      prepareThreadsEmbedMarkup(
        '<blockquote data-theme="light">Post</blockquote><script>x</script>',
      ),
    ).toBe('<blockquote data-theme="auto">Post</blockquote>');
  });

  it('shares one timeout budget across endpoint attempts', async () => {
    const fetchMock = vi.fn(
      (_url: string | URL | Request, init?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          if (init?.signal?.aborted) {
            reject(init.signal.reason);
            return;
          }
          init?.signal?.addEventListener('abort', () => reject(init.signal?.reason), {
            once: true,
          });
        }),
    );

    await expect(
      fetchThreadsOEmbed('https://www.threads.com/t/ABC_123', 540, {
        fetchImpl: fetchMock as unknown as typeof fetch,
        timeoutMs: 10,
      }),
    ).rejects.toBeTruthy();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0]?.[1]?.signal).toBeInstanceOf(AbortSignal);
  });
});
