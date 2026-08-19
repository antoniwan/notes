// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';
import { SITE_URL } from './src/consts';
import { remarkReadingTime } from './remark-reading-time.mjs';
import { remarkDemoteMarkdownH1 } from './src/utils/remarkDemoteMarkdownH1.mjs';
import { buildSeoRedirects, shouldIncludeInSitemap } from './src/utils/seoRouting';
import { indexNowIntegration } from './src/utils/indexNow';
import {
  getSitemapLastmodByUrl,
  getSitemapTranslationLinksByUrl,
} from './src/utils/sitemapTranslations';

/** Vite connect middleware: `/path/` → `/path` before Astro trailingSlash 404. */
function trailingSlashDevRedirectPlugin() {
  return {
    name: 'trailing-slash-dev-redirect',
    /**
     * @param {{ middlewares: { stack: unknown[] } }} server
     */
    configureServer(server) {
      /**
       * @param {import('node:http').IncomingMessage} req
       * @param {import('node:http').ServerResponse} res
       * @param {(err?: unknown) => void} next
       */
      const handler = (req, res, next) => {
        const raw = req.url ?? '/';
        const qIndex = raw.indexOf('?');
        const pathname = qIndex === -1 ? raw : raw.slice(0, qIndex);
        const search = qIndex === -1 ? '' : raw.slice(qIndex);

        if (pathname.length > 1 && pathname.endsWith('/')) {
          res.statusCode = 301;
          res.setHeader('Location', `${pathname.replace(/\/+$/, '') || '/'}${search}`);
          res.end();
          return;
        }

        next();
      };

      // Post hook: run after Vite/Astro install their middlewares, then jump to front.
      return () => {
        server.middlewares.stack.unshift({ route: '', handle: handler });
      };
    },
  };
}

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'never',
  redirects: buildSeoRedirects(),
  fonts: [
    {
      name: 'DM Sans',
      cssVariable: '--font-sans',
      provider: fontProviders.fontsource(),
      weights: [300, 400, 500, 600, 700, 800],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
    },
    {
      name: 'Fraunces',
      cssVariable: '--font-heading',
      provider: fontProviders.fontsource(),
      weights: [400, 500, 600, 700, 800, 900],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
    },
    {
      name: 'Literata',
      cssVariable: '--font-serif',
      provider: fontProviders.fontsource(),
      weights: [300, 400, 500, 600, 700, 800],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
    },
    {
      name: 'JetBrains Mono',
      cssVariable: '--font-mono',
      provider: fontProviders.fontsource(),
      weights: [300, 400, 500, 600, 700],
      styles: ['normal'],
      subsets: ['latin'],
    },
  ],
  integrations: [
    mdx(),
    sitemap({
      filter: shouldIncludeInSitemap,
      // Slug-based EN/ES pairs (translationGroup) — not path-prefix i18n.
      // lastmod + links maps are filesystem-derived (safe to import at config load).
      serialize(item) {
        const lastmod = getSitemapLastmodByUrl().get(item.url);
        if (lastmod) {
          item.lastmod = lastmod.toISOString();
        }
        const links = getSitemapTranslationLinksByUrl().get(item.url);
        if (links && links.length > 1) {
          item.links = links;
        }
        return item;
      },
    }),
    indexNowIntegration(),
  ],
  adapter: vercel(),
  markdown: {
    syntaxHighlight: 'shiki',
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
    processor: unified({
      remarkPlugins: [remarkReadingTime, remarkDemoteMarkdownH1],
      gfm: true,
      smartypants: true,
    }),
  },
  // Enable built-in prefetch with optimized settings
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
  // Enhanced image optimization
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
    domains: ['notes.antoniwan.online'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'notes.antoniwan.online',
        pathname: '/images/**',
      },
    ],
  },
  // Build optimizations
  build: {
    inlineStylesheets: 'auto', // Inline small stylesheets
  },
  // Vite optimizations for better performance
  vite: {
    plugins: [trailingSlashDevRedirectPlugin(), tailwindcss()],
    server: {
      watch: {
        // Polling can break HMR on macOS; use native events for hot-reload
        usePolling: false,
      },
      hmr: true,
      // Optimize dev server performance
      fs: {
        // Limit file system access for faster startup
        strict: false,
      },
    },
    build: {
      cssMinify: true,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true, // Remove console.log in production
          drop_debugger: true,
        },
      },
      rollupOptions: {
        output: {
          manualChunks(id) {
            // Split vendor chunks for better caching
            if (id.includes('node_modules')) {
              // Core Astro dependencies
              if (id.includes('astro') || id.includes('@astrojs')) {
                return 'vendor-astro';
              }
              // Date utilities
              if (id.includes('date-fns')) {
                return 'vendor-date';
              }
              // NLP and analysis libraries
              if (id.includes('sentiment')) {
                return 'vendor-nlp';
              }
              // Other vendor dependencies
              return 'vendor';
            }
            // Split brain-science utilities into separate chunk
            if (id.includes('brainScience') || id.includes('brain-science')) {
              return 'brain-science';
            }
          },
        },
      },
    },
    css: {
      devSourcemap: true, // Enable sourcemaps in dev for better HMR
    },
    optimizeDeps: {
      include: ['@astrojs/mdx', 'date-fns', 'reading-time', 'sentiment'],
      // Exclude heavy dependencies from pre-bundling in dev
      exclude: [],
    },
    // Improve dev server performance
    esbuild: {
      // Only process changed files in dev
      logOverride: { 'this-is-undefined-in-esm': 'silent' },
    },
    // Reduce dev server overhead
    ssr: {
      // Don't externalize these in dev for faster HMR
      noExternal: [],
    },
  },
});
