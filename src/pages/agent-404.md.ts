// Answers an AI agent that asks for Markdown (Accept: text/markdown) at an address with no page.
// vercel.json sends only those requests here, and only after the site's own files miss, so a
// browser still gets the normal HTML 404 and every real page is untouched.
import type { APIRoute } from 'astro';
import { SITE_URL } from '../consts';

export const prerender = false;

const BODY = `# Page not found (404)

There is no page at this address on Notes. The link may be old or mistyped.

Try one of these instead:

- [llms.txt](${SITE_URL}/llms.txt): a plain-text guide to this site, written for AI agents
- [Sitemap](${SITE_URL}/sitemap-index.xml): the address of every page
- [Home page](${SITE_URL}/)
`;

export const ALL: APIRoute = () =>
  new Response(BODY, {
    status: 404,
    headers: {
      'content-type': 'text/markdown; charset=utf-8',
      'cache-control': 'public, max-age=3600',
      vary: 'Accept',
      'x-robots-tag': 'noindex',
    },
  });
