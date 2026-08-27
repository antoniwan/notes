import type { Remark42Instance } from '../types/comments';

/** Shared embed config so the script bootstrap and createInstance stay in sync. */
export function buildRemark42Config(host: string, siteId: string, pageUrl: string) {
  const isDark = document.documentElement.classList.contains('dark');
  return {
    host,
    site_id: siteId,
    url: pageUrl,
    theme: (isDark ? 'dark' : 'light') as 'dark' | 'light',
    components: ['embed'] as const,
    // Nobody uses the Remark42 marketing link; keep the thread chrome only.
    no_footer: true,
  };
}

function hideRemark42Footer(node: HTMLElement, attempt = 0) {
  const iframe = node.querySelector('iframe');
  if (!iframe) {
    if (attempt < 20) {
      window.setTimeout(() => hideRemark42Footer(node, attempt + 1), 50);
    }
    return;
  }

  const apply = () => {
    try {
      const doc = iframe.contentDocument;
      if (!doc || doc.getElementById('notes-hide-remark42-footer')) return;
      const style = doc.createElement('style');
      style.id = 'notes-hide-remark42-footer';
      style.textContent =
        '.root__copyright{display:none!important;margin:0!important;height:0!important;overflow:hidden!important}';
      doc.head.appendChild(style);
    } catch {
      // Cross-origin: no_footer on the config is the primary hide.
    }
  };

  apply();
  iframe.addEventListener('load', apply);
}

/**
 * Create a Remark42 embed instance. Call only when window.REMARK42 is defined.
 */
export function createRemark42Instance(
  node: HTMLElement,
  host: string,
  siteId: string,
  pageUrl: string,
): Remark42Instance {
  const instance = window.REMARK42!.createInstance({
    node,
    ...buildRemark42Config(host, siteId, pageUrl),
  });
  // Footer CSS is inside the iframe; apply after the frame paints.
  requestAnimationFrame(() => hideRemark42Footer(node));
  return instance;
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
