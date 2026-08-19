import { SITE_URL } from '../consts';

export function enclosureMimeType(imagePath: string): string {
  const lower = imagePath.toLowerCase();
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.webp')) return 'image/webp';
  if (lower.endsWith('.gif')) return 'image/gif';
  if (lower.endsWith('.svg')) return 'image/svg+xml';
  if (lower.endsWith('.avif')) return 'image/avif';
  return 'image/jpeg';
}

/** Strip scripts/styles/handlers and absolutize same-origin href/src for feed readers. */
export function prepareFeedHtml(html: string, siteUrl: string = SITE_URL): string {
  const base = siteUrl.replace(/\/+$/, '');
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, '')
    .replace(/<object\b[^>]*>[\s\S]*?<\/object>/gi, '')
    .replace(/\s(on\w+)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/(href|src)\s*=\s*("|\')\s*javascript:[^"']*\2/gi, '$1="#"')
    .replace(
      /(href|src)="(\/[^"]*)"/g,
      (_m, attr: string, path: string) => `${attr}="${base}${path}"`,
    )
    .replace(
      /(href|src)='(\/[^']*)'/g,
      (_m, attr: string, path: string) => `${attr}='${base}${path}'`,
    );
}
