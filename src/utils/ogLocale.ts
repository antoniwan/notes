/**
 * hreflang for a content language. Spanish here is Puerto Rican Spanish, so it is
 * always es-PR (never es or es-ES); English stays unregioned.
 */
export function hreflangFor(lang: string | undefined): string {
  return lang === 'es' ? 'es-PR' : lang || 'en';
}

/** Map head hreflang codes to Open Graph locale tags (skip x-default). */
export function ogLocaleAlternatesFromHreflang(
  alternates: Array<{ hreflang: string; href: string }> | undefined,
  currentOgLocale: string,
): string[] {
  if (!alternates?.length) return [];
  const out = new Set<string>();
  for (const alt of alternates) {
    if (alt.hreflang === 'x-default') continue;
    const og =
      alt.hreflang === 'es'
        ? 'es_PR'
        : alt.hreflang === 'en'
          ? 'en_US'
          : alt.hreflang.includes('_')
            ? alt.hreflang
            : alt.hreflang.replace('-', '_');
    if (og && og !== currentOgLocale) out.add(og);
  }
  return [...out];
}
