const MOBILE_QUERY = '(max-width: 1023px)';

function setOpenState(modal: HTMLElement, trigger: HTMLButtonElement, isOpen: boolean) {
  modal.classList.toggle('hidden', !isOpen);
  trigger.setAttribute('aria-expanded', String(isOpen));
}

function updateActiveLink(links: HTMLAnchorElement[]) {
  const headingIds = links
    .map((link) => link.getAttribute('data-post-toc-link'))
    .filter((id): id is string => Boolean(id));

  if (headingIds.length === 0) return;

  const headingElements = headingIds
    .map((id) => document.getElementById(id))
    .filter((el): el is HTMLElement => Boolean(el));

  if (headingElements.length === 0) return;

  const activeHeading = headingElements
    .filter((heading) => heading.getBoundingClientRect().top <= 140)
    .at(-1);

  if (!activeHeading) return;

  const activeId = activeHeading.id;
  links.forEach((link) => {
    const target = link.getAttribute('data-post-toc-link');
    link.setAttribute('data-active', target === activeId ? 'true' : 'false');
  });
}

function initPostToc() {
  const container = document.querySelector<HTMLElement>('[data-post-toc]');
  const trigger = document.querySelector<HTMLButtonElement>('[data-post-toc-trigger]');
  const modal = document.querySelector<HTMLElement>('[data-post-toc-modal]');

  if (!container || !trigger || !modal) return;

  const closeButton = modal.querySelector<HTMLButtonElement>('[data-post-toc-close]');
  const links = Array.from(modal.querySelectorAll<HTMLAnchorElement>('[data-post-toc-link]'));
  const mediaQuery = window.matchMedia(MOBILE_QUERY);

  setOpenState(modal, trigger, false);

  const openModal = () => setOpenState(modal, trigger, true);
  const closeModal = () => setOpenState(modal, trigger, false);

  trigger.addEventListener('click', () => {
    const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
    setOpenState(modal, trigger, !isExpanded);
  });

  closeButton?.addEventListener('click', closeModal);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeModal();
  });

  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });

  links.forEach((link) => {
    link.addEventListener('click', () => {
      if (mediaQuery.matches) {
        closeModal();
      } else {
        openModal();
      }
    });
  });

  document.addEventListener('scroll', () => updateActiveLink(links), { passive: true });
  updateActiveLink(links);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPostToc);
} else {
  initPostToc();
}

document.addEventListener('astro:page-load', initPostToc);
