/**
 * Theme sync contract: components that react to theme changes listen for this event on window.
 * Theme state is read from document.documentElement.classList.contains('dark').
 * Dispatched by ThemeToggle (and others) via:
 *   window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: { theme } }));
 */
export const THEME_CHANGE_EVENT = 'themechange' as const;

export type ThemeChangeEventDetail = { theme?: 'dark' | 'light' };
