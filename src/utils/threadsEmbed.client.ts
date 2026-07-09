const EMBED_SCRIPT_SRC = 'https://www.threads.com/embed.js';
const EMBED_SCRIPT_ID = 'threads-embed-sdk';

type ThreadsEmbedGlobal = {
  __threadsEmbedLoading?: Promise<void>;
};

function getGlobal(): ThreadsEmbedGlobal {
  return globalThis as ThreadsEmbedGlobal;
}

/** Sync blockquote theme with the site before Meta's SDK reads attributes. */
export function syncThreadsEmbedTheme(root: ParentNode = document): void {
  const theme =
    document.documentElement.classList.contains('dark') ||
    document.documentElement.getAttribute('data-theme') === 'dark'
      ? 'dark'
      : 'light';

  root.querySelectorAll('.threads-embed blockquote.text-post-media').forEach((node) => {
    node.setAttribute('data-theme', theme);
  });
}

function loadThreadsEmbedScript(): Promise<void> {
  const g = getGlobal();
  if (g.__threadsEmbedLoading) {
    return g.__threadsEmbedLoading;
  }

  g.__threadsEmbedLoading = new Promise((resolve, reject) => {
    const existing = document.getElementById(EMBED_SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      if (existing.dataset.loaded === 'true') {
        resolve();
        return;
      }
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener(
        'error',
        () => reject(new Error('Threads embed.js failed to load')),
        {
          once: true,
        },
      );
      return;
    }

    const script = document.createElement('script');
    script.id = EMBED_SCRIPT_ID;
    script.async = true;
    script.src = EMBED_SCRIPT_SRC;
    script.onload = () => {
      script.dataset.loaded = 'true';
      resolve();
    };
    script.onerror = () => reject(new Error('Threads embed.js failed to load'));
    document.head.appendChild(script);
  });

  return g.__threadsEmbedLoading;
}

/** Ensure Meta's embed SDK runs after our blockquotes are in the DOM. */
export async function initThreadsEmbeds(root: ParentNode = document): Promise<void> {
  const frames = root.querySelectorAll('.threads-embed__frame');
  if (frames.length === 0) {
    return;
  }

  syncThreadsEmbedTheme(root);

  try {
    await loadThreadsEmbedScript();
    // SDK registers on load; give it a tick to scan newly inserted blockquotes.
    await new Promise((resolve) => window.setTimeout(resolve, 0));
    syncThreadsEmbedTheme(root);
  } catch {
    root.querySelectorAll('.threads-embed__frame').forEach((frame) => {
      frame.classList.add('threads-embed__frame--failed');
    });
  }
}
