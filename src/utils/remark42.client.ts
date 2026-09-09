import type { Remark42Instance } from '../types/comments';

type CommentLanguage = 'en' | 'es';
type CommentTheme = 'dark' | 'light';
interface LoadOptions {
  signal?: AbortSignal;
  timeoutMs?: number;
}

/** Keep bootstrap and explicit instances on the same thread, theme, and locale. */
export function buildRemark42Config(
  host: string,
  siteId: string,
  pageUrl: string,
  language: CommentLanguage = 'en',
  theme: CommentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light',
) {
  return {
    host,
    site_id: siteId,
    url: pageUrl,
    theme,
    locale: language,
    components: ['embed'] as const,
    no_footer: true,
  };
}

/** Wait for the embed API, reporting network errors and bounded startup failures. */
export function loadRemark42Script(
  config: ReturnType<typeof buildRemark42Config>,
  { signal, timeoutMs = 15000 }: LoadOptions = {},
): Promise<void> {
  if (signal?.aborted) return Promise.reject(new DOMException('Aborted', 'AbortError'));
  if (typeof window.REMARK42?.createInstance === 'function') return Promise.resolve();

  return new Promise((resolve, reject) => {
    const src = `${config.host.replace(/\/+$/, '')}/web/embed.js`;
    const existing = Array.from(document.scripts).find((script) => script.src === src);
    const script = existing ?? document.createElement('script');
    let settled = false;

    const cleanup = () => {
      window.clearTimeout(timer);
      window.removeEventListener('REMARK42::ready', ready);
      script.removeEventListener('load', ready);
      script.removeEventListener('error', failed);
      signal?.removeEventListener('abort', aborted);
    };
    const finish = (error?: Error) => {
      if (settled) return;
      settled = true;
      cleanup();
      if (error) reject(error);
      else resolve();
    };
    const ready = () => {
      if (typeof window.REMARK42?.createInstance === 'function') finish();
    };
    const failed = () => {
      // A failed request can be fetched again. Keep slow requests for retries,
      // so two copies cannot bootstrap while the first is still downloading.
      script.remove();
      finish(new Error('The comments script could not be loaded.'));
    };
    const aborted = () => finish(new DOMException('Aborted', 'AbortError'));
    const timer = window.setTimeout(
      () => finish(new Error('The comments service did not become ready in time.')),
      timeoutMs,
    );

    window.remark_config = config;
    window.addEventListener('REMARK42::ready', ready);
    script.addEventListener('load', ready);
    script.addEventListener('error', failed);
    signal?.addEventListener('abort', aborted, { once: true });

    if (!existing) {
      script.src = src;
      script.async = true;
      script.defer = true;
      // A request can fail after its caller timed out or left the page.
      // Do not leave that failed element blocking the next retry.
      script.addEventListener('error', () => script.remove(), { once: true });
      document.head.appendChild(script);
    }
    ready();
  });
}

/** Only trust the mounted widget's own initialization message. */
export function isRemark42FrameReady(
  event: Pick<MessageEvent, 'origin' | 'source' | 'data'>,
  host: string,
  frameWindow: Window | null,
): boolean {
  return Boolean(
    frameWindow &&
    event.source === frameWindow &&
    event.origin === new URL(host).origin &&
    event.data &&
    typeof event.data === 'object' &&
    !Array.isArray(event.data) &&
    event.data.inited === true,
  );
}

/** Widget initialization is distinct from successful retrieval of its comments. */
export function waitForRemark42Frame(
  node: HTMLElement,
  host: string,
  { signal, timeoutMs = 15000 }: LoadOptions = {},
): Promise<void> {
  if (signal?.aborted) return Promise.reject(new DOMException('Aborted', 'AbortError'));
  return new Promise((resolve, reject) => {
    const finish = (error?: Error) => {
      window.clearTimeout(timer);
      window.removeEventListener('message', receive);
      signal?.removeEventListener('abort', aborted);
      if (error) reject(error);
      else resolve();
    };
    const receive = (event: MessageEvent) => {
      const frame = node.querySelector('iframe');
      if (isRemark42FrameReady(event, host, frame?.contentWindow ?? null)) finish();
    };
    const aborted = () => finish(new DOMException('Aborted', 'AbortError'));
    const timer = window.setTimeout(
      () => finish(new Error('The comments box did not initialize in time.')),
      timeoutMs,
    );
    window.addEventListener('message', receive);
    signal?.addEventListener('abort', aborted, { once: true });
  });
}

/** Replace the bootstrap or previous instance instead of adding another iframe. */
export function createRemark42Instance(
  node: HTMLElement,
  host: string,
  siteId: string,
  pageUrl: string,
  language: CommentLanguage = 'en',
): Remark42Instance {
  const api = window.REMARK42;
  if (!api) throw new Error('The comments API is unavailable.');
  api.destroy?.();
  node.replaceChildren();
  const config = buildRemark42Config(host, siteId, pageUrl, language);
  window.remark_config = config;
  return api.createInstance({ node, ...config });
}
