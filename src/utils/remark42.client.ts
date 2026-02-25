import type { Remark42Instance } from '../types/comments';

/**
 * Create a Remark42 embed instance. Call only when window.REMARK42 is defined.
 */
export function createRemark42Instance(
  node: HTMLElement,
  host: string,
  siteId: string,
  pageUrl: string,
): Remark42Instance {
  const isDark = document.documentElement.classList.contains('dark');
  const config = {
    host,
    site_id: siteId,
    url: pageUrl,
    theme: isDark ? 'dark' : 'light',
    components: ['embed'],
    no_footer: false,
  };
  return window.REMARK42!.createInstance({ node, ...config });
}

/**
 * Run callback when REMARK42 is ready (now or later). Handles race where
 * embed.js sets REMARK42 and dispatches REMARK42::ready before our onload/listener runs.
 */
export function whenRemark42Ready(cb: () => void): void {
  if (window.REMARK42) {
    cb();
    return;
  }
  window.addEventListener('REMARK42::ready', cb, { once: true });
}
