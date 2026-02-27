// Remark42 Comments Configuration
// Remark42 is a self-hosted, privacy-focused comment system with social login support.
// You need a running Remark42 instance — see docs/comments-setup.md for deployment instructions.

import type { CommentsConfig } from '../types/comments';

/** Strip trailing slashes so script URLs stay consistent and querySelector finds existing script. */
function normalizeHost(url: string): string {
  return url.replace(/\/+$/, '');
}

const rawHost =
  import.meta.env.PUBLIC_REMARK42_HOST || 'https://notes.antoniwan.online/api/remark42';

export const commentsConfig: CommentsConfig = {
  // Remark42 server host URL (normalized, no trailing slash)
  host: normalizeHost(rawHost),

  // Site ID configured in your Remark42 instance (Railway default is 'remark42')
  siteId: import.meta.env.PUBLIC_REMARK42_SITE_ID || 'remark42',

  // Default language
  lang: 'en',

  // Components to load
  components: ['embed'] as const,
};
