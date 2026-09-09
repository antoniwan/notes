const DESKTOP_QUERY = '(min-width: 1200px)';

type TocEntry = {
  link: HTMLAnchorElement;
  heading: HTMLElement;
};

function initPostToc() {
  const container = document.querySelector<HTMLElement>('[data-post-toc]');
  if (!container || container.dataset.tocInitialized === 'true') return;

  const trigger = container.querySelector<HTMLButtonElement>('[data-post-toc-trigger]');
  const panel = container.querySelector<HTMLElement>('[data-post-toc-modal]');
  if (!trigger || !panel) return;

  container.dataset.tocInitialized = 'true';
  const closeButton = panel.querySelector<HTMLButtonElement>('[data-post-toc-close]');
  const links = Array.from(panel.querySelectorAll<HTMLAnchorElement>('[data-post-toc-link]'));
  const entries = links.flatMap<TocEntry>((link) => {
    const id = link.dataset.postTocLink;
    const heading = id ? document.getElementById(id) : null;
    return heading ? [{ link, heading }] : [];
  });
  const desktop = window.matchMedia(DESKTOP_QUERY);
  const afterword = document.querySelector<HTMLElement>('.post-afterword');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const controller = new AbortController();
  const { signal } = controller;
  let frame = 0;
  let headingOffset = 104;
  let activeLink: HTMLAnchorElement | undefined;

  const isOpen = () => container.dataset.open === 'true';

  const setOpen = (open: boolean) => {
    container.dataset.open = String(open);
    trigger.setAttribute('aria-expanded', String(open));
  };

  const closePanel = (restoreFocus = true) => {
    if (!isOpen()) return;
    setOpen(false);
    if (restoreFocus && !desktop.matches && !trigger.hidden) trigger.focus({ preventScroll: true });
  };

  const updateTriggerVisibility = () => {
    const pastArticle =
      !desktop.matches &&
      Boolean(afterword && afterword.getBoundingClientRect().top <= window.innerHeight);
    trigger.hidden = pastArticle;
    if (pastArticle) closePanel(false);
  };

  const openPanel = () => {
    if (desktop.matches || trigger.hidden) return;
    setOpen(true);
    const target = activeLink || entries[0]?.link || closeButton;
    target?.focus({ preventScroll: true });
    target?.scrollIntoView({ block: 'nearest', behavior: 'instant' });
  };

  const updateActiveLink = () => {
    frame = 0;
    updateTriggerVisibility();
    activeLink = undefined;
    for (const entry of entries) {
      if (entry.heading.getBoundingClientRect().top <= headingOffset) activeLink = entry.link;
    }
    for (const link of links) {
      const active = link === activeLink;
      link.dataset.active = String(active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  };

  const scheduleUpdate = () => {
    if (!frame) frame = window.requestAnimationFrame(updateActiveLink);
  };

  const updateHeadingOffset = () => {
    const firstHeading = entries[0]?.heading;
    const scrollMargin = firstHeading
      ? Number.parseFloat(window.getComputedStyle(firstHeading).scrollMarginTop)
      : 96;
    headingOffset = (Number.isFinite(scrollMargin) ? scrollMargin : 96) + 8;
    scheduleUpdate();
  };

  const syncViewport = () => {
    const focused = document.activeElement;
    setOpen(false);
    updateTriggerVisibility();
    if (desktop.matches) {
      trigger.removeAttribute('aria-haspopup');
      panel.removeAttribute('role');
      panel.removeAttribute('aria-modal');
      if (focused === trigger || focused === closeButton) {
        (activeLink || entries[0]?.link)?.focus({ preventScroll: true });
      }
    } else {
      trigger.setAttribute('aria-haspopup', 'dialog');
      panel.setAttribute('role', 'dialog');
      panel.setAttribute('aria-modal', 'false');
      if (!trigger.hidden && focused instanceof Node && panel.contains(focused)) {
        trigger.focus({ preventScroll: true });
      }
    }
    updateHeadingOffset();
  };

  trigger.addEventListener('click', () => (isOpen() ? closePanel() : openPanel()), { signal });
  closeButton?.addEventListener('click', () => closePanel(), { signal });

  document.addEventListener(
    'keydown',
    (event) => {
      if (event.key === 'Escape' && isOpen() && !desktop.matches) {
        event.preventDefault();
        closePanel();
      }
    },
    { signal },
  );

  document.addEventListener(
    'pointerdown',
    (event) => {
      if (
        !desktop.matches &&
        isOpen() &&
        event.target instanceof Node &&
        !container.contains(event.target)
      ) {
        closePanel();
      }
    },
    { signal },
  );

  for (const { link, heading } of entries) {
    link.addEventListener(
      'click',
      (event) => {
        if (
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        ) {
          return;
        }
        event.preventDefault();
        closePanel(false);

        // Make the reading destination available to keyboard users without adding a tab stop.
        if (!heading.hasAttribute('tabindex')) {
          heading.setAttribute('tabindex', '-1');
          heading.addEventListener('blur', () => heading.removeAttribute('tabindex'), {
            once: true,
            signal,
          });
        }
        heading.focus({ preventScroll: true });
        heading.scrollIntoView({
          block: 'start',
          behavior: reducedMotion.matches ? 'instant' : 'smooth',
        });
        if (window.location.hash !== link.hash) window.history.pushState(null, '', link.hash);
        scheduleUpdate();
      },
      { signal },
    );
  }

  window.addEventListener('scroll', scheduleUpdate, { passive: true, signal });
  window.addEventListener('resize', updateHeadingOffset, { passive: true, signal });
  window.addEventListener('hashchange', scheduleUpdate, { signal });
  window.addEventListener('pageshow', scheduleUpdate, { signal });
  desktop.addEventListener('change', syncViewport, { signal });
  document.addEventListener(
    'astro:before-swap',
    () => {
      controller.abort();
      window.cancelAnimationFrame(frame);
      delete container.dataset.tocInitialized;
    },
    { once: true, signal },
  );

  syncViewport();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPostToc, { once: true });
} else {
  initPostToc();
}

document.addEventListener('astro:page-load', initPostToc);
