/**
 * Site chrome (header, footer, menus, search) in the page's language. Spanish pages
 * get Spanish chrome; the links still lead to the English pages unless a Spanish one
 * exists (the Field Guide, the Spanish feed).
 */
export type SiteLanguage = 'en' | 'es';

const en = {
  skipToContent: 'Skip to main content',
  home: 'Home',
  mainNavigation: 'Main navigation',
  mobileNavigation: 'Mobile navigation',
  openMenu: 'Open menu',
  closeMenu: 'Close menu',
  menu: 'Menu',
  searchTheNotes: 'Search the notes',
  search: 'Search',
  searchNotes: 'Search notes',
  searchPlaceholder: 'Search notes…',
  searchPlaceholderLong: 'Search notes, topics, and pages…',
  searchWritings: 'Search writings',
  clearSearch: 'Clear search',
  searchResults: 'Search results',
  searching: 'Searching...',
  noResults: 'No results found',
  noResultsHint: 'Try searching for writings, categories, topics, or pages',
  searchUnavailable: 'Search is unavailable',
  searchUnavailableHint:
    'The search index could not be loaded. Check your connection and try again.',
  toggleTheme: 'Toggle theme',
  backToTop: 'Back to top',
  read: 'Read',
  aboutAndContact: 'About & contact',
  connect: 'Connect',
  contentLicense: 'Content: CC BY-NC-SA 4.0',
  codeLicense: 'Code: MIT',
  siteInformation: 'Site information',
  sitemap: 'Sitemap',
  rssFeed: 'RSS feed',
  siteSource: 'Site source, ',
};

export type SiteStrings = typeof en;

const es: SiteStrings = {
  skipToContent: 'Saltar al contenido principal',
  home: 'Inicio',
  mainNavigation: 'Navegación principal',
  mobileNavigation: 'Navegación móvil',
  openMenu: 'Abrir el menú',
  closeMenu: 'Cerrar el menú',
  menu: 'Menú',
  searchTheNotes: 'Buscar en las notas',
  search: 'Buscar',
  searchNotes: 'Buscar en las notas',
  searchPlaceholder: 'Buscar en las notas…',
  searchPlaceholderLong: 'Buscar notas, temas y páginas…',
  searchWritings: 'Buscar escritos',
  clearSearch: 'Borrar la búsqueda',
  searchResults: 'Resultados de la búsqueda',
  searching: 'Buscando...',
  noResults: 'No hay resultados',
  noResultsHint: 'Pruebe con escritos, categorías, temas o páginas',
  searchUnavailable: 'La búsqueda no está disponible',
  searchUnavailableHint:
    'No se pudo cargar el índice de búsqueda. Verifique su conexión e intente otra vez.',
  toggleTheme: 'Cambiar el tema',
  backToTop: 'Volver arriba',
  read: 'Leer',
  aboutAndContact: 'Sobre mí y contacto',
  connect: 'Contacto',
  contentLicense: 'Contenido: CC BY-NC-SA 4.0',
  codeLicense: 'Código: MIT',
  siteInformation: 'Información del sitio',
  sitemap: 'Mapa del sitio',
  rssFeed: 'Feed RSS en español',
  siteSource: 'Código del sitio, ',
};

export function siteStrings(lang: SiteLanguage = 'en'): SiteStrings {
  return lang === 'es' ? es : en;
}
